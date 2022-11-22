import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../Context/authContext"
import { Autocomplete } from "../Utils/autoComplete"
import { db } from "../Utils/firebase"
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore"
import { DocumentData } from "@firebase/firestore-types"
import { DefinedDocumentData } from "./ts_fn_commonUse"

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  color: #2d2d2d;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 20px;
`

export const ContentArea = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  margin: 0 auto;
  padding: 15px;
  gap: 20px;
  border: none;
`

const InviWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  padding: 5px 8px;
  width: 50%;
  height: 100%;
  background-color: #ffffff;
  border: none;
  box-shadow: (8px 3px #beb9b9);
  opacity: 0.8;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`

const FriendsWrapper = styled(InviWrapper)``
const ContentWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin: 15px 0;
`
const FilteredWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  margin: 10px 0;
  font-size: 20px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
  }
`
const ContentTitle = styled.div`
  padding: 10px 10px 0 10px;
  font-size: 40px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 30px;
  }
`

const BtnWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-width: 35%;
  margin-right: 10px;
  justify-content: space-between;
  align-self: center;
`
const BtnAccept = styled.div`
  display: flex;
  width: 48%;
  justify-content: center;
  font-family: "Poppins";
  color: #ffffff;
  background-color: #34ca9d;
  border-radius: 3px;
  cursor: pointer;
`
const BtnDeny = styled(BtnAccept)`
  background-color: #ca3434;
`
const BtnVisitLink = styled(BtnAccept)`
  width: 100%;
  margin-right: 0px;
  background-color: #3490ca;
  text-decoration: none;
`
const FilteredContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 2px;
  line-height: 24px;
  height: 24px;
  font-family: "Poppins";
  font-size: 20px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
    line-height: 20px;
    height: 20px;
  }
`

const NameText = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  width: 30%;
  margin: 2px 10px 2px 0px;
  line-height: 24px;
  height: 24px;
  font-family: "Poppins";
  font-size: 20px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
    line-height: 20px;
    height: 20px;
  }
`
const StatusText = styled(NameText)`
  justify-content: end;
  min-width: 35%;
`
const Avatar = styled.img`
  margin: 0 10px 0 10px;
  width: 24px;
  height: 24px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    width: 20px;
    height: 20px;
  }
`
const usersRef = collection(db, "users")
const today = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`

export default function MyFriends() {
  const { currentUser, isLogin, setCurrentFriendInfo } = useContext(AuthContext)
  const [qResultIds, setQResultIds] = useState<string[]>([])
  const [relationships, setRelationships] = useState<
    DocumentData | DefinedDocumentData
  >([])
  const [invitingIds, setInvitingIds] = useState<string[]>([])
  const [invitingList, setInvitingList] = useState<
    DocumentData | DefinedDocumentData
  >([])
  const [beInvitedIds, setBeInvitedIds] = useState<string[]>([])
  const [beInvitedList, setBeInvitedList] = useState<
    DocumentData | DefinedDocumentData
  >([])
  const [friendIds, setFriendIds] = useState<string[]>([])
  const [friends, setFriends] = useState<
    DocumentData[] | DefinedDocumentData[]
  >([])
  const [myFriends, setMyFriends] = useState<string[]>([])

  useEffect(() => {
    const relationRef = collection(db, "relationships")
    const checkRealtimeRelationships = onSnapshot(relationRef, (snapshot) => {
      const newDocs: DocumentData | DefinedDocumentData = []
      snapshot.docs.forEach((doc) => {
        newDocs.push(doc.data())
      })
      setRelationships(newDocs)
    })
    return checkRealtimeRelationships
  }, [])

  useEffect(() => {
    if (typeof currentUser?.id !== "string") return
    const checkRealtimeUserStatus = onSnapshot(
      doc(db, "users", currentUser?.id),
      (doc: DocumentData) => {
        setMyFriends(doc.data().friends)
      }
    )

    return checkRealtimeUserStatus
  }, [currentUser?.id, beInvitedIds])

  useEffect(() => {
    if (!isLogin || currentUser === null) return
    if (relationships && relationships.length !== 0) {
      const newInvitingIds = relationships
        ?.filter((doc: DocumentData | DefinedDocumentData) => {
          return doc.inviter === currentUser?.id && doc.status === "pending"
        })
        .map((item: DocumentData | DefinedDocumentData) => {
          return item.receiver
        })
      setInvitingIds(newInvitingIds)

      const invitedIds = relationships
        ?.filter((doc: DocumentData | DefinedDocumentData) => {
          return doc.receiver === currentUser?.id && doc.status === "pending"
        })
        .map((item: DocumentData | DefinedDocumentData) => {
          return item.inviter
        })
      setBeInvitedIds(invitedIds)
    }
  }, [relationships])

  useEffect(() => {
    const getFriendsList = async () => {
      try {
        if (myFriends.length === 0) return
        const newFriends: DocumentData[] = []
        const q = query(usersRef, where("id", "in", myFriends))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          newFriends.push(doc.data())
        })
        const newIds = newFriends.map((friend) => {
          return friend.id
        })
        setFriendIds(newIds)
        setFriends(newFriends)
      } catch (error) {
        console.log(error)
      }
    }
    getFriendsList()
  }, [myFriends])

  useEffect(() => {
    const getInvitingList = async () => {
      if (invitingIds.length === 0) {
        setInvitingList([])
        return
      }
      try {
        const newInvitings: DocumentData = []
        const q = query(usersRef, where("id", "in", invitingIds))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          newInvitings.push(doc.data())
        })
        setInvitingList(newInvitings)
      } catch (error) {
        console.log(error)
      }
    }
    getInvitingList()
  }, [invitingIds])

  useEffect(() => {
    const getInvitedList = async () => {
      if (beInvitedIds.length === 0) {
        setBeInvitedList([])
        return
      }
      try {
        const newInviteds: DocumentData = []
        const q = query(usersRef, where("id", "in", beInvitedIds))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          newInviteds.push(doc.data())
        })
        setBeInvitedList(newInviteds)
      } catch (error) {
        console.log(error)
      }
    }
    getInvitedList()
  }, [beInvitedIds])

  const acceptFriendReq = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isLogin || currentUser === null) return
    console.log((e.target as Element).id)
    try {
      if (typeof currentUser?.id === "string") {
        const currentUserRef = doc(db, "users", currentUser?.id)
        const inviterRef = doc(db, "users", (e.target as Element).id)
        const currentRelationRef = doc(
          db,
          "relationships",
          `${(e.target as Element).id}${currentUser?.id}`
        )
        await updateDoc(currentUserRef, {
          friends: arrayUnion((e.target as Element).id),
        })
        await updateDoc(inviterRef, {
          friends: arrayUnion(currentUser?.id),
        })
        await updateDoc(currentRelationRef, {
          status: "accept",
          beFriend: today,
        })
        console.log("relation的status已改")
        const newBeInviteds = beInvitedIds.filter((item) => {
          return item !== (e.target as Element).id
        })
        setFriendIds((prev) => {
          return [...prev, (e.target as Element).id]
        })
        setBeInvitedIds(newBeInviteds)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const denyFriendReq = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    try {
      if (typeof currentUser?.id === "string") {
        const currentRelationRef = doc(
          db,
          "relationships",
          `${(e.target as Element).id}${currentUser?.id}`
        )
        await updateDoc(currentRelationRef, {
          status: "reject",
          rejectedDay: today,
        })
        const newBeInviteds = beInvitedIds.filter((item) => {
          return item !== (e.target as Element).id
        })
        setBeInvitedIds(newBeInviteds)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Container>
      <ContentArea>
        <InviWrapper>
          <Autocomplete
            qResultIds={qResultIds}
            setQResultIds={setQResultIds}
            invitingIds={invitingIds}
          />
          <ContentTitle>You are inviting ...</ContentTitle>
          <ContentWrapper>
            {invitingList.length !== 0 &&
              invitingList.map((inviting: DocumentData) => {
                return (
                  <FilteredWrapper key={inviting.id}>
                    <Avatar src={inviting.photoURL} />
                    <NameText>{inviting.name}</NameText>
                    <NameText>{inviting.hometownName}</NameText>
                    <StatusText>Awaiting reply</StatusText>
                  </FilteredWrapper>
                )
              })}
          </ContentWrapper>
          <ContentTitle>They want to be your friend ...</ContentTitle>
          <ContentWrapper>
            {beInvitedList.length !== 0 &&
              beInvitedList.map((invited: DocumentData) => {
                return (
                  <FilteredWrapper key={invited.id}>
                    <Avatar src={invited.photoURL} />
                    <NameText>{invited.name}</NameText>
                    <NameText>{invited.hometownName}</NameText>
                    <BtnWrapper>
                      <BtnAccept
                        id={invited.id}
                        onClick={(
                          e: React.MouseEvent<HTMLDivElement, MouseEvent>
                        ) => {
                          acceptFriendReq(e)
                        }}
                      >
                        Accept
                      </BtnAccept>
                      <BtnDeny
                        id={invited.id}
                        onClick={(
                          e: React.MouseEvent<HTMLDivElement, MouseEvent>
                        ) => {
                          denyFriendReq(e)
                        }}
                      >
                        Deny
                      </BtnDeny>
                    </BtnWrapper>
                  </FilteredWrapper>
                )
              })}
          </ContentWrapper>
        </InviWrapper>
        <FriendsWrapper>
          <ContentTitle>Here are your friends!</ContentTitle>
          {friends.length !== 0 ? (
            friends.map((friend: DocumentData) => {
              return (
                <FilteredWrapper key={friend.id}>
                  <Avatar src={friend.photoURL} />
                  <NameText>{friend.name}</NameText>
                  <NameText>{friend.hometownName}</NameText>
                  <BtnWrapper>
                    <BtnVisitLink
                      to={`/${currentUser?.name}/my-friend/${friend.name}/${friend.id}`}
                      as={Link}
                      id={friend.id}
                      onClick={() => {
                        setCurrentFriendInfo({
                          name: friend.name,
                          id: friend.id,
                        })
                      }}
                    >
                      Visit friend
                    </BtnVisitLink>
                  </BtnWrapper>
                </FilteredWrapper>
              )
            })
          ) : (
            <>
              <FilteredContent>No friends</FilteredContent>
            </>
          )}
        </FriendsWrapper>
      </ContentArea>
    </Container>
  )
}

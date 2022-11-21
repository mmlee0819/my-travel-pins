import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../Context/authContext"
import {
  Autocomplete,
  FilteredWrapper,
  UserAvatar,
  BtnDefault,
  BtnAccept,
  BtnDeny,
} from "../Utils/autoComplete"
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
  flex-flow: column wrap;
  padding: 5px 8px;
  width: 50%;
  background-color: #ffffff;
  border: none;
  box-shadow: (8px 3px #beb9b9);
  opacity: 0.9;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`
const FriendsWrapper = styled(InviWrapper)``
const ContentTitle = styled.div`
  padding: 10px;
  font-size: 50px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 40px;
  }
`
const RowWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  width: 100%;
`
const BtnWrapper = styled.div`
  display: flex;
  width: 50%;
  justify-content: space-around;
  align-self: center;
  margin-top: 10px;
  margin-bottom: 20px;
  line-height: 16px;
  height: 16px;
`
const BtnVisitLink = styled(BtnDefault)`
  text-decoration: none;
`
const FilteredContent = styled.div`
  margin: 2px;
  align-self: center;
  font-family: "Poppins";
  line-height: 16px;
  height: 16px;
  font-size: 24px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 18px;
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
    console.log("myFriends", myFriends)
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
          console.log(doc.id, " => ", doc.data())
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
          {invitingList.length !== 0
            ? invitingList.map((inviting: DocumentData) => {
                return (
                  <FilteredWrapper key={inviting.id}>
                    <UserAvatar src={inviting.photoURL} />
                    <FilteredContent>{inviting.name}</FilteredContent>
                    <FilteredContent>{inviting.hometownName}</FilteredContent>
                    <FilteredContent>Awaiting reply</FilteredContent>
                  </FilteredWrapper>
                )
              })
            : ""}
          <ContentTitle>They want to be your friend ...</ContentTitle>
          {beInvitedList.length !== 0
            ? beInvitedList.map((invited: DocumentData) => {
                return (
                  <RowWrapper key={invited.id}>
                    <FilteredWrapper>
                      <UserAvatar src={invited.photoURL} />
                      <FilteredContent>{invited.name}</FilteredContent>
                      <FilteredContent>{invited.hometownName}</FilteredContent>
                    </FilteredWrapper>
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
                  </RowWrapper>
                )
              })
            : "none"}
        </InviWrapper>
        <FriendsWrapper>
          <ContentTitle>
            Here are your friends.
            <br />
            Visit someone!
          </ContentTitle>
          {friends.length !== 0 ? (
            friends.map((friend: DocumentData) => {
              return (
                <FilteredWrapper key={friend.id}>
                  <UserAvatar src={friend.photoURL} />
                  <FilteredContent>{friend.name}</FilteredContent>
                  <FilteredContent>{friend.hometownName}</FilteredContent>
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

// export default MyFriends

import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../Context/authContext"
import {
  Autocomplete,
  FilteredWrapper,
  UserAvatar,
  FilteredContent,
  BtnDefault,
  BtnAccept,
  BtnDeny,
} from "../Utils/autoComplete"
import { db } from "../Utils/firebase"
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore"
import { DocumentData } from "@firebase/firestore-types"

const NavWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 80%;
  margin: 0 auto;
`
const Title = styled.div`
  color: #000000;
`

const BtnLink = styled(Link)`
  margin: 0 20px;
`

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin: 0 20px;
  font-size: 14px;
`
const TabWrapper = styled(Container)`
  flex-flow: row nowrap;
  margin: 30px auto 0 30px;
  font-size: 20px;
  gap: 30px;
`
const TabLink = styled(Link)`
  padding: 5px 8px;
  width: 100px;
  text-align: center;
  color: #000000;
  text-decoration: none;
  cursor: pointer;
  &:visited {
    color: #000000;
  }
  &:hover {
    color: #2d65be;
  }
  &:active {
    color: #000000;
  }
`
const TabTitle = styled.div`
  padding: 5px 8px;
  width: 100px;
  text-align: center;
  color: #2d65be;
  border: 1px solid #beb9b9;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: none;
`
const ContentArea = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  border: 1px solid #beb9b9;
  border-top: none;
`
const SplitWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 0;
  padding: 0;
`
const LeftSplit = styled.div`
  width: 160px;
  border-top: 1px solid #beb9b9;
`
const RightSplit = styled(LeftSplit)`
  flex: 1 1 auto;
  margin-left: 100px;
`
const ContentWrapper = styled(ContentArea)`
  margin: 0 auto;
  padding: 15px;
  gap: 20px;
  border: none;
`

const InviWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  padding: 5px 8px;
  width: 40%;
  border: 1px solid #beb9b9;
`
const FriendsWrapper = styled(InviWrapper)`
  width: 60%;
`
const ContentTitle = styled.div`
  font-size: 1rem;
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
interface DefinedDocumentData {
  [field: string]: string | number | null | undefined | string[]
}

const usersRef = collection(db, "users")
const today = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`

function MyFriends() {
  const { currentUser, isLogin } = useContext(AuthContext)
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
  console.log("currentUser", currentUser)
  console.log("relationships", relationships)
  console.log("friendIds", friendIds)
  console.log("friends", friends)
  console.log("myFriends", myFriends)
  console.log("invitingIds", invitingIds)
  console.log("beInvitedIds", beInvitedIds)
  console.log("invitingList", invitingList)
  console.log("beInviedList", beInvitedList)

  useEffect(() => {
    const relationRef = collection(db, "relationships")
    const checkRealtimeRelationships = onSnapshot(relationRef, (snapshot) => {
      const newDocs: DocumentData | DefinedDocumentData = []
      snapshot.docs.forEach((doc) => {
        newDocs.push(doc.data())
        console.log(newDocs)
      })
      console.log("newDocs", newDocs)
      setRelationships(newDocs)
    })
    return checkRealtimeRelationships
  }, [])

  useEffect(() => {
    console.log("typeof currentUser?.id", typeof currentUser?.id)
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
          console.log(doc.id, " => ", doc.data())
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
        console.log("我在這")
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
        console.log("currentUser的好友陣列已新增")
        await updateDoc(inviterRef, {
          friends: arrayUnion(currentUser?.id),
        })
        console.log("對方的好友陣列已新增")
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
  return (
    <>
      <NavWrapper>
        {isLogin && currentUser !== undefined ? (
          <>
            <Title>我是user的好友列表</Title>
            <BtnLink to="/">HOME</BtnLink>
            <BtnLink to={`/${currentUser?.name}`}>My-map</BtnLink>
            <BtnLink to={`/${currentUser?.name}/my-memories`}>
              my-memories
            </BtnLink>
          </>
        ) : (
          <Title>你沒有登入</Title>
        )}
      </NavWrapper>
      <Container>
        <TabWrapper>
          <TabLink to={`/${currentUser?.name}`}>My Memories</TabLink>
          <TabTitle>My Friends</TabTitle>
        </TabWrapper>
        <SplitWrapper>
          <LeftSplit />
          <RightSplit />
        </SplitWrapper>
        <ContentArea>
          <ContentWrapper>
            <InviWrapper>
              <Autocomplete
                qResultIds={qResultIds}
                setQResultIds={setQResultIds}
              />
              {invitingList.length !== 0
                ? invitingList.map((inviting: DocumentData) => {
                    return (
                      <FilteredWrapper key={inviting.id}>
                        <UserAvatar src={inviting.photoURL} />
                        <FilteredContent>{inviting.name}</FilteredContent>
                        <FilteredContent>
                          {inviting.hometownName}
                        </FilteredContent>
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
                          <FilteredContent>
                            {invited.hometownName}
                          </FilteredContent>
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
                          <BtnDeny>Deny</BtnDeny>
                        </BtnWrapper>
                      </RowWrapper>
                    )
                  })
                : "none"}
            </InviWrapper>
            <FriendsWrapper>
              {friends.length !== 0 ? (
                friends.map((friend: DocumentData) => {
                  return (
                    <FilteredWrapper key={friend.id}>
                      <UserAvatar src={friend.photoURL} />
                      <FilteredContent>{friend.name}</FilteredContent>
                      <FilteredContent>{friend.hometownName}</FilteredContent>
                      <BtnDefault>Visit friend</BtnDefault>
                    </FilteredWrapper>
                  )
                })
              ) : (
                <>
                  <FilteredContent>No friends</FilteredContent>
                </>
              )}
            </FriendsWrapper>
          </ContentWrapper>
        </ContentArea>
      </Container>
    </>
  )
}

export default MyFriends

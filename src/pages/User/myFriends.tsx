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
} from "firebase/firestore"
import { DocumentData, QueryDocumentSnapshot } from "@firebase/firestore-types"

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
  [field: string]: string | number | null | undefined
}

const usersRef = collection(db, "users")

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
  const [friends, setFriends] = useState<DocumentData>([])
  console.log("relationships", relationships)
  console.log("friends", friends)
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
    if (!currentUser?.friends) return
    const getFriendsList = async () => {
      try {
        const newFriends: DocumentData = []
        const q = query(usersRef, where("id", "in", currentUser?.friends))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data())
          newFriends.push(doc.data())
        })
        setFriends(newFriends)
      } catch (error) {
        console.log(error)
      }
    }
    getFriendsList()
  }, [currentUser?.friends])

  useEffect(() => {
    if (!invitingIds) return
    const getInvitingList = async () => {
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
    if (!beInvitedIds) return
    const getInvitedList = async () => {
      try {
        const newInviteds: DocumentData = []
        const q = query(usersRef, where("id", "in", beInvitedIds))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data())
          newInviteds.push(doc.data())
        })
        setBeInvitedList(newInviteds)
      } catch (error) {
        console.log(error)
      }
    }
    getInvitedList()
  }, [beInvitedIds])
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
                        <FilteredContent>Awaitint reply</FilteredContent>
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
                          <BtnAccept>Accept</BtnAccept>
                          <BtnDeny>Deny</BtnDeny>
                        </BtnWrapper>
                      </RowWrapper>
                    )
                  })
                : ""}
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

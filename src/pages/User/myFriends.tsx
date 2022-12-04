import React from "react"
import styled from "styled-components"
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
import { DefinedDocumentData } from "./functions/pins"
import { Container } from "../Components/styles/memoriesStyles"

const FixArea = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  width: 100%;
  margin: 0 auto;
  padding: 50px;
  padding-top: 20px;
  gap: 25px;
  border: none;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`
const ContentArea = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 120px;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 50px;
  padding-top: 20px;
  gap: 25px;
  border: none;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`
const FriendWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 0 auto;
  width: 100%;
  height: 120px;
  min-width: 150px;
  background-color: #ffffffc2;
  border-radius: 5px;
  box-shadow: rgb(120 120 120) 0px 0px 5px;
  cursor: pointer;
  &:hover {
    box-shadow: rgb(120 120 120) 0px 0px 15px;
  }
`
const ImgWrapper = styled.div`
  position: relative;
  display: block;
  margin: 20px;
  width: 80px;
  height: 80px;
  background-color: ${(props) => props.theme.btnColor.bgGreen};
  object-fit: cover;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`
const UserImg = styled.img`
  display: block;
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
`
const UserInfo = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-self: center;
  margin: 20px;
  margin-left: 0;
  width: calc(100% - 290px);
  font-size: ${(props) => props.theme.title.md};
  border: none;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`
const HomeTownText = styled.div`
  font-size: 18px;
`

const BtnSort = styled.div<{ isCurrent: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 160px;
  line-height: 20px;
  height: 40px;
  font-size: ${(props) => props.theme.title.md};
  color: ${(props) => (props.isCurrent ? "#fff" : props.theme.color.deepMain)};
  background-color: ${(props) =>
    props.isCurrent ? props.theme.color.deepMain : "none"};
  border-radius: 5px;
  border: 1px solid
    ${(props) => (props.isCurrent ? "none" : props.theme.btnColor.bgGray)};
  cursor: pointer;
`
const FrReqWrapper = styled.div``
// export const Container = styled.div`
//   position: relative;
//   margin: 0 auto;
//   max-width: 1440px;
//   width: 100%;
//   color: ${(props) => props.theme.color.bgDark};
//   height: calc(100vh - 120px);
//   background-color: rgb(255, 255, 255, 0.1);
//   border-radius: 20px;
// `

// export const ContentArea = styled.div`
//   display: flex;
//   flex-flow: row nowrap;
//   justify-content: space-around;
//   height: 100%;
//   margin: 0 auto;
//   padding: 15px;
//   gap: 20px;
//   border: none;
// `

const InviWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  padding: 5px 8px;
  width: 45%;
  height: 100%;
  border: none;
  border-radius: 5px;
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
  padding: 10px 0;
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const FilteredFriendWrapper = styled(FilteredWrapper)`
  cursor: pointer;
  &:hover {
    color: #e6e6e6;
    background-color: ${(props) => props.theme.color.deepMain};
    border: none;
    border-radius: 5px;
  }
`
const ContentTitle = styled.div`
  display: flex;
  align-items: center;

  font-size: ${(props) => props.theme.title.lg};
  font-weight: 700;
  gap: 10px;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`

const BtnWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  min-width: 130px;
  margin: 0 20px;
  justify-content: space-between;
  align-self: center;
  font-size: ${(props) => props.theme.title.md};
  gap: 20px;
`
const BtnAccept = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  color: #ffffff;
  background-color: ${(props) => props.theme.color.deepMain};
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    box-shadow: 3px 3px #8c8c8c;
  }
`
const BtnDeny = styled(BtnAccept)`
  background-color: ${(props) => props.theme.btnColor.bgGray};
`

const FilteredContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 2px;
  line-height: 24px;
  height: 24px;
  font-size: ${(props) => props.theme.title.md};
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
    line-height: 20px;
    height: 20px;
  }
`

const NameText = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  margin: 2px 10px 2px 0px;
  line-height: 30px;
  height: 30px;
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
    line-height: 20px;
    height: 20px;
  }
`
const StatusText = styled(NameText)`
  justify-content: end;
  align-self: center;
  min-width: 130px;
  margin: 0 20px;
  font-size: ${(props) => props.theme.title.md};
`
const Avatar = styled.img`
  margin: 0 10px 0 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    width: 24px;
    height: 24px;
  }
`

const SplitRight = styled.div`
  display: flex;
  flex: 1 1 auto;
  height: 2px;
  border-bottom: 2px solid #454545;
`

const usersRef = collection(db, "users")
const today = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`

export default function MyFriends() {
  const { currentUser, isLogin, setCurrentFriendInfo, navigate } =
    useContext(AuthContext)
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
  const [showFriendReq, setShowFriendReq] = useState(false)

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
        <Autocomplete
          qResultIds={qResultIds}
          setQResultIds={setQResultIds}
          invitingIds={invitingIds}
        />
        <ContentTitle>
          <BtnSort
            isCurrent={showFriendReq}
            onClick={() => {
              setShowFriendReq((prev) => !prev)
            }}
          >
            Friend requests
          </BtnSort>
        </ContentTitle>

        {showFriendReq &&
          invitingList.length !== 0 &&
          invitingList.map((inviting: DocumentData) => {
            return (
              <FriendWrapper key={inviting.id}>
                <ImgWrapper>
                  <UserImg src={inviting.photoURL} />
                </ImgWrapper>
                <UserInfo>
                  <NameText>{inviting.name}</NameText>
                  <HomeTownText>{inviting.hometownName}</HomeTownText>
                </UserInfo>

                <StatusText>Awaiting reply</StatusText>
              </FriendWrapper>
            )
          })}
        {showFriendReq &&
          beInvitedList.length !== 0 &&
          beInvitedList.map((invited: DocumentData) => {
            return (
              <FriendWrapper key={invited.id}>
                <ImgWrapper>
                  <UserImg src={invited.photoURL} />
                </ImgWrapper>
                <UserInfo>
                  <NameText>{invited.name}</NameText>
                  <HomeTownText>{invited.hometownName}</HomeTownText>
                </UserInfo>
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
              </FriendWrapper>
            )
          })}

        {!showFriendReq &&
          friends.length !== 0 &&
          friends.map((friend: DocumentData) => {
            return (
              <FriendWrapper
                key={friend.id}
                id={friend.id}
                onClick={() => {
                  setCurrentFriendInfo({
                    name: friend.name,
                    id: friend.id,
                  })
                  navigate(
                    `/${currentUser?.name}/my-friend/${friend.name}/${friend.id}`
                  )
                }}
              >
                <ImgWrapper>
                  <UserImg src={friend.photoURL} />
                </ImgWrapper>
                <UserInfo>
                  <NameText>{friend.name}</NameText>
                  <HomeTownText>{friend.hometownName}</HomeTownText>
                </UserInfo>
              </FriendWrapper>
            )
          })}
      </ContentArea>
    </Container>
  )
}

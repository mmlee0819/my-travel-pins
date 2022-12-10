import React from "react"
import styled from "styled-components"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/authContext"
import { Autocomplete } from "../../components/autoComplete"
import { db } from "../../utils/firebase"
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
import { DefinedDocumentData } from "../../utils/pins"
import {
  Container,
  Wrapper,
  ImgWrapper,
  UserImg,
  UserInfo,
  HomeTownText,
} from "../../components/styles/friendStyles"
import { notifyError } from "../../components/reminder"

const VisitArea = styled.div`
  position: absolute;
  bottom: 0px;
  right: 0px;
  display: flex;
  align-items: center;
  max-width: 0px;
  height: 120px;
  overflow: hidden;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  background: linear-gradient(
    to right,
    rgb(83, 132, 169, 0.3),
    rgb(83, 132, 169)
  );
  transform-origin: bottom;
  transition: max-width 0.2s ease-in;
  cursor: pointer;
`
const VisitText = styled.div`
  text-align: end;
  margin-right: 15px;
  width: 85px;
  color: rgb(255, 255, 255);
  font-size: 18px;
  line-height: 20px;
`
const FriendWrapper = styled(Wrapper)`
  position: relative;
  cursor: pointer;
  &:hover > ${VisitArea} {
    max-width: 150px;
  }
`

const FixArea = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 20px 50px 0 50px;
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-auto-rows: 120px;
  align-items: center;
  width: 100%;
  height: calc(100% - 90px);
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

const BtnSort = styled.div<{ isCurrent: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 160px;
  line-height: 20px;
  height: 30px;
  font-size: ${(props) => props.theme.title.md};
  color: ${(props) => (props.isCurrent ? "#fff" : props.theme.color.deepMain)};
  background-color: ${(props) =>
    props.isCurrent ? props.theme.color.deepMain : "none"};
  border-radius: 5px;
  border: 1px solid
    ${(props) => (props.isCurrent ? "none" : props.theme.btnColor.bgGray)};
  cursor: pointer;
`

const ContentTitle = styled.div`
  display: flex;
  justify-content: start;
  font-size: ${(props) => props.theme.title.lg};
  gap: 10px;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`

const BtnWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-top: 15px;
  width: 150px;
  /* min-width: 75px; */
  align-self: start;
  font-size: 14px;
  gap: 10px;
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
    box-shadow: rgb(83, 132, 169, 0.8) 0px 0px 3px;
  }
`
const BtnDeny = styled(BtnAccept)`
  background-color: ${(props) => props.theme.btnColor.bgGray};
`

const NameText = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  align-items: baseline;
  margin: 2px 10px 2px 0px;
  line-height: 30px;
  height: 30px;
  font-size: ${(props) => props.theme.title.lg};
  gap: 15px;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
    line-height: 20px;
    height: 20px;
  }
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
  const [showAll, setShowAll] = useState(true)
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
        if (error instanceof Error) {
          const errorMsg = error["message"].slice(9) as string
          notifyError(
            `Failed to get friends' information, please take a note of ${errorMsg} and contact mika@test.com`
          )
        }
      }
    }
    getFriendsList()
  }, [myFriends])

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
        if (error instanceof Error) {
          const errorMsg = error["message"].slice(9) as string
          notifyError(
            `Failed to get invited list, please take a note of ${errorMsg} and contact mika@test.com`
          )
        }
      }
    }
    getInvitedList()
  }, [beInvitedIds])

  const acceptFriendReq = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isLogin || currentUser === null) return
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
        const newBeInviteds = beInvitedIds.filter((item) => {
          return item !== (e.target as Element).id
        })
        setFriendIds((prev) => {
          return [...prev, (e.target as Element).id]
        })
        setBeInvitedIds(newBeInviteds)
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMsg = error["message"].slice(9) as string
        notifyError(
          `An error occurred when accept a friend request, please take a note of ${errorMsg} and contact mika@test.com`
        )
      }
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
      if (error instanceof Error) {
        const errorMsg = error["message"].slice(9) as string
        notifyError(
          `An error occurred when deny a friend request, please take a note of ${errorMsg} and contact mika@test.com`
        )
      }
    }
  }
  return (
    <Container>
      <FixArea>
        <ContentTitle>
          <BtnSort
            isCurrent={showAll}
            onClick={() => {
              setShowFriendReq(false)
              setShowAll(true)
            }}
          >
            Friends
          </BtnSort>
          <BtnSort
            isCurrent={showFriendReq}
            onClick={() => {
              setShowAll(false)
              setShowFriendReq(true)
            }}
          >
            Friend requests
          </BtnSort>
        </ContentTitle>
        <Autocomplete
          qResultIds={qResultIds}
          setQResultIds={setQResultIds}
          invitingIds={invitingIds}
        />
      </FixArea>

      {showFriendReq && (
        <ContentArea>
          {showFriendReq &&
            beInvitedList.length !== 0 &&
            beInvitedList.map((invited: DocumentData) => {
              return (
                <Wrapper key={invited.id}>
                  <ImgWrapper>
                    <UserImg src={invited.photoURL} />
                  </ImgWrapper>
                  <UserInfo>
                    <NameText>
                      {invited.name}
                      <HomeTownText>{invited.hometownName}</HomeTownText>
                    </NameText>

                    <HomeTownText>{invited.email}</HomeTownText>
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
                  </UserInfo>
                </Wrapper>
              )
            })}
        </ContentArea>
      )}
      {showAll && (
        <ContentArea>
          {showAll &&
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
                  <VisitArea>
                    <VisitText>Visit</VisitText>
                  </VisitArea>
                  <ImgWrapper>
                    <UserImg src={friend.photoURL} />
                  </ImgWrapper>
                  <UserInfo>
                    <NameText>{friend.name}</NameText>
                    <HomeTownText>{friend.hometownName}</HomeTownText>
                    <HomeTownText>{friend.email}</HomeTownText>
                  </UserInfo>
                </FriendWrapper>
              )
            })}
        </ContentArea>
      )}
    </Container>
  )
}

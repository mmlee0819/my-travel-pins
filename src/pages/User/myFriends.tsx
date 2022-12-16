import React from "react"
import styled from "styled-components"
import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/authContext"
import { Autocomplete } from "../../components/friends/autoComplete"
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
import { Spinner } from "./myMap"
import {
  Container,
  Wrapper,
  ImgWrapper,
  UserImg,
  UserInfo,
  HomeTownText,
} from "../../components/styles/friendStyles"
import { notifyError } from "../../components/reminder"
import SwitchBtn from "../../components/friends/switchBtn"

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
  @media screen and (max-width: 630px) {
    height: 100px;
  }
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
  align-items: center;
  cursor: pointer;
  &:hover > ${VisitArea} {
    max-width: 150px;
  }
  @media screen and (max-width: 630px) {
    height: 100px;
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
  @media screen and (max-width: 630px) {
    padding: 20px;
    padding-bottom: 0px;
    margin-bottom: 20px;
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
  @media screen and (max-width: 630px) {
    grid-auto-rows: 100px;
    padding: 0 20px;
    height: calc(100% - 110px);
  }
  @media screen and (max-width: 450px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`

const BtnWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin-top: 15px;
  width: 150px;
  align-self: start;
  font-size: 14px;
  gap: 10px;
  @media screen and (max-width: 450px) {
    font-size: 12px;
  }
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
  @media screen and (max-width: 450px) {
    font-size: 16px;
    font-weight: 500;
  }
`

const usersRef = collection(db, "users")
const today = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`

export default function MyFriends() {
  const {
    currentUser,
    isLogin,
    setCurrentFriendInfo,
    navigate,
    setCurrentPage,
    isLoading,
    setIsLoading,
  } = useContext(AuthContext)

  const [qResultIds, setQResultIds] = useState<string[]>([])
  const [relationships, setRelationships] = useState<
    DocumentData | DefinedDocumentData
  >([])
  const [invitingIds, setInvitingIds] = useState<string[]>([])
  const [beInvitedIds, setBeInvitedIds] = useState<string[]>([])
  const [beInvitedList, setBeInvitedList] = useState<
    DocumentData | DefinedDocumentData
  >([])
  const [friends, setFriends] = useState<
    DocumentData[] | DefinedDocumentData[]
  >([])
  const [myFriends, setMyFriends] = useState<string[]>([])
  const [currentSort, setCurrentSort] = useState("friends")

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
    setCurrentPage("myFriends")
    const getFriendsList = async () => {
      try {
        setIsLoading(true)
        if (!myFriends || myFriends.length === 0) return
        const newFriends: DocumentData[] = []
        const q = query(usersRef, where("id", "in", myFriends))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          newFriends.push(doc.data())
        })
        setFriends(newFriends)
      } catch (error) {
        if (error instanceof Error) {
          const errorMsg = error["message"].slice(9) as string
          notifyError(
            `Failed to get friends' information, please take a note of ${errorMsg} and contact mika@test.com`
          )
        }
      } finally {
        setIsLoading(false)
      }
    }
    getFriendsList()
  }, [myFriends])

  useEffect(() => {
    const getInvitedList = async () => {
      if (!beInvitedIds || beInvitedIds.length === 0) {
        setBeInvitedList([])
        return
      }
      try {
        setIsLoading(true)
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
      } finally {
        setIsLoading(false)
      }
    }
    getInvitedList()
  }, [beInvitedIds])

  const acceptFriendReq = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!isLogin || currentUser === null) return
    const target = e.target as Element
    try {
      if (typeof currentUser?.id === "string") {
        const currentUserRef = doc(db, "users", currentUser?.id)
        const inviterRef = doc(db, "users", target.id)
        const currentRelationRef = doc(
          db,
          "relationships",
          `${target.id}${currentUser?.id}`
        )
        await updateDoc(currentUserRef, {
          friends: arrayUnion(target.id),
        })
        await updateDoc(inviterRef, {
          friends: arrayUnion(currentUser?.id),
        })
        await updateDoc(currentRelationRef, {
          status: "accept",
          beFriend: today,
        })
        const newBeInviteds = beInvitedIds.filter((item) => {
          return item !== target.id
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
    const target = e.target as Element
    try {
      if (typeof currentUser?.id === "string") {
        const currentRelationRef = doc(
          db,
          "relationships",
          `${target.id}${currentUser?.id}`
        )
        await updateDoc(currentRelationRef, {
          status: "reject",
          rejectedDay: today,
        })
        const newBeInviteds = beInvitedIds.filter((item) => {
          return item !== target.id
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
        <SwitchBtn currentSort={currentSort} setCurrentSort={setCurrentSort} />
        <Autocomplete
          qResultIds={qResultIds}
          setQResultIds={setQResultIds}
          invitingIds={invitingIds}
        />
      </FixArea>
      {isLoading ? (
        <Spinner />
      ) : (
        <ContentArea>
          {currentSort === "friendRequests" &&
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
          {currentSort === "friends" &&
            friends?.length !== 0 &&
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
          {currentSort === "friends" && (!friends || friends.length === 0) && (
            <FriendWrapper>
              No friends. <br />
              Search a user and send a friend request!
            </FriendWrapper>
          )}
          {currentSort === "friendRequests" &&
            (!beInvitedList || beInvitedList.length === 0) && (
              <FriendWrapper>No friend request.</FriendWrapper>
            )}
        </ContentArea>
      )}
    </Container>
  )
}

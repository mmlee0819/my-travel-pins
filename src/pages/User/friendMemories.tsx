import React from "react"
import { useState, useContext, useEffect, useRef } from "react"
import { AuthContext } from "../Context/authContext"
import { getPins, getSpecificPin } from "./functions/pins"
import {
  ContentWrapper,
  Container,
  ContentArea,
  ArticleWrapper,
  ImgWrapper,
  MemoryImg,
  MemoryList,
  Text,
  Title,
  PhotoText,
  IconInList,
  BtnSortWrapper,
  BtnSort,
  SortIcon,
} from "../Components/styles/memoriesStyles"
import { DocumentData } from "@firebase/firestore-types"
import {
  MessagesType,
  addMsg,
  checkRealTimePinMessages,
  PinContent,
  checkRealTimePinsInfo,
} from "./functions/pins"
import DetailMemory from "../Components/detailMemory"
import calendar from "../assets/calendar.png"
import location from "../assets/location.png"
import whiteArrow from "../assets/buttons/down-arrow-white.png"
import deepArrow from "../assets/buttons/down-arrow-deeMain.png"

function FriendMemories() {
  const { isLoaded, isLogin, currentUser } = useContext(AuthContext)
  const [memories, setMemories] = useState<PinContent[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [memory, setMemory] = useState<PinContent>()
  const [memoryIsShow, setMemoryIsShow] = useState(false)
  const [isSortByPost, setIsSortByPost] = useState(true)
  const [isSortByDate, setIsSortByDate] = useState(false)
  const [messages, setMessages] = useState<DocumentData[] | MessagesType[]>([])

  const msgRef = useRef<HTMLInputElement>(null)

  const url = window.location.href
  const splitUrlArr = url.split("/")
  const friendId = splitUrlArr.slice(-2, -1)[0]
  let friendName = splitUrlArr.slice(-3, -2)[0]
  if (friendName[0] === "%") {
    friendName = decodeURI(friendName)
  }
  useEffect(() => {
    if (
      currentUser !== undefined &&
      currentUser !== null &&
      typeof currentUser?.id === "string"
    ) {
      getPins(currentUser, friendId, hasFetched, setHasFetched, setMemories)
    }
  }, [friendId, memories])

  useEffect(() => {
    if (friendId) {
      checkRealTimePinsInfo(friendId, setMemories)
      return checkRealTimePinsInfo(friendId, setMemories)
    }
  }, [friendId])

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        memory &&
        typeof memory?.id === "string" &&
        typeof currentUser?.id === "string" &&
        msgRef.current !== undefined &&
        msgRef.current !== null
      ) {
        console.log("Enter key was pressed. Run your function.")
        addMsg(currentUser?.id, memory?.id, msgRef?.current?.value)
        msgRef.current.value = ""
      } else return
    }

    document.addEventListener("keydown", keyDownListener)
    return () => {
      document.removeEventListener("keydown", keyDownListener)
    }
  })

  useEffect(() => {
    if (!memory?.id) return
    checkRealTimePinMessages(memory?.id, setMessages)
    return checkRealTimePinMessages(memory?.id, setMessages)
  }, [memory?.id])

  return (
    <Container>
      <BtnSortWrapper>
        <BtnSort
          isCurrent={isSortByPost}
          onClick={() => {
            if (!isSortByPost) {
              setIsSortByDate(false)
              setIsSortByPost(true)
            }
          }}
        >
          Post time
          <SortIcon src={isSortByPost ? whiteArrow : deepArrow} />
        </BtnSort>
        <BtnSort
          isCurrent={isSortByDate}
          onClick={() => {
            if (!isSortByDate) {
              setIsSortByPost(false)
              setIsSortByDate(true)
            }
          }}
        >
          Travel date
          <SortIcon src={isSortByDate ? whiteArrow : deepArrow} />
        </BtnSort>
      </BtnSortWrapper>
      <ContentArea>
        {isLogin && isLoaded && memories ? (
          memories.map((item: PinContent, index: number) => {
            return (
              <MemoryList key={`${item.id}-${item?.article?.title}`}>
                <ImgWrapper
                  id={item?.id}
                  onClick={() => {
                    if (typeof item.id !== "string") return
                    setMemoryIsShow(true)
                    setMemory(item)
                    getSpecificPin(item?.id, setMemory, setMemoryIsShow)
                  }}
                >
                  {item?.albumURLs ? (
                    <MemoryImg src={item?.albumURLs[0]} />
                  ) : (
                    <PhotoText>No photo uploaded</PhotoText>
                  )}
                </ImgWrapper>
                <ArticleWrapper>
                  <Title
                    id={item?.id}
                    onClick={() => {
                      if (typeof item.id !== "string") return
                      setMemoryIsShow(true)
                      setMemory(item)
                      getSpecificPin(item?.id, setMemory, setMemoryIsShow)
                    }}
                  >
                    {item?.article?.title === undefined
                      ? "Untitled"
                      : item?.article?.title}
                  </Title>
                  <Text>
                    <IconInList src={calendar} />
                    {item?.article?.travelDate}
                  </Text>
                  <Text>
                    <IconInList src={location} />
                    {item?.location?.name}
                  </Text>
                </ArticleWrapper>
              </MemoryList>
            )
          })
        ) : (
          <Title>Please wait...</Title>
        )}
      </ContentArea>

      {memoryIsShow && memory && memory.location && (
        <DetailMemory selectedMarker={memory} setShowMemory={setMemoryIsShow} />
      )}
    </Container>
  )
}
export default FriendMemories

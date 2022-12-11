import React from "react"
import { useState, useContext, useEffect, useRef } from "react"
import { AuthContext } from "../../context/authContext"
import { MapContext } from "../../context/mapContext"
import { getPins, getSpecificPin } from "../../utils/pins"
import {
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
} from "../../components/styles/memoriesStyles"
import { DocumentData } from "@firebase/firestore-types"
import {
  MessagesType,
  addMsg,
  checkRealTimePinMessages,
  PinContent,
  checkRealTimePinsInfo,
} from "../../utils/pins"
import DetailMemory from "../../components/pinContent/detailMemory"
import calendar from "../../assets/calendar.png"
import location from "../../assets/location.png"
import whiteArrow from "../../assets/buttons/down-arrow-white.png"
import deepArrow from "../../assets/buttons/down-arrow-deeMain.png"
import { useParams } from "react-router-dom"

function FriendMemories() {
  const { isLogin, currentUser, setCurrentPage } = useContext(AuthContext)
  const { isLoaded } = useContext(MapContext)
  const [memories, setMemories] = useState<PinContent[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [memory, setMemory] = useState<PinContent>()
  const [memoryIsShow, setMemoryIsShow] = useState(false)
  const [isSortByPost, setIsSortByPost] = useState(true)
  const [messages, setMessages] = useState<DocumentData[] | MessagesType[]>([])

  const msgRef = useRef<HTMLInputElement>(null)

  const { friendId } = useParams()

  useEffect(() => {
    if (
      currentUser !== undefined &&
      currentUser !== null &&
      typeof currentUser?.id === "string" &&
      friendId
    ) {
      getPins(currentUser, friendId, hasFetched, setHasFetched, setMemories)
    }
  }, [friendId, memories])

  useEffect(() => {
    if (friendId) {
      setCurrentPage("friendMemories")
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
        <BtnSort isCurrent={isSortByPost}>
          Post time
          <SortIcon src={isSortByPost ? whiteArrow : deepArrow} />
        </BtnSort>
      </BtnSortWrapper>
      <ContentArea>
        {isLogin && isLoaded && memories ? (
          memories.map((item: PinContent) => {
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

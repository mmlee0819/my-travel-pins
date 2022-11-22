import React from "react"
import styled from "styled-components"
import { useState, useContext, useEffect, useRef } from "react"
import { AuthContext } from "../Context/authContext"
import { getPins, getSpecificPin } from "./ts_fn_commonUse"
import {
  Container,
  ContentArea,
  ArticleWrapper,
  MemoryList,
  ContentWrapper,
  ImgWrapper,
  MemoryImg,
} from "./components/UIforMemoriesPage"
import { DocumentData } from "@firebase/firestore-types"
import {
  MessagesType,
  addMsg,
  checkRealTimePinMessages,
  queryMessengerInfo,
  PinContent,
} from "../User/ts_fn_commonUse"
import DetailMemory from "../Components/detailMemory"
import defaultImage from "../assets/defaultImage.png"

const Text = styled.div`
  color: ${(props) => props.theme.color.bgDark};
  min-width: 30%;
`
const Title = styled(Text)`
  font-weight: 700;
  font-size: 24px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 18px;
  }
`

const BtnWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  margin-right: 10px;
  justify-content: space-between;
  align-self: center;
`
const BtnBlue = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 48%;
  padding: 5px;
  font-family: "Poppins";
  font-size: 20px;
  color: #ffffff;
  background-color: #3490ca;
  border-radius: 3px;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
  }
`

export const BtnReadMore = styled.div`
  display: flex;
  align-self: end;
  text-align: center;
  padding: 5px;
  border: 1px solid #000000;
  border-radius: 5px;
  cursor: pointer;
`

function FriendMemories() {
  const { isLoaded, isLogin, currentUser } = useContext(AuthContext)
  const [memories, setMemories] = useState<PinContent[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [memory, setMemory] = useState<PinContent>()
  const [memoryIsShow, setMemoryIsShow] = useState(false)
  const [messages, setMessages] = useState<DocumentData[] | MessagesType[]>([])
  const [messengerInfo, setMessengerInfo] = useState<DocumentData[]>([])
  console.log("messengerInfo", messengerInfo)
  console.log({ memoryIsShow })
  console.log({ memory })

  const msgRef = useRef<HTMLInputElement>(null)

  const url = window.location.href
  const splitUrlArr = url.split("/")
  const friendId = splitUrlArr.slice(-2, -1)[0]
  let friendName = splitUrlArr.slice(-3, -2)[0]
  if (friendName[0] === "%") {
    friendName = decodeURI(friendName)
  }
  useEffect(() => {
    getPins(currentUser, friendId, hasFetched, setHasFetched, setMemories)
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
    if (messages === undefined || messages.length === 0) return
    setMessengerInfo([])
    console.log({ messages })
    messages.map((item: DocumentData | MessagesType) => {
      queryMessengerInfo(item.messenger, setMessengerInfo)
    })
  }, [messages])

  useEffect(() => {
    if (!memory?.id) return

    checkRealTimePinMessages(memory?.id, setMessages)
    return checkRealTimePinMessages(memory?.id, setMessages)
  }, [memory?.id])

  return (
    <Container>
      <ContentArea>
        <ContentWrapper>
          {isLogin && isLoaded && memories ? (
            memories.map((item: PinContent, index: number) => {
              return (
                <MemoryList key={`${item.id}-${item?.article?.title}`}>
                  <ImgWrapper>
                    {item?.albumURLs ? (
                      <MemoryImg src={item?.albumURLs[0]} />
                    ) : (
                      <MemoryImg src={defaultImage} />
                    )}
                  </ImgWrapper>
                  <ArticleWrapper>
                    <Title>{item?.article?.title}</Title>
                    <Text>{item?.article?.travelDate}</Text>
                    <Text>{item?.location?.name}</Text>
                    <BtnWrapper>
                      <BtnBlue
                        id={item?.id}
                        onClick={() => {
                          if (typeof item.id !== "string") return
                          setMemoryIsShow(true)
                          setMemory(item)
                          getSpecificPin(item?.id, setMemory, setMemoryIsShow)
                        }}
                      >
                        {item?.article?.content !== ""
                          ? "Read more"
                          : "Add memory"}
                      </BtnBlue>
                    </BtnWrapper>
                  </ArticleWrapper>
                </MemoryList>
              )
            })
          ) : (
            <Title>Please wait...</Title>
          )}
        </ContentWrapper>
      </ContentArea>
      {memoryIsShow && memory && memory.location && (
        <DetailMemory selectedMarker={memory} setShowMemory={setMemoryIsShow} />
      )}
    </Container>
  )
}
export default FriendMemories

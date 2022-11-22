import React from "react"
import styled from "styled-components"
import { useState, useContext, useEffect, useRef } from "react"
import { StreetViewService } from "@react-google-maps/api"
import { GoogleMap, Marker } from "@react-google-maps/api"
import { AuthContext } from "../Context/authContext"
import { getPins, getSpecificPin } from "./ts_fn_commonUse"
import {
  Container,
  ContentArea,
  ArticleWrapper,
  MemoryList,
  ContentWrapper,
  DetailContentWrapper,
  DetailArticleWrapper,
  DetailImg,
  DetailImgsWrapper,
  DetailMapWrapper,
  ImgWrapper,
  MemoryImg,
} from "./components/UIforMemoriesPage"
import { DocumentData } from "@firebase/firestore-types"
import {
  MessagesType,
  addMsg,
  checkRealTimePinMessages,
  queryMessengerInfo,
  deleteMsg,
  PinContent,
} from "../User/ts_fn_commonUse"

import defaultImage from "../assets/defaultImage.png"
import moreIcon from "../assets/buttons/moreIcon.png"
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
const ArticleTitle = styled(Text)`
  min-height: 40px;
  font-weight: 700;
  @media screen and (max-width: 799px), (max-height: 600px) {
    min-height: 30px;
  }
`
const TextNoMargin = styled(Text)`
  margin: 0;
  text-align: justify;
`

const StreetModeContainer = styled.div`
  height: 40vh;
  margin-bottom: 20px;
`
const PhotoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  min-width: 300px;
  margin-bottom: 20px;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`
const Photo = styled.div`
  width: 100%;
  height: 200px;
  margin-bottom: 15px;
  background-size: 100% 100%;
`
const PhotoImg = styled(Photo)<{ bkImage: string }>`
  background-image: ${(props) => `url(${props.bkImage})`};
`

const MsgNumText = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  padding-right: 20px;
  font-size: 25px;
  border-bottom: 2px solid #d4d4d4;
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: 18px;
  }
`
const MsgContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-size: 16px;
  padding-left: 8px;
  background-color: #f6f6f6;
  border: none;
  border-radius: 10px;
`
const UserAvatar = styled.div<{ avatarURL: string }>`
  display: flex;
  align-self: center;
  margin-right: 5px;
  width: 30px;
  height: 30px;
  background-image: ${(props) => `url(${props.avatarURL})`};
  background-size: 100% 100%;
  /* border-radius: 50%; */
`
const MsgColumnWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  min-height: 100px;
`
const MsgRowNoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin: 5px 0;
`
const BtnMore = styled.div`
  position: absolute;
  right: 40px;
  display: inline-block;
  width: 30px;
  height: 25px;
  font-size: 16px;
  background-image: url(${moreIcon});
  background-size: cover;
`
const BtnMsgDelete = styled.div`
  position: absolute;
  top: 30px;
  right: 40px;
  display: inline-block;
  text-align: center;
  padding: 5px 10px;
  line-height: 16px;
  height: 30px;
  font-size: 16px;
  color: #fff;
  background-color: #5594b7;
  border-radius: 5px;
  z-index: 120;
`

const MsgInput = styled.input`
  display: flex;
  flex: 1 1 auto;
  align-self: center;
  margin: 10px 20px 10px 0;
  padding-left: 10px;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: #8d8d8d;
  background-color: #cbcbcb;
  border: none;
  border-radius: 5px;
  &:focus {
    outline: #f99c62;
    border: 3px solid #f99c62;
    background-color: #e3e3e3;
  }
  ::placeholder {
    font-size: 16px;
  }
`

function FriendMemories() {
  const { isLoaded, isLogin, currentUser } = useContext(AuthContext)
  const [memories, setMemories] = useState<DocumentData[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [memory, setMemory] = useState<DocumentData>()
  const [memoryIsShow, setMemoryIsShow] = useState(false)
  const [messages, setMessages] = useState<DocumentData[] | MessagesType[]>([])
  const [messengerInfo, setMessengerInfo] = useState<DocumentData[]>([])
  console.log("messengerInfo", messengerInfo)
  const msgRef = useRef<HTMLInputElement>(null)
  const [showDelete, setShowDelete] = useState(false)
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
    messages.map((item: DocumentData | MessagesType) => {
      queryMessengerInfo(item.messenger, setMessengerInfo)
    })
  }, [messages])

  useEffect(() => {
    if (!memory?.id || messages === undefined) return
    checkRealTimePinMessages(memory?.id, setMessages)
    return checkRealTimePinMessages(memory?.id, setMessages)
  }, [memory?.id])
  console.log(memory?.location?.lat)
  console.log(memory?.location?.lng)
  const onStreetLoad = () => {
    if (
      memory !== undefined &&
      typeof memory?.location?.lat !== undefined &&
      typeof memory?.location?.lng !== undefined
    ) {
      new google.maps.StreetViewPanorama(
        document.getElementById("street-mode-container") as HTMLElement,
        {
          position: new google.maps.LatLng(
            memory?.location?.lat,
            memory?.location?.lng
          ),
          fullscreenControl: false,
          addressControl: false,
        }
      )
    }
  }
  return (
    <Container>
      <ContentArea>
        <ContentWrapper>
          {isLoaded && memories ? (
            memories.map((item: DocumentData, index: number) => {
              console.log(item)
              return (
                <>
                  <MemoryList key={item.id}>
                    <ImgWrapper>
                      {item?.albumURLs ? (
                        <MemoryImg src={item?.albumURLs[0]} />
                      ) : (
                        <>
                          <MemoryImg src={defaultImage} />

                          <Text>No photo uploaded</Text>
                        </>
                      )}
                    </ImgWrapper>
                    <ArticleWrapper>
                      <Title>{item?.article?.title}</Title>
                      <Text>{item?.article?.travelDate}</Text>
                      <Text>{item?.location?.name}</Text>
                      {/* <Title>{item?.article?.content}</Title> */}
                      <BtnWrapper>
                        <BtnBlue
                          id={item?.id}
                          onClick={() => {
                            if (memoryIsShow && memory?.id !== item?.id) {
                              setMemoryIsShow(false)
                              getSpecificPin(
                                item?.id,
                                setMemory,
                                setMemoryIsShow
                              )
                            } else if (
                              memoryIsShow &&
                              memory?.id === item?.id
                            ) {
                              setMemoryIsShow(false)
                            } else {
                              getSpecificPin(
                                item?.id,
                                setMemory,
                                setMemoryIsShow
                              )
                            }
                          }}
                        >
                          {item?.article?.content !== ""
                            ? "Read more"
                            : "Add memory"}
                        </BtnBlue>
                      </BtnWrapper>
                    </ArticleWrapper>
                  </MemoryList>

                  {memory && memoryIsShow && memory?.id === item.id && (
                    <DetailContentWrapper
                      key={`${memory?.id}-${memory?.location.placeId}`}
                    >
                      <ContentArea>
                        <PhotoWrapper>
                          {memory?.albumURLs?.map((photoUrl: string) => {
                            return (
                              <PhotoImg key={photoUrl} bkImage={photoUrl} />
                            )
                          })}
                        </PhotoWrapper>
                        <Text>{memory?.article?.content}</Text>
                        <MsgNumText>{messages?.length || 0} 則留言</MsgNumText>
                        <MsgColumnWrapper>
                          <MsgRowNoWrapper>
                            {currentUser !== null &&
                              currentUser !== undefined &&
                              typeof currentUser?.photoURL === "string" && (
                                <UserAvatar avatarURL={currentUser?.photoURL} />
                              )}
                            <MsgInput
                              ref={msgRef}
                              placeholder="Leave message..."
                            />
                          </MsgRowNoWrapper>
                          {messages !== undefined &&
                            messages.length !== 0 &&
                            messengerInfo !== undefined &&
                            messengerInfo.length === messages.length &&
                            messages.map(
                              (
                                item: DocumentData | MessagesType,
                                index: number
                              ) => {
                                return (
                                  <MsgRowNoWrapper
                                    key={`${item.messenger}-${item.msgTimestamp}`}
                                  >
                                    <UserAvatar
                                      avatarURL={messengerInfo[index].photoURL}
                                    />
                                    <MsgContent>
                                      {messengerInfo[index].name}
                                      <br />
                                      {item.msgContent}
                                    </MsgContent>
                                    {currentUser !== null &&
                                      item.messenger === currentUser?.id && (
                                        <>
                                          <BtnMore
                                            onClick={() => {
                                              setShowDelete((prev) => !prev)
                                            }}
                                          />
                                          {showDelete && (
                                            <BtnMsgDelete
                                              onClick={() => {
                                                if (
                                                  memory !== undefined &&
                                                  typeof memory?.id === "string"
                                                ) {
                                                  deleteMsg(memory?.id, item)
                                                }
                                              }}
                                            >
                                              Delete
                                            </BtnMsgDelete>
                                          )}
                                        </>
                                      )}
                                  </MsgRowNoWrapper>
                                )
                              }
                            )}
                        </MsgColumnWrapper>

                        {isLoaded && (
                          <StreetModeContainer id="street-mode-container">
                            <StreetViewService onLoad={onStreetLoad} />
                          </StreetModeContainer>
                        )}
                      </ContentArea>
                      {memoryIsShow && (
                        <DetailMapWrapper>
                          <Title>{memory?.location?.name}</Title>
                          <GoogleMap
                            mapContainerStyle={{
                              height: "300px",
                              width: "100%",
                            }}
                            center={{
                              lat: memory?.location.lat,
                              lng: memory?.location.lng,
                            }}
                            zoom={14}
                            options={{
                              draggable: true,
                              mapTypeControl: false,
                              streetViewControl: false,
                              scaleControl: false,
                              fullscreenControl: false,
                            }}
                          >
                            <Marker
                              position={{
                                lat: memory?.location.lat,
                                lng: memory?.location.lng,
                              }}
                            />
                          </GoogleMap>
                        </DetailMapWrapper>
                      )}
                    </DetailContentWrapper>
                  )}
                </>
              )
            })
          ) : (
            <Title>Please wait...</Title>
          )}
        </ContentWrapper>
      </ContentArea>
    </Container>
  )
}
export default FriendMemories

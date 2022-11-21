import React, { useState, useEffect, useContext, useRef, Dispatch } from "react"
import { StreetViewService } from "@react-google-maps/api"
import styled from "styled-components"
import { DocumentData } from "@firebase/firestore-types"

import moreIcon from "../assets/moreIcon.png"
import xMark from "../assets/x-mark.png"
import {
  MessagesType,
  addMsg,
  checkRealTimePinMessages,
  queryMessengerInfo,
  deleteMsg,
  PinContent,
} from "../User/ts_fn_commonUse"
import { AuthContext } from "../Context/authContext"

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100%;
  width: 100%;
  font-family: "Poppins", "sans-serif";
  background-color: rgb(45, 45, 45, 0.8);
  z-index: 120;
`
const ContentArea = styled.div`
  position: relative;
  padding: 20px;
  width: 60%;
  height: 100vh;
  margin: 0 auto;
  font-size: 4rem;
  color: #2d2d2d;
  background-color: rgb(255, 255, 255, 0.9);
  box-shadow: 0px 0px 3px 10px #232323c2;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`

const Text = styled.div`
  margin: 25px 0;
  font-family: "Poppins", "sans-serif";
  font-size: 25px;
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: 18px;
  }
`
const ArticleTitle = styled(Text)`
  min-height: 40px;
  font-weight: 700;
  @media screen and (max-width: 799px), (max-height: 600px) {
    min-height: 30px;
  }
`
const Reminder = styled(Text)`
  color: #034961;
`
const TextNoMargin = styled(Text)`
  margin: 0;
  text-align: justify;
`

const XmarkTop = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  background-image: url(${xMark});
  background-size: 100% 100%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  @media screen and (max-width: 799px), (max-height: 600px) {
    top: 45px;
    width: 30px;
    height: 30px;
  }
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

interface Props {
  selectedMarker: PinContent | undefined
  setShowMemory: Dispatch<React.SetStateAction<boolean>>
}

export default function DetailMemoryOnMap(props: Props) {
  const { selectedMarker, setShowMemory } = props
  const { isLoaded, currentUser } = useContext(AuthContext)
  const [messages, setMessages] = useState<DocumentData[] | MessagesType[]>([])
  const [messengerInfo, setMessengerInfo] = useState<DocumentData[]>([])
  console.log("messengerInfo", messengerInfo)
  const msgRef = useRef<HTMLInputElement>(null)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        selectedMarker &&
        typeof selectedMarker?.id === "string" &&
        typeof currentUser?.id === "string" &&
        msgRef.current !== undefined &&
        msgRef.current !== null
      ) {
        console.log("Enter key was pressed. Run your function.")
        addMsg(currentUser?.id, selectedMarker?.id, msgRef?.current?.value)
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
    if (!selectedMarker?.id || messages === undefined) return
    checkRealTimePinMessages(selectedMarker?.id, setMessages)
    return checkRealTimePinMessages(selectedMarker?.id, setMessages)
  }, [selectedMarker?.id])
  console.log(selectedMarker?.location?.lat)
  console.log(selectedMarker?.location?.lng)
  const onStreetLoad = () => {
    if (
      selectedMarker !== undefined &&
      typeof selectedMarker?.location?.lat !== undefined &&
      typeof selectedMarker?.location?.lng !== undefined
    ) {
      new google.maps.StreetViewPanorama(
        document.getElementById("street-mode-container") as HTMLElement,
        {
          position: new google.maps.LatLng(
            selectedMarker?.location?.lat,
            selectedMarker?.location?.lng
          ),
          fullscreenControl: false,
          addressControl: false,
        }
      )
    }
  }

  return (
    <Container>
      {isLoaded &&
        selectedMarker &&
        typeof selectedMarker?.location?.lat === "number" &&
        typeof selectedMarker?.location?.lng === "number" && (
          <ContentArea>
            <XmarkTop
              onClick={() => {
                setShowMemory(false)
              }}
            />
            <ArticleTitle>{selectedMarker?.article?.title}</ArticleTitle>
            <TextNoMargin>{selectedMarker?.article?.travelDate}</TextNoMargin>
            <PhotoWrapper>
              {selectedMarker?.albumURLs?.map((photoUrl: string) => {
                return <PhotoImg key={photoUrl} bkImage={photoUrl} />
              })}
            </PhotoWrapper>
            <Text>{selectedMarker?.article?.content}</Text>
            <MsgNumText>{messages?.length || 0} 則留言</MsgNumText>
            <MsgColumnWrapper>
              <MsgRowNoWrapper>
                {currentUser !== null &&
                  currentUser !== undefined &&
                  typeof currentUser?.photoURL === "string" && (
                    <UserAvatar avatarURL={currentUser?.photoURL} />
                  )}
                <MsgInput ref={msgRef} placeholder="Leave message..." />
              </MsgRowNoWrapper>
              {messages !== undefined &&
                messages.length !== 0 &&
                messengerInfo !== undefined &&
                messengerInfo.length === messages.length &&
                messages.map(
                  (item: DocumentData | MessagesType, index: number) => {
                    return (
                      <MsgRowNoWrapper
                        key={`${item.messenger}-${item.msgTimestamp}`}
                      >
                        <UserAvatar avatarURL={messengerInfo[index].photoURL} />
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
                                      selectedMarker !== undefined &&
                                      typeof selectedMarker?.id === "string"
                                    ) {
                                      deleteMsg(selectedMarker?.id, item)
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
            <TextNoMargin>{selectedMarker?.location?.name}</TextNoMargin>
            {isLoaded && (
              <StreetModeContainer id="street-mode-container">
                <StreetViewService onLoad={onStreetLoad} />
              </StreetModeContainer>
            )}
          </ContentArea>
        )}
    </Container>
  )
}

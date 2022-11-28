import React, { useState, useEffect, useContext, useRef, Dispatch } from "react"
import { StreetViewService } from "@react-google-maps/api"
import styled from "styled-components"
import { DocumentData } from "@firebase/firestore-types"
import backIcon from "../assets/buttons/back.png"
import {
  MessagesType,
  addMsg,
  checkRealTimePinMessages,
  queryMessengerInfo,
  deleteMsg,
} from "../User/ts_fn_commonUse"
import { AuthContext } from "../Context/authContext"

const RowNoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  min-height: 1rem;
  margin: 15px 0;
`
const ColumnWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
`
const StreetModeContainer = styled(RowNoWrapper)`
  position: absolute;
  margin: 0 auto;
  width: 50vw;
  min-height: calc(100vh - 30px);
  z-index: 101;
`
const StreetModePinContentContainer = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-flow: column wrap;
  padding: 10px;
  width: 50vw;
  background-color: #ffffff;
  z-index: 101;
`
const ContainerArea = styled.div`
  position: relative;
  height: calc(100vh - 60px);
  overflow-y: scroll;
`
const Title = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-size: 20px;
  color: #000000;
  margin: 5px 0;
`
const ArticleContent = styled(Title)`
  white-space: pre-wrap;
`
const BackIconImg = styled.img`
  margin-right: 20px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`
const MsgNumText = styled(Title)`
  display: flex;
  justify-content: end;
  width: 100%;
  padding-right: 20px;
  border-bottom: 2px solid #d4d4d4;
`
const MsgInput = styled.input`
  display: flex;
  flex: 1 1 auto;
  font-size: 16px;
  margin: 10px 20px 10px 0;
  padding-left: 8px;
  background-color: #f6f6f6;
  border: none;
  border-radius: 10px;
  &:focus {
    outline: none;
    box-shadow: 0px 0px 5px #8d8d8d;
  }
  ::placeholder {
    padding-left: 8px;
    font-size: 12px;
  }
`
const MsgContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-size: 16px;
  margin: 0 20px 0 0;
  width: 100%;
  padding-left: 8px;
  background-color: #f6f6f6;
  border: none;
  border-radius: 10px;
`
const UserAvatar = styled.div<{ avatarUrl: string }>`
  display: flex;
  align-self: center;
  margin-right: 5px;
  width: 30px;
  height: 30px;
  background-image: ${(props) => `url(${props.avatarUrl})`};
  background-size: 100% 100%;
`
const MsgColumnWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  height: 300px;
  width: 100%;
`
const MsgRowNoWrapper = styled(RowNoWrapper)`
  justify-content: flex-start;
  margin: 5px 0;
`
const BtnMsgDelete = styled.div`
  position: absolute;
  right: 40px;
  display: inline-block;
  font-size: 16px;
  color: #3c3c3c;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

export const DetailImgsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  width: 100%;
  min-height: 50vh;
  gap: 20px;
`
export const DetailImg = styled.div<{
  bkImage: string
}>`
  display: flex;
  flex: 0 1 40%;
  background-image: ${(props) => `url(${props.bkImage})`};
  background-size: 100% 100%;
`

interface Props {
  selectedMarker: DocumentData
  setShowMemory: Dispatch<React.SetStateAction<boolean>>
}

interface PropsFromStreetView {
  selectedMarker: DocumentData
  setShowMemory: Dispatch<React.SetStateAction<boolean>>
  messages: DocumentData
  setMessages: Dispatch<React.SetStateAction<DocumentData[]>>
}

export const containerStyle = {
  marginTop: "10px",
  width: "100%",
  height: "100%",
  minHeight: "calc(100vh - 120px)",
  borderRadius: "10px",
  zIndex: 30,
}

export const centerSchool = {
  lat: 25.061945,
  lng: 121.5484174,
}

export const myGoogleApiKey = process.env.REACT_APP_google_API_KEY

function PinContentInStreetView(props: Props) {
  const { selectedMarker, setShowMemory } = props
  return (
    <ColumnWrapper>
      <RowNoWrapper>
        <Title>{selectedMarker?.location?.name}</Title>
        <BackIconImg
          src={backIcon}
          onClick={() => {
            setShowMemory(false)
          }}
        />
      </RowNoWrapper>
      <Title>{selectedMarker?.article?.title}</Title>
      <Title>{selectedMarker?.article?.travelDate}</Title>
      <ArticleContent
        dangerouslySetInnerHTML={{ __html: selectedMarker?.article?.content }}
      />

      {selectedMarker?.albumURLs && selectedMarker?.albumURLs?.length !== 0 && (
        <DetailImgsWrapper>
          {selectedMarker.albumURLs.map((photoUrl: string) => {
            return <DetailImg key={photoUrl} bkImage={photoUrl} />
          })}
        </DetailImgsWrapper>
      )}
    </ColumnWrapper>
  )
}
const PinMsgs = (props: PropsFromStreetView) => {
  const { selectedMarker, messages, setMessages } = props
  const { currentUser } = useContext(AuthContext)
  const [messengerInfo, setMessengerInfo] = useState<DocumentData[]>([])
  console.log("messengerInfo", messengerInfo)
  const msgRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const keyDownListener = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        selectedMarker &&
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
    if (!selectedMarker?.id || messages === undefined) return
    checkRealTimePinMessages(selectedMarker?.id, setMessages)
    return checkRealTimePinMessages(selectedMarker?.id, setMessages)
  }, [selectedMarker?.id])

  useEffect(() => {
    if (messages === undefined || messages.length === 0) return
    setMessengerInfo([])
    messages.map((item: DocumentData) => {
      queryMessengerInfo(item.messenger, setMessengerInfo)
    })
  }, [messages])

  return (
    <>
      <MsgNumText>{messages?.length || 0}則留言</MsgNumText>
      <RowNoWrapper>
        {currentUser !== null && typeof currentUser?.photoURL === "string" && (
          <UserAvatar avatarUrl={currentUser?.photoURL} />
        )}
        <MsgInput ref={msgRef} placeholder="message..." />
      </RowNoWrapper>
      <MsgColumnWrapper>
        {messages !== undefined &&
          messages.length !== 0 &&
          messengerInfo !== undefined &&
          messengerInfo.length === messages.length &&
          messages.map((item: MessagesType, index: number) => {
            return (
              <MsgRowNoWrapper key={`${item.messenger}-${item.msgTimestamp}`}>
                <UserAvatar avatarUrl={messengerInfo[index].photoURL} />
                <MsgContent>
                  {messengerInfo[index].name}
                  <br />
                  {item.msgContent}
                </MsgContent>
                {currentUser !== null && item.messenger === currentUser?.id && (
                  <BtnMsgDelete
                    onClick={() => {
                      deleteMsg(selectedMarker?.id, item)
                    }}
                  >
                    Delete Message
                  </BtnMsgDelete>
                )}
              </MsgRowNoWrapper>
            )
          })}
      </MsgColumnWrapper>
    </>
  )
}
export default function StreetView(props: Props) {
  const { selectedMarker, setShowMemory } = props
  const [messages, setMessages] = useState<DocumentData[]>([])

  const onStreetLoad = (selectedMarker: DocumentData) => {
    new google.maps.StreetViewPanorama(
      document.getElementById("street-mode-container") as HTMLElement,
      {
        position: new google.maps.LatLng(
          selectedMarker?.location?.lat,
          selectedMarker?.location?.lng
        ),
      }
    )
  }

  return (
    <>
      <StreetModeContainer id="street-mode-container">
        <StreetViewService
          onLoad={() => {
            onStreetLoad(selectedMarker)
          }}
        />
      </StreetModeContainer>
      <StreetModePinContentContainer>
        <ColumnWrapper>
          <ContainerArea>
            <PinContentInStreetView
              selectedMarker={selectedMarker}
              setShowMemory={setShowMemory}
            />
            <PinMsgs
              selectedMarker={selectedMarker}
              setShowMemory={setShowMemory}
              messages={messages}
              setMessages={setMessages}
            />
          </ContainerArea>
        </ColumnWrapper>
      </StreetModePinContentContainer>
    </>
  )
}

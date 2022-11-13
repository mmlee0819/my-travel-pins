import React, { useState, useEffect, useContext, useRef, Dispatch } from "react"
import { StreetViewService } from "@react-google-maps/api"
import styled from "styled-components"
import { DocumentData } from "@firebase/firestore-types"
import backIcon from "../assets/back.png"
import {
  MessagesType,
  addMsg,
  checkRealTimePinMessages,
  queryMessengerInfo,
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
  min-height: calc(100vh - 30px);
  font-family: "Poppins";
  background-color: #ffffff;
  z-index: 101;
`
const Title = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-size: 1rem;
  color: #000000;
  margin: 5px 0;
`
const BackIconImg = styled.img`
  margin-right: 20px;
  width: 10%;
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
  font-size: 1rem;
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
  font-size: 1rem;
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
  width: 100%;
`
const MsgRowNoWrapper = styled(RowNoWrapper)`
  justify-content: flex-start;
  margin: 5px 0;
`

export const DetailImgsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  width: 80%;
  height: 30vh;
  gap: 20px;
`
export const DetailImg = styled.div<{
  bkImage: string
}>`
  display: flex;
  flex: 0 1 30%;
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
  minHeight: "100vh",
  width: "100vw",
}

export const centerSchool = {
  lat: 25.061945,
  lng: 121.5484174,
}

export const myGoogleApiKey = process.env.REACT_APP_google_API_KEY

const PinContentInStreetView = (props: Props) => {
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
      {selectedMarker?.albumURLs && selectedMarker?.albumURLs?.length !== 0 && (
        <DetailImgsWrapper>
          {selectedMarker.albumURLs.map((photoUrl: string) => {
            return <DetailImg key={photoUrl} bkImage={photoUrl} />
          })}
        </DetailImgsWrapper>
      )}
      <Title>{selectedMarker?.article?.content}</Title>
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
      } else return
    }

    document.addEventListener("keydown", keyDownListener)
    return () => {
      document.removeEventListener("keydown", keyDownListener)
    }
  })

  useEffect(() => {
    if (!selectedMarker?.id) return
    checkRealTimePinMessages(selectedMarker?.id, setMessages)
    return checkRealTimePinMessages(selectedMarker?.id, setMessages)
  }, [selectedMarker?.id])

  useEffect(() => {
    if (messages === undefined || messages.length === 0) return
    messages.map((item: DocumentData) => {
      queryMessengerInfo(item.messenger, setMessengerInfo)
    })
  }, [messages])

  return (
    <ColumnWrapper>
      <MsgNumText>{selectedMarker?.messages?.length || 0}則留言</MsgNumText>
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
          messengerInfo.length !== 0 &&
          messages.map((item: MessagesType, index: number) => {
            return (
              <MsgRowNoWrapper key={`${item.messenger}-${item.msgTimestamp}`}>
                <UserAvatar avatarUrl={messengerInfo[index].photoURL} />

                <MsgContent>
                  {messengerInfo[index].name}
                  <br />
                  {item.msgContent}
                </MsgContent>
              </MsgRowNoWrapper>
            )
          })}
      </MsgColumnWrapper>
    </ColumnWrapper>
  )
}
export default function StreetView(props: Props) {
  const { selectedMarker, setShowMemory } = props
  const [messages, setMessages] = useState<DocumentData[]>([])

  console.log("messages", messages)
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
      </StreetModePinContentContainer>
    </>
  )
}

import React, { useState, useEffect, useContext, useRef, Dispatch } from "react"
import { StreetViewService, GoogleMap, Marker } from "@react-google-maps/api"
import styled from "styled-components"
import parse from "html-react-parser"
import { db, storage } from "../../utils/firebase"
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { DocumentData } from "@firebase/firestore-types"
import {
  MessagesType,
  addMsg,
  checkRealTimePinMessages,
  deleteMsg,
  PinContent,
  checkRealTimePhotos,
} from "../../utils/pins"
import { AuthContext } from "../../context/authContext"
import Editor from "../post/editor"
import Upload from "../post/uploadPhoto"
import SwiperPhotos from "./swiperPhoto"
import moreIcon from "../../assets/buttons/moreIcon.png"
import moreHoverIcon from "../../assets/buttons/moreHover.png"
import whiteEditPencil from "../../assets/buttons/edit.png"
import blackEditPencil from "../../assets/buttons/blackEdit.png"
import calendar from "../../assets/calendar.png"
import location from "../../assets/location.png"

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-family: "Poppins", "sans-serif";
  background-color: rgb(45, 45, 45, 0.8);
  border-radius: 5px;
  z-index: 120;
`
const ContentArea = styled.div<{ showEditor: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex: row nowrap;
  padding: 20px;
  width: 80%;
  height: 80%;
  margin: 0 auto;
  font-size: ${(props) => props.theme.title.lg};
  color: #2d2d2d;
  background-color: rgb(255, 255, 255, 0.9);
  ${(props) => props.showEditor && "gap: 2%;"}
`
const LeftWrapper = styled.div`
  position: relative;
  align-self: center;
  width: 50%;
  height: 90%;
`
const RightWrapper = styled.div<{ showEditor: boolean }>`
  position: relative;
  align-self: center;
  width: 45%;
  height: 90%;
  ${(props) =>
    !props.showEditor &&
    `
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; 
  }`}
`
const MiddleSplit = styled.div`
  margin: 0 20px 0 10px;
  border-left: 2px dashed #454545;
  height: 100%;
`
const IconInList = styled.img`
  align-self: center;
  margin-right: 10px;
  width: 20px;
  height: 20px;
`
const EditWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  flex: 1 1 auto;
  margin: 20px 0 0 0;
  height: calc(90% - 30px);
  gap: 20px;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`

const Text = styled.div`
  display: flex;
  flex-flow: column nowrap;
  text-justify: justify;
  margin: 20px 0;
  font-size: ${(props) => props.theme.title.md};
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`
const ArticleTitle = styled(Text)`
  min-height: 40px;
  margin: 0;
  font-weight: 700;
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 799px), (max-height: 600px) {
    min-height: 30px;
  }
`
const Input = styled(Text)`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  min-height: 30px;
  height: 30px;
  margin: 0px;
  padding-left: 10px;
  border: 3px solid #ffffff;
  border-radius: 5px;
  &:focus {
    outline: #f99c62;
    border: 3px solid #f99c62;
  }
`

const TextNoMargin = styled(Text)`
  display: flex;
  flex-flow: row nowrap;
  margin-block-end: 0;
  text-align: justify;
`
const LocationText = styled(TextNoMargin)`
  margin: 30px 0 0 0;
`
const ArticleContentArea = styled(Text)`
  p {
    margin: 0;
    margin-block-end: 10px;
    text-align: justify;
  }
`

const StreetModeContainer = styled.div`
  height: 40vh;
  margin-bottom: 20px;
`

const Photo = styled.div`
  width: 100%;
  height: 200px;
  margin-bottom: 15px;
  background-size: 100% 100%;
`

const MsgNumText = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  margin-top: 30px;
  /* padding-right: 20px; */
  font-size: ${(props) => props.theme.title.md};
  border-bottom: 2px solid #d4d4d4;
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`
const MsgContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-size: ${(props) => props.theme.title.md};
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
  border: 2px solid #fff;
  border-radius: 50%;
`
const MsgColumnWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
`
const MsgRowNoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin: 5px 0;
`
const BtnEdit = styled.div`
  position: absolute;
  top: 10px;
  right: 20px;
  width: 25px;
  height: 25px;
  background-image: url(${blackEditPencil});
  background-size: 100% 100%;
  cursor: pointer;
  &:hover {
    background-image: url(${whiteEditPencil});
  }
`

const BtnMore = styled.div<{ showMore: boolean }>`
  position: absolute;
  top: 0px;
  right: 30px;
  width: 25px;
  height: 25px;
  display: flex;
  flex-flow: column wrap;
  background-image: url(${moreIcon});
  background-size: cover;
  cursor: pointer;
  &:hover {
    background-image: url(${moreHoverIcon});
  }
`

const BtnGreen = styled.div`
  position: absolute;
  top: 30px;
  right: 0px;
  display: flex;
  text-align: center;
  width: auto;
  padding: 5px 10px;
  line-height: 16px;
  font-size: ${(props) => props.theme.title.md};
  color: #fff;
  background-color: ${(props) => props.theme.color.deepMain};
  border-radius: 5px;
  z-index: 120;
  cursor: pointer;
`
const BtnDelete = styled(BtnGreen)<{ showDelete: boolean }>`
  top: 25px;
  display: ${(props) => (props.showDelete ? "flex" : "none")};
  background-color: ${(props) => props.theme.btnColor.bgGray};
`

const ArtiWrapper = styled.div`
  position: relative;
`

const BtnUploaded = styled(BtnGreen)`
  position: relative;
  top: initial;
  right: initial;
  width: 40%;
  align-items: center;
  justify-content: center;
`

const BtnPhotoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: end;
  align-content: end;
  height: 30px;
  line-height: 30px;
  width: 100%;
  gap: 20px;
`
const BtnSaveBackWrapper = styled(BtnPhotoWrapper)``

const BtnDone = styled(BtnUploaded)`
  min-width: 50px;
  width: 30%;
  height: 30px;
  margin: 0;
  padding: 0;
`
const BtnCancel = styled(BtnDone)`
  color: ${(props) => props.theme.color.deepMain};
  background-color: rgb(255, 255, 255, 0);
  border: 1px solid ${(props) => props.theme.btnColor.bgGray};
`

const MsgInput = styled.input`
  display: flex;
  flex: 1 1 auto;
  align-self: center;
  margin: 10px 0;
  padding-left: 10px;
  height: 30px;
  line-height: 30px;
  font-size: ${(props) => props.theme.title.md};
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
    font-size: ${(props) => props.theme.title.md};
  }
`

const PhotoText = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  margin: 5px 0;
  width: 100%;
  height: 100%;
  color: ${(props) => props.theme.color.bgDark};
  border-radius: 5px;
`

interface Props {
  selectedMarker: PinContent | undefined
  setShowMemory: Dispatch<React.SetStateAction<boolean>>
}

function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  setShowMemory: Dispatch<React.SetStateAction<boolean>>,
  showEditor: boolean
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (
        showEditor ||
        !ref.current ||
        ref.current.contains(event.target as Node)
      ) {
        return
      }
      setShowMemory(false)
    }
    window.addEventListener("mousedown", listener)
    window.addEventListener("touchstart", listener)
    return () => {
      window.removeEventListener("mousedown", listener)
      window.removeEventListener("touchstart", listener)
    }
  }, [ref, showEditor])
}

export default function DetailMemory(props: Props) {
  const { selectedMarker, setShowMemory } = props
  const { isLoaded, currentUser, isMyMap, isMyMemory } = useContext(AuthContext)
  const [messages, setMessages] = useState<DocumentData[] | MessagesType[]>([])
  const msgRef = useRef<HTMLInputElement>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [artiTitle, setArtiTitle] = useState<string>(
    selectedMarker?.article?.title || ""
  )
  const [travelDate, setTravelDate] = useState<string>(
    selectedMarker?.article?.travelDate || ""
  )
  const [artiContent, setArtiContent] = useState<string>(
    selectedMarker?.article?.content || ""
  )
  const [filesName, setFilesName] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hasUpload, setHasUpload] = useState(false)
  const [urls, setUrls] = useState<string[]>([])
  const [albumUrls, setAlbumUrls] = useState<string[]>([])
  const [showUploadMore, setShowUploadMore] = useState(false)
  const [hasDiscard, setHasDiscard] = useState(false)
  const [selectedMsgId, setSelectedMsgId] = useState("")
  const [canUpload, setCanUpload] = useState(true)
  const overlayRef = useRef<HTMLDivElement>(null)

  const updateTitle = async () => {
    if (!selectedMarker?.id) return
    const docRef = doc(db, "pins", selectedMarker?.id)
    try {
      await updateDoc(docRef, {
        article: {
          title: artiTitle,
          travelDate: travelDate,
          content: artiContent,
        },
      })
    } catch (error) {
      console.log("Failed to revert contents to original", error)
    }
  }

  const updateTravelDate = async () => {
    if (!selectedMarker?.id) return
    const docRef = doc(db, "pins", selectedMarker?.id)
    try {
      await updateDoc(docRef, {
        article: {
          title: artiTitle,
          travelDate: travelDate,
          content: artiContent,
        },
      })
    } catch (error) {
      console.log(
        "Failed to update travelDate from specific memory page",
        error
      )
    }
  }

  const updateArtiContent = async () => {
    if (!selectedMarker?.id) return
    const docRef = doc(db, "pins", selectedMarker?.id)
    try {
      await updateDoc(docRef, {
        article: {
          title: artiTitle,
          travelDate: travelDate,
          content: artiContent,
        },
      })
    } catch (error) {
      console.log(
        "Failed to update article content from specific memory page",
        error
      )
    }
  }
  const updatePhotos = async () => {
    if (!selectedMarker?.id) return
    const docRef = doc(db, "pins", selectedMarker?.id)
    try {
      await updateDoc(docRef, {
        albumURLs: arrayUnion(...urls),
        albumNames: arrayUnion(...filesName),
      })
      setHasUpload(false)
      setFilesName([])
      setUrls([])
      setUploadProgress(0)
      setShowUploadMore(true)
    } catch (error) {
      console.log("Failed to update photos from specific memory page", error)
    }
  }
  const updateToOrigin = async () => {
    if (!selectedMarker?.id || !hasDiscard) return
    const docRef = doc(db, "pins", selectedMarker?.id)
    try {
      await updateDoc(docRef, {
        article: {
          title: selectedMarker?.article?.title || "",
          travelDate: selectedMarker?.article?.travelDate || "",
          content: selectedMarker?.article?.content || "",
        },
        albumURLs: arrayRemove(...urls),
        albumNames: arrayRemove(...filesName),
      })
      setHasDiscard(false)
    } catch (error) {
      console.log(
        "Failed to update article content from specific memory page",
        error
      )
    }
  }
  const cancelPhotos = async () => {
    if (urls.length !== 0 && typeof currentUser?.id === "string") {
      const folderName = `${currentUser?.id?.slice(
        0,
        4
      )}-${selectedMarker?.location?.placeId.slice(0, 6)}`
      try {
        filesName.map(async (file) => {
          await deleteObject(ref(storage, `/${folderName}/${file}`))
        })
      } catch (error) {
        console.log("Failed to cancel uploaded", error)
      }
    }
    setHasUpload(false)
    setFilesName([])
    setUploadProgress(0)
    setUrls([])
  }

  useOnClickOutside(overlayRef, () => setShowMemory(false), showEditor)

  useEffect(() => {
    if (!selectedMarker?.id) return
    checkRealTimePinMessages(selectedMarker?.id, setMessages)
    return checkRealTimePinMessages(selectedMarker?.id, setMessages)
  }, [selectedMarker?.id])

  useEffect(() => {
    if (!selectedMarker?.id) return
    checkRealTimePhotos(selectedMarker?.id, setAlbumUrls)
    return checkRealTimePhotos(selectedMarker?.id, setAlbumUrls)
  }, [selectedMarker?.id])

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
          fullscreenControl: true,
          addressControl: false,
          scrollwheel: false,
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
          <ContentArea ref={overlayRef} showEditor={showEditor}>
            {(isMyMap || isMyMemory) && !showEditor && (
              <BtnEdit
                onClick={() => {
                  setShowEditor(true)
                  setHasUpload(false)
                }}
              />
            )}

            <LeftWrapper>
              {albumUrls.length > 0 ? (
                <SwiperPhotos photos={albumUrls} />
              ) : (
                <GoogleMap
                  mapContainerStyle={{
                    height: "100%",
                    width: "100%",
                  }}
                  center={{
                    lat: selectedMarker?.location.lat,
                    lng: selectedMarker?.location.lng,
                  }}
                  zoom={14}
                  options={{
                    draggable: true,
                    mapTypeControl: false,
                    streetViewControl: true,
                    scaleControl: false,
                    fullscreenControl: true,
                    scrollwheel: true,
                    minZoom: 2,
                  }}
                >
                  <Marker
                    position={{
                      lat: selectedMarker?.location.lat,
                      lng: selectedMarker?.location.lng,
                    }}
                  />
                </GoogleMap>
              )}
            </LeftWrapper>
            <MiddleSplit />
            <RightWrapper showEditor={showEditor}>
              {!showEditor && (
                <>
                  <ArticleTitle>{artiTitle}</ArticleTitle>
                  <TextNoMargin>
                    <IconInList src={calendar} />
                    {travelDate}
                  </TextNoMargin>
                  <ArticleContentArea>{parse(artiContent)}</ArticleContentArea>
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
                        onKeyPress={(e) => {
                          if (
                            e.key === "Enter" &&
                            typeof selectedMarker?.id === "string" &&
                            typeof currentUser?.id === "string" &&
                            msgRef.current !== undefined &&
                            msgRef.current !== null
                          ) {
                            addMsg(
                              currentUser?.id,
                              selectedMarker?.id,
                              msgRef?.current?.value
                            )
                            msgRef.current.value = ""
                          }
                        }}
                      />
                    </MsgRowNoWrapper>
                    {messages !== undefined &&
                      messages.length !== 0 &&
                      messages.map((item: DocumentData | MessagesType) => {
                        return (
                          <MsgRowNoWrapper
                            key={`${item.messenger}-${item.msgTimestamp}`}
                          >
                            <UserAvatar avatarURL={item.photoURL} />
                            <MsgContent>
                              {item.name}
                              <br />
                              {item.msgContent}
                            </MsgContent>
                            {currentUser !== null &&
                              item.messenger === currentUser?.id && (
                                <BtnMore
                                  id={`${item.messenger}-${item.msgTimestamp}`}
                                  showMore={showDelete}
                                  onClick={(
                                    e: React.MouseEvent<HTMLDivElement>
                                  ) => {
                                    if (
                                      (e.target as HTMLDivElement).id !==
                                      selectedMsgId
                                    ) {
                                      setSelectedMsgId(
                                        (e.target as HTMLDivElement).id
                                      )
                                      setShowDelete(true)
                                    } else {
                                      setShowDelete((prev) => !prev)
                                    }
                                  }}
                                >
                                  <BtnDelete
                                    id={`${item.messenger}-${item.msgTimestamp}`}
                                    showDelete={
                                      showDelete &&
                                      `${item.messenger}-${item.msgTimestamp}` ===
                                        selectedMsgId
                                        ? true
                                        : false
                                    }
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
                                  </BtnDelete>
                                </BtnMore>
                              )}
                          </MsgRowNoWrapper>
                        )
                      })}
                  </MsgColumnWrapper>
                  <LocationText>
                    <IconInList src={location} />
                    {selectedMarker?.location?.name}
                  </LocationText>{" "}
                </>
              )}

              {isLoaded && !showEditor && (
                <>
                  <StreetModeContainer id="street-mode-container">
                    <StreetViewService onLoad={onStreetLoad} />
                  </StreetModeContainer>
                  {albumUrls.length > 0 && (
                    <GoogleMap
                      mapContainerStyle={{
                        height: "40vh",
                        width: "100%",
                        marginTop: "20px",
                      }}
                      center={{
                        lat: selectedMarker?.location.lat,
                        lng: selectedMarker?.location.lng,
                      }}
                      zoom={14}
                      options={{
                        draggable: true,
                        mapTypeControl: false,
                        streetViewControl: false,
                        scaleControl: false,
                        fullscreenControl: true,
                        scrollwheel: false,
                      }}
                    >
                      <Marker
                        position={{
                          lat: selectedMarker?.location.lat,
                          lng: selectedMarker?.location.lng,
                        }}
                      />
                    </GoogleMap>
                  )}
                </>
              )}
              {(isMyMap || isMyMemory) && showEditor && (
                <BtnSaveBackWrapper>
                  <BtnCancel
                    onClick={() => {
                      setArtiTitle(selectedMarker?.article?.title || "")
                      setTravelDate(selectedMarker?.article?.travelDate || "")
                      setArtiContent(selectedMarker?.article?.content || "")
                      if (hasUpload) {
                        cancelPhotos()
                      }
                      updateToOrigin()
                      setShowMore(false)
                      setHasDiscard(true)
                      setShowEditor(false)
                    }}
                  >
                    Back
                  </BtnCancel>
                  <BtnDone
                    onClick={() => {
                      if (hasUpload) {
                        updatePhotos()
                      }
                      updateTitle()
                      updateTravelDate()
                      updateArtiContent()
                      setShowEditor(false)
                      setArtiTitle(artiTitle)
                      setTravelDate(travelDate)
                      setArtiContent(artiContent)
                    }}
                  >
                    Done
                  </BtnDone>
                </BtnSaveBackWrapper>
              )}
              {showEditor && (
                <>
                  <EditWrapper>
                    <Input
                      as="input"
                      value={artiTitle}
                      placeholder="Title"
                      onChange={(e) => {
                        setArtiTitle(e.target.value)
                      }}
                    />
                    <Input
                      as="input"
                      type="date"
                      pattern="\d{4}-\d{2}-\d{2}"
                      min="1900-01-01"
                      max="9999-12-31"
                      value={travelDate}
                      onChange={(e) => {
                        setTravelDate(e.target.value)
                      }}
                    />
                    <ArtiWrapper>
                      <Editor
                        artiContent={artiContent}
                        setArtiContent={setArtiContent}
                      />
                    </ArtiWrapper>
                    {selectedMarker &&
                      typeof selectedMarker.id === "string" &&
                      typeof selectedMarker.userId === "string" &&
                      typeof selectedMarker.location.lat === "number" &&
                      typeof selectedMarker.location.lng === "number" &&
                      typeof selectedMarker.location.placeId === "string" &&
                      (showEditor || showUploadMore) && (
                        <Upload
                          canUpload={canUpload}
                          currentPin={{
                            id: selectedMarker.id,
                            userId: selectedMarker.userId,
                            location: {
                              lat: selectedMarker.location.lat,
                              lng: selectedMarker.location.lng,
                              name: selectedMarker.location.name,
                              placeId: selectedMarker.location.placeId,
                            },
                          }}
                          setFilesName={setFilesName}
                          hasUpload={hasUpload}
                          setHasUpload={setHasUpload}
                          urls={urls}
                          setUrls={setUrls}
                          setUploadProgress={setUploadProgress}
                        />
                      )}
                  </EditWrapper>
                </>
              )}
            </RightWrapper>
          </ContentArea>
        )}
    </Container>
  )
}

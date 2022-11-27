import React, { useState, useEffect, useContext, useRef, Dispatch } from "react"
import { StreetViewService, GoogleMap, Marker } from "@react-google-maps/api"
import styled from "styled-components"
import parse from "html-react-parser"
import { db, storage } from "../Utils/firebase"
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { DocumentData } from "@firebase/firestore-types"
import {
  MessagesType,
  addMsg,
  checkRealTimePinMessages,
  queryMessengerInfo,
  deleteMsg,
  PinContent,
} from "../User/ts_fn_commonUse"
import { AuthContext } from "../Context/authContext"
import Editor from "../Components/editor"
import Upload from "../User/components/uploadPhoto"
import moreIcon from "../assets/buttons/moreIcon.png"
import moreHoverIcon from "../assets/buttons/moreHover.png"
import SwiperPhotos from "./swiperPhoto"
import editPencil from "../assets/buttons/blackEdit.png"

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  font-family: "Poppins", "sans-serif";
  background-color: rgb(45, 45, 45, 0.8);
  z-index: 120;
`
const ContentArea = styled.div`
  position: relative;
  padding: 30px 6%;
  width: 60%;
  height: 100%;
  margin: 0 auto;
  font-size: 4rem;
  color: #2d2d2d;
  background-color: rgb(255, 255, 255, 0.9);
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`
const EditWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column wrap;
  margin: 50px 0 20px 0;
  gap: 20px;
`

const Text = styled.div`
  display: flex;
  flex-flow: column nowrap;
  text-justify: justify;
  margin: 25px 0;
  font-size: ${(props) => props.theme.title.md};
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`
const ArticleTitle = styled(Text)`
  min-height: 40px;
  margin: 15px 0 15px 0;
  font-weight: 700;
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 799px), (max-height: 600px) {
    min-height: 30px;
  }
`
const Input = styled(Text)`
  width: 100%;
  margin: 0px;
  padding-left: 10px;
  border: 3px solid #ffffff;
  border-radius: 5px;
  &:focus {
    outline: #f99c62;
    border: 3px solid #f99c62;
  }
`
const ConfirmedTitle = styled(Input)`
  font-weight: 700;
  border: none;
`
const ConfirmedText = styled(Input)`
  border: none;
`
const TextNoMargin = styled(Text)`
  margin: 0;
  margin-block-end: 0;
  text-align: justify;
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
const PhotoImg = styled(Photo)<{ bkImage: string }>`
  background-image: ${(props) => `url(${props.bkImage})`};
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
  border: 2px solid #fff;
  border-radius: 50%;
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
const BtnEdit = styled.div`
  position: absolute;
  top: 45px;
  right: 30px;
  width: 25px;
  height: 25px;
  background-image: url(${editPencil});
  background-size: 100% 100%;
  cursor: pointer;
`
const BtnMore = styled.div<{ showMore: boolean }>`
  position: absolute;
  right: 40px;
  display: flex;
  flex-flow: column wrap;
  width: 30px;
  height: 25px;
  font-size: 16px;
  background-image: ${(props) =>
    props.showMore ? `url(${moreHoverIcon})` : `url(${moreIcon})`};
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
  font-size: 16px;
  color: #fff;
  background-color: #5594b7;
  border-radius: 5px;
  z-index: 120;
  cursor: pointer;
`
const BtnRed = styled(BtnGreen)`
  background-color: #ca3434;
`

const ArtiWrapper = styled.div`
  position: relative;
`
const BtnSave = styled(BtnGreen)`
  top: 7.5px;
  right: 15px;
  &:hover {
    padding: 5px 20px;
  }
`

const BtnWrapper = styled.div`
  position: relative;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20%;
`
const BtnUploaded = styled(BtnGreen)`
  position: relative;
  top: initial;
  right: initial;
  width: 40%;
  align-items: center;
  justify-content: center;
`
const BtnCancelUpload = styled(BtnUploaded)`
  background-color: #ca3434;
`
const BtnColumnWrapper = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-content: end;
  width: 100%;
  gap: 20%;
`
const BtnRemainChange = styled(BtnUploaded)`
  margin: 5px 0px;
  padding: 10px 5px;
`
const BtnRemoveChange = styled(BtnRemainChange)`
  background-color: #ca3434;
`

const MsgInput = styled.input`
  display: flex;
  flex: 1 1 auto;
  align-self: center;
  margin: 10px 0;
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
  const [messengerInfo, setMessengerInfo] = useState<DocumentData[]>([])
  const msgRef = useRef<HTMLInputElement>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [showEditTitle, setShowEditTitle] = useState(true)
  const [showEditTravelDate, setShowEditTravelDate] = useState(true)
  const [showEditArtiContent, setShowEditArtiContent] = useState(true)
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
  const [photos, setPhotos] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hasUpload, setHasUpload] = useState(false)
  const [urls, setUrls] = useState<string[]>([])
  const [showSavedPhoto, setShowSavedPhoto] = useState(false)
  const [savedPhotoUrls, setSavedPhotoUrls] = useState<string[]>([])
  const [savedPhotoFilesName, setSavedPhotoFilesName] = useState<string[]>([])
  const [hasDiscard, setHasDiscard] = useState(false)
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
      setShowEditTitle(false)
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
      setShowEditTravelDate(false)
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
      setShowEditArtiContent(false)
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
      setSavedPhotoUrls((prev: string[]) => [...prev, ...urls])
      setSavedPhotoFilesName((prev: string[]) => [...prev, ...filesName])
      setHasUpload(false)
      setFilesName([])
      setPhotos([])
      setUrls([])
      setUploadProgress(0)
      setShowSavedPhoto(true)
    } catch (error) {
      console.log(
        "Failed to update article content from specific memory page",
        error
      )
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
      setSavedPhotoUrls([])
      setSavedPhotoFilesName([])
      setShowEditArtiContent(false)
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
      )}-${selectedMarker?.location?.placeId.slice(0, 4)}`
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
    setPhotos([])
    setUploadProgress(0)
    setUrls([])
  }

  useOnClickOutside(overlayRef, () => setShowMemory(false), showEditor)

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
          <ContentArea ref={overlayRef}>
            {(isMyMap || isMyMemory) && !showEditor && (
              <BtnEdit
                onClick={() => {
                  setShowEditor(true)
                }}
              />
            )}
            {(isMyMap || isMyMemory) && showEditor && (
              <BtnMore
                showMore={showMore}
                onClick={() => {
                  setShowMore((prev) => !prev)
                }}
              />
            )}
            {showMore && (
              <BtnColumnWrapper>
                <BtnRemainChange
                  onClick={() => {
                    if (!showEditor) {
                      setShowEditor(true)
                      setShowEditTitle(true)
                      setShowEditTravelDate(true)
                      setShowEditArtiContent(true)
                      setHasUpload(false)
                    } else {
                      setShowEditor(false)
                      setShowEditTitle(false)
                      setShowEditTravelDate(false)
                      setShowEditArtiContent(false)
                      setArtiTitle(selectedMarker?.article?.title || "")
                      setTravelDate(selectedMarker?.article?.travelDate || "")
                      setArtiContent(selectedMarker?.article?.content || "")
                    }
                    setShowMore(false)
                  }}
                >
                  {showEditor ? "Remain all changes and back" : "Edit"}
                </BtnRemainChange>
                {showEditor && (
                  <BtnRemoveChange
                    onClick={() => {
                      setShowEditTitle(false)
                      setShowEditTravelDate(false)
                      setShowEditArtiContent(false)
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
                    Discard all changes
                  </BtnRemoveChange>
                )}
              </BtnColumnWrapper>
            )}
            {showEditor && (
              <>
                <EditWrapper>
                  {showEditTitle ? (
                    <Input
                      as="input"
                      value={artiTitle}
                      placeholder="Title"
                      onChange={(e) => {
                        setArtiTitle(e.target.value)
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          updateTitle()
                        }
                      }}
                    />
                  ) : (
                    <ConfirmedTitle as="div">{artiTitle}</ConfirmedTitle>
                  )}
                  {showEditTravelDate ? (
                    <Input
                      as="input"
                      type="date"
                      value={travelDate}
                      onChange={(e) => {
                        setTravelDate(e.target.value)
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          updateTravelDate()
                        }
                      }}
                    />
                  ) : (
                    <ConfirmedText as="div">{travelDate}</ConfirmedText>
                  )}
                </EditWrapper>
                {showEditArtiContent ? (
                  <ArtiWrapper>
                    <BtnSave onClick={updateArtiContent}>Save</BtnSave>
                    <Editor
                      artiContent={artiContent}
                      setArtiContent={setArtiContent}
                    />
                  </ArtiWrapper>
                ) : (
                  <ConfirmedText>{parse(artiContent)}</ConfirmedText>
                )}
                {selectedMarker &&
                  typeof selectedMarker.id === "string" &&
                  typeof selectedMarker.userId === "string" &&
                  typeof selectedMarker.location.lat === "number" &&
                  typeof selectedMarker.location.lng === "number" &&
                  typeof selectedMarker.location.placeId === "string" && (
                    <EditWrapper>
                      {showEditor && (
                        <Upload
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
                          filesName={filesName}
                          setFilesName={setFilesName}
                          photos={photos}
                          setPhotos={setPhotos}
                          hasUpload={hasUpload}
                          setHasUpload={setHasUpload}
                          urls={urls}
                          setUrls={setUrls}
                          setUploadProgress={setUploadProgress}
                        />
                      )}
                      {hasUpload && (
                        <BtnWrapper>
                          <BtnUploaded onClick={updatePhotos}>
                            Save uploaded
                          </BtnUploaded>
                          <BtnCancelUpload onClick={cancelPhotos}>
                            Cancel
                          </BtnCancelUpload>
                        </BtnWrapper>
                      )}

                      {showSavedPhoto &&
                        savedPhotoUrls.map((photoUrl: string) => (
                          <PhotoImg key={photoUrl} bkImage={photoUrl} />
                        ))}
                    </EditWrapper>
                  )}
              </>
            )}
            {!showEditor && (
              <>
                <ArticleTitle>{artiTitle}</ArticleTitle>
                <TextNoMargin>{travelDate}</TextNoMargin>
              </>
            )}
            {!showEditor && selectedMarker?.article?.content !== undefined && (
              <TextNoMargin>{parse(artiContent)}</TextNoMargin>
            )}
            {selectedMarker?.albumURLs &&
              typeof selectedMarker?.albumURLs !== null && (
                <SwiperPhotos photos={selectedMarker?.albumURLs} />
              )}

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
                            <BtnMore
                              showMore={showDelete}
                              onClick={() => {
                                setShowDelete((prev) => !prev)
                              }}
                            >
                              {showDelete && (
                                <BtnRed
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
                                </BtnRed>
                              )}
                            </BtnMore>
                          )}
                      </MsgRowNoWrapper>
                    )
                  }
                )}
            </MsgColumnWrapper>
            <TextNoMargin>{selectedMarker?.location?.name}</TextNoMargin>
            {isLoaded && (
              <>
                <StreetModeContainer id="street-mode-container">
                  <StreetViewService onLoad={onStreetLoad} />
                </StreetModeContainer>
                <GoogleMap
                  mapContainerStyle={{
                    height: "40vh",
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
                    streetViewControl: false,
                    scaleControl: false,
                    fullscreenControl: false,
                  }}
                >
                  <Marker
                    position={{
                      lat: selectedMarker?.location.lat,
                      lng: selectedMarker?.location.lng,
                    }}
                  />
                </GoogleMap>
              </>
            )}
          </ContentArea>
        )}
    </Container>
  )
}

import React from "react"
import { useState, useContext, useEffect } from "react"
import styled from "styled-components"
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  InfoWindow,
} from "@react-google-maps/api"
import { darkMap } from "./darkMap"
import { AuthContext } from "../Context/authContext"
import homeIcon from "./homeIcon.png"
import uploadIcon from "./uploadImgIcon.png"
import StreetView, { containerStyle } from "../Utils/gmap"
import { db, storage } from "../Utils/firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { DocumentData } from "@firebase/firestore-types"
import defaultImage from "../assets/defaultImage.png"
import { choosePinOnMap, getPins } from "./ts_fn_commonUse"

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  margin: 0 auto;
`
const Title = styled.div`
  color: #000000;
`

const SearchWrapper = styled.div`
  position: absolute;
  top: 80px;
  left: 30px;
  display: flex;
  flex-flow: column wrap;
  width: 30%;
  background-color: #ffffff;
  padding: 10px;
  opacity: 0.6;
  gap: 20px;
  font-size: 14px;
`
const Input = styled.input`
  width: 100%;
  height: 30px;
  font-size: 15px;
  color: #ffffff;
  background-color: #000000;
  border: 1px solid #000000;
  opacity: 0.8;
  z-index: 100;
`

const BtnAddPin = styled.div`
  position: relative;
  display: flex;
  align-self: flex-start;
  align-items: center;
  padding: 10px;
  height: 30px;
  color: #ffffff;
  background-color: #000000;
  opacity: 0.8;
  border-radius: 10px;
  cursor: pointer;
`
const BtnUpload = styled.button`
  display: flex;
  justify-content: center;
  align-self: start;
  align-items: center;
  padding: 10px;
  height: 30px;
  color: #ffffff;
  background-color: #5197ff;
  border: none;
  opacity: 0.8;
  border-radius: 10px;
  cursor: pointer;
`
const BtnPost = styled(BtnAddPin)`
  margin-top: 20px;
`
const BtnCancel = styled(BtnPost)``
const PostBtnWrapper = styled(Wrapper)`
  justify-content: space-between;
  margin-bottom: 10px;
`
const CancelReminder = styled(Title)`
  text-align: end;
`
const PostArea = styled.div`
  position: absolute;
  top: 20px;
  right: 60px;
  display: flex;
  flex-flow: column nowrap;
  background-color: #ffffff;
  width: 40%;
  padding: 10px;
  height: 100%;
  font-size: 14px;
  opacity: 0.6;
`
const ArticleTitleInput = styled.input`
  background-color: #ffffff;
  border: 1px solid #373232ad;
  margin-bottom: 3px;
`
const UploadPhotoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column wrap;
`
const UrlsImgWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
`
const ArticleWrapper = styled(UploadPhotoWrapper)``
const Textarea = styled.textarea``
const UploadImgLabel = styled.label`
  display: flex;
  align-items: center;
  height: 64px;
  cursor: pointer;
`
const UploadImgIcon = styled.img`
  width: 30px;
  height: 30px;
  z-index: 3;
`

const UploadImgInput = styled.input`
  display: none;
`

export const PinInfoArea = styled.div`
  background-color: #ffffff;
  cursor: pointer;
`
export const PinInfoImg = styled.img`
  width: 150px;
  height: 120px;
`
export const PinInfoTitle = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 700;
`

interface Position {
  placeId?: string | undefined
  name?: string | undefined
  lat: number | undefined
  lng: number | undefined
}
interface Hometown {
  lat?: number | null
  lng?: number | null
  name?: string | null
}

export default function User() {
  const { isLoaded, isLogin, currentUser, navigate } = useContext(AuthContext)
  console.log("currentUser", currentUser)
  const center = {
    lat: currentUser?.hometownLat,
    lng: currentUser?.hometownLng,
  }
  const [location, setLocation] = useState<google.maps.LatLng | Position>()
  const [newPin, setNewPin] = useState({
    id: "",
    userId: "",
    location: {
      lat: 0,
      lng: 0,
      name: "",
      placeId: "",
    },
  })

  const [markers, setMarkers] = useState<DocumentData[]>([])
  const [selectedMarker, setSelectedMarker] = useState<DocumentData>()
  const [hometown, setHometown] = useState<Hometown>()
  const [searchBox, setSearchBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  const [hasAddPin, setHasAddPin] = useState(false)
  const [filesName, setFilesName] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hasUpload, setHasUpload] = useState(false)
  const [urls, setUrls] = useState<string[]>([])
  const [artiTitle, setArtiTitle] = useState<string>("")
  const [travelDate, setTravelDate] = useState<string>("")
  const [artiContent, setArtiContent] = useState<string>("")
  const [hasPosted, setHasPosted] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [showMemory, setShowMemory] = useState(false)

  console.log("markers", markers)
  console.log("selectedMarker", selectedMarker)
  console.log("showMemory", showMemory)

  useEffect(() => {
    if (typeof currentUser?.id === "string") {
      getPins(
        currentUser,
        currentUser?.id,
        hasFetched,
        setHasFetched,
        setMarkers
      )
    } else return
  }, [currentUser?.id])

  // const onMkLoad = (marker: google.maps.Marker) => {
  //   console.log(" marker", marker)
  // }

  const onPlacesChanged = () => {
    if (searchBox instanceof google.maps.places.SearchBox) {
      console.log(searchBox.getPlaces())
      const searchResult = searchBox.getPlaces()
      if (searchResult !== undefined && currentUser) {
        const newLat = searchResult[0]?.geometry?.location?.lat()
        const newLng = searchResult[0]?.geometry?.location?.lng()
        const placeName = searchResult[0]?.name
        const placeId = searchResult[0]?.place_id
        if (newLat && newLng) {
          setLocation({ lat: newLat, lng: newLng })
        }
        if (newLat && newLng && placeName && placeId) {
          const newPinInfo = {
            id: `${currentUser?.id}-${placeId}`,
            userId: `${currentUser?.id}`,
            location: {
              lat: newLat,
              lng: newLng,
              name: placeName,
              placeId: placeId,
            },
          }
          setNewPin(newPinInfo)
        }
      }
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref)
  const onInfoWinLoad = (infoWindow: google.maps.InfoWindow) => {
    console.log("infoWindow: ", infoWindow)
  }

  const addPin = async () => {
    if (!newPin) return
    await setDoc(doc(db, "pins", newPin?.id), newPin)
    setMarkers((prev) => {
      return [
        ...prev,
        {
          location: {
            placeId: newPin.location.placeId,
            lat: newPin.location.lat,
            lng: newPin.location.lng,
            name: newPin.location.name,
          },
        },
      ]
    })
    setHasAddPin(true)
    setHasPosted(false)
    setHasUpload(false)
    setHasFetched(false)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilesName([])
    setPhotos([])
    if (e.target.files !== null) {
      for (const file of e.target.files) {
        setFilesName((prev: string[]) => {
          return [...prev, file.name]
        })
        setPhotos((prev: File[]) => {
          return [...prev, file]
        })
      }
    }
  }

  const handleUpload = () => {
    photos.map((photo) => {
      if (typeof currentUser?.id === "string") {
        const folderName = `${currentUser?.id?.slice(
          0,
          4
        )}-${newPin.location.placeId.slice(0, 4)}`

        const imgRef = ref(storage, `/${folderName}/${photo.name}`)
        const uploadTask = uploadBytesResumable(imgRef, photo)
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setUploadProgress(progress)
            setHasUpload(true)
          },
          (error) => {
            console.log(error)
          },
          async () => {
            const url = await getDownloadURL(
              ref(storage, `/${folderName}/${photo.name}`)
            )
            setUrls((prev) => {
              return [...prev, url]
            })
          }
        )
      }
    })
  }

  const addMemory = async () => {
    if (filesName.length !== 0 && !hasUpload) {
      alert(
        "It seems that you have some photos, please click upload button first!"
      )
      return
    }
    const docRef = doc(db, "pins", newPin.id)
    const artiInfo = {
      article: {
        title: artiTitle,
        travelDate: travelDate,
        content: artiContent,
      },
      postTime: new Date(),
      albumURLs: urls,
      albumNames: filesName,
    }
    try {
      await updateDoc(docRef, artiInfo)
      setHasPosted(true)
      setHasAddPin(false)
      setFilesName([])
      setPhotos([])
      setUploadProgress(0)
      setUrls([])
      if (currentUser) {
        navigate(`/${currentUser.name}/my-memories`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const cancelPost = () => {
    if (urls.length !== 0 && typeof currentUser?.id === "string") {
      const folderName = `${currentUser?.id?.slice(
        0,
        4
      )}-${newPin.location.placeId.slice(0, 4)}`
      try {
        filesName.map(async (file) => {
          await deleteObject(ref(storage, `/${folderName}/${file}`))
        })
      } catch (error) {
        console.log(error)
      }
    }
    setHasPosted(true)
    setHasAddPin(false)
    setFilesName([])
    setPhotos([])
    setUploadProgress(0)
    setUrls([])
  }
  if (!isLogin || currentUser === undefined || currentUser === null)
    return <Title>你沒有登入</Title>

  return (
    <>
      {isLoaded &&
      typeof currentUser?.hometownLat === "number" &&
      typeof currentUser?.hometownLng === "number" ? (
        <GoogleMap
          id="my-map"
          mapTypeId="94ce067fe76ff36f"
          mapContainerStyle={containerStyle}
          center={{
            lat: selectedMarker?.location?.lat || currentUser?.hometownLat,
            lng: selectedMarker?.location?.lng || currentUser?.hometownLng,
          }}
          zoom={selectedMarker ? 6 : 2}
          options={{ draggable: true, styles: darkMap }}
        >
          <SearchWrapper>
            <Title>Add a new memory</Title>
            <Title>Step 1 : Where did you go?</Title>
            {hasAddPin ? (
              <Title>{newPin.location.name}</Title>
            ) : (
              <StandaloneSearchBox
                onLoad={onLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <Input placeholder="City, Address..."></Input>
              </StandaloneSearchBox>
            )}
            {hasAddPin ? (
              ""
            ) : (
              <BtnAddPin onClick={addPin}>Confirm to add pin</BtnAddPin>
            )}
            <Title>Step 2 : Write something to save your memory!</Title>
          </SearchWrapper>
          {hasAddPin && !hasPosted ? (
            <PostArea>
              <ArticleWrapper>
                <ArticleTitleInput
                  placeholder="Title"
                  onChange={(e) => {
                    setArtiTitle(e.target.value)
                  }}
                ></ArticleTitleInput>
                <ArticleTitleInput
                  type="date"
                  placeholder="When did you go there?"
                  onChange={(e) => {
                    setTravelDate(e.target.value)
                  }}
                ></ArticleTitleInput>
                <Textarea
                  placeholder="What's on your mind?"
                  rows={6}
                  onChange={(e) => {
                    setArtiContent(e.target.value)
                  }}
                />
              </ArticleWrapper>
              {hasUpload && urls ? (
                <UrlsImgWrapper>
                  {urls.map((url) => {
                    console.log(url)
                    return <UploadImgIcon key={url} src={url} />
                  })}
                </UrlsImgWrapper>
              ) : (
                <UploadPhotoWrapper>
                  <UploadImgLabel>
                    <UploadImgIcon src={uploadIcon} />
                    {filesName.length !== 0
                      ? filesName.map((fileName) => {
                          return `\n${fileName}`
                        })
                      : "Choose photos"}
                    <UploadImgInput
                      type="file"
                      accept="image/*"
                      multiple={true}
                      onChange={(e) => {
                        handleChange(e)
                      }}
                    />
                  </UploadImgLabel>
                  <BtnUpload onClick={handleUpload}>Upload</BtnUpload>
                </UploadPhotoWrapper>
              )}
              <PostBtnWrapper>
                <BtnPost onClick={addMemory}>Confirm to post</BtnPost>
                <BtnCancel onClick={cancelPost}>Cancel</BtnCancel>
              </PostBtnWrapper>
              <CancelReminder>
                If you click `Cancel`, all content and uploaded files will not
                be preserved.
              </CancelReminder>
            </PostArea>
          ) : (
            ""
          )}
          {typeof center?.lat === "number" &&
          typeof center?.lng === "number" ? (
            <Marker
              // onLoad={onMkLoad}
              position={{
                lat: currentUser?.hometownLat,
                lng: currentUser?.hometownLng,
              }}
              icon={homeIcon}
              onClick={() => {
                if (
                  typeof currentUser?.hometownLat === "number" &&
                  typeof currentUser?.hometownLng === "number" &&
                  typeof currentUser?.hometownName === "string"
                ) {
                  setHometown({
                    lat: currentUser?.hometownLat,
                    lng: currentUser?.hometownLng,
                    name: currentUser?.hometownName,
                  })
                }
              }}
            />
          ) : (
            ""
          )}
          {hometown && hometown?.name ? (
            <InfoWindow
              onLoad={onInfoWinLoad}
              position={{
                lat: currentUser?.hometownLat,
                lng: currentUser?.hometownLng,
              }}
              options={{
                pixelOffset: new window.google.maps.Size(0, -50),
              }}
              onCloseClick={() => {
                setHometown({})
              }}
            >
              <PinInfoArea>
                <PinInfoTitle>
                  {hometown && hometown?.name !== ""
                    ? `My Hometown ${hometown?.name}`
                    : ""}
                </PinInfoTitle>
              </PinInfoArea>
            </InfoWindow>
          ) : (
            ""
          )}
          {markers?.map((marker) => {
            return (
              <Marker
                key={marker.location.placeId}
                // onLoad={onMkLoad}
                draggable={true}
                position={
                  new google.maps.LatLng(
                    marker.location.lat,
                    marker.location.lng
                  )
                }
                onClick={(e: google.maps.MapMouseEvent) => {
                  choosePinOnMap(
                    e,
                    markers,
                    setSelectedMarker,
                    setShowInfoWindow
                  )
                }}
              />
            )
          })}
          {selectedMarker && (
            <>
              <InfoWindow
                onLoad={onInfoWinLoad}
                onCloseClick={() => {
                  setSelectedMarker(undefined)
                }}
                position={{
                  lat: selectedMarker?.location?.lat,
                  lng: selectedMarker?.location?.lng,
                }}
                options={{
                  pixelOffset: new window.google.maps.Size(0, -40),
                }}
              >
                <PinInfoArea
                  onClick={() => {
                    setShowMemory(true)
                  }}
                >
                  <PinInfoImg
                    src={
                      selectedMarker.albumURLs
                        ? selectedMarker?.albumURLs[0]
                        : defaultImage
                    }
                  />
                  <PinInfoTitle>{selectedMarker?.location?.name}</PinInfoTitle>
                </PinInfoArea>
              </InfoWindow>
              {selectedMarker && showInfoWindow && showMemory && (
                <StreetView
                  selectedMarker={selectedMarker}
                  setShowMemory={setShowMemory}
                />
              )}
            </>
          )}
        </GoogleMap>
      ) : (
        ""
      )}
    </>
  )
}

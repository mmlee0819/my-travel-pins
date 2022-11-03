import React from "react"
import { useState, useContext } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api"
import { darkMap } from "../User/darkMap"
import { AuthContext } from "../Context/authContext"
import homeIcon from "./homeIcon.png"
import uploadIcon from "./uploadImgIcon.png"
import { containerStyle, myGoogleApiKey } from "../Utils/gmap"
import { db, storage } from "../Utils/firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  margin: 0 auto;
`
const Title = styled.div`
  color: #000000;
  width: 100%;
`

const BtnLink = styled(Link)`
  margin: 0 20px;
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
  height: 60%;
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
  top: 80px;
  right: 30px;
  display: flex;
  flex-flow: column nowrap;
  background-color: #ffffff;
  width: 40%;
  padding: 10px;
  height: 70%;
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
interface Position {
  placeId?: string | undefined
  lat: number | undefined
  lng: number | undefined
}

const libraries = String(["places"])
function User() {
  const google = window.google
  const { isLoaded, currentUser, navigate } = useContext(AuthContext)
  console.log(currentUser)
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
  // const [marker, setMarker] = useState<google.maps.Marker>()
  const [markers, setMarkers] = useState<Position[]>([])
  const [searchBox, setSearchBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  console.log("newpin", newPin)
  console.log("markers", markers)
  const [hasAddPin, setHasAddPin] = useState(false)
  console.log("hasAddPin", hasAddPin)
  const [filesName, setFilesName] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hasUpload, setHasUpload] = useState(false)
  const [urls, setUrls] = useState<string[]>([])

  // const { isLoaded } = useJsApiLoader({
  //   googleMapsApiKey: myGoogleApiKey!,
  //   [libraries]: libraries,
  // })
  const [artiTitle, setArtiTitle] = useState("")
  const [travelDate, setTravelDate] = useState("")
  const [artiContent, setArtiContent] = useState("")
  const [hasPosted, setHasPosted] = useState(false)

  const onMkLoad = (marker: google.maps.Marker) => {
    console.log(" marker", marker)
  }
  const onPlacesChanged = () => {
    if (searchBox instanceof google.maps.places.SearchBox) {
      console.log(searchBox.getPlaces())
      const searchResult = searchBox.getPlaces()
      if (searchResult) {
        const newLat = searchResult[0]?.geometry?.location?.lat()
        const newLng = searchResult[0]?.geometry?.location?.lng()
        const placeName = searchResult[0]?.name
        const placeId = searchResult[0]?.place_id
        setLocation({ lat: newLat, lng: newLng })
        const newPinInfo = {
          id: `${currentUser?.id}-${placeId}`,
          userId: currentUser?.id,
          location: {
            lat: newLat!,
            lng: newLng!,
            name: placeName!,
            placeId: placeId!,
          },
        }
        setNewPin(newPinInfo)
      }
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref)

  const addPin = async () => {
    if (!newPin) return
    await setDoc(doc(db, "pins", newPin?.id), newPin)
    setMarkers((prev) => {
      return [
        ...prev,
        {
          placeId: newPin.location.placeId,
          lat: newPin.location.lat,
          lng: newPin.location.lng,
        },
      ]
    })
    setHasAddPin(true)
    setHasPosted(false)
    setHasUpload(false)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const folderName = `${currentUser?.id.slice(
    0,
    4
  )}-${newPin.location.placeId.slice(0, 4)}`
  const handleUpload = () => {
    photos.map((photo) => {
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
          setUrls((prev) => [...prev, url])
        }
      )
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
      album: urls,
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
    if (urls.length !== 0) {
      console.log("開始刪除檔案")
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

  return (
    <>
      <Wrapper>
        <Title>我是user的地圖頁</Title>
        <BtnLink to="/">回首頁</BtnLink>
        <BtnLink to="/mika/my-memories">點我去user的memories列表</BtnLink>
        <BtnLink to="/mika/my-friends">點我去user的friends列表</BtnLink>
      </Wrapper>
      {isLoaded ? (
        <GoogleMap
          id="my-map"
          mapTypeId="94ce067fe76ff36f"
          mapContainerStyle={containerStyle}
          center={center}
          zoom={2}
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
                    return <UploadImgIcon key={url.slice(0, -8)} src={url} />
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
          <Marker onLoad={onMkLoad} position={center} icon={homeIcon} />
          {markers?.map((marker) => {
            return (
              <Marker
                key={marker.placeId}
                onLoad={onMkLoad}
                position={new google.maps.LatLng(marker.lat!, marker.lng)}
              />
            )
          })}
        </GoogleMap>
      ) : (
        ""
      )}
    </>
  )
}

export default User

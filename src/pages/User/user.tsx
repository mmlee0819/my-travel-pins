import React from "react"
import { useState, useContext } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import {
  useJsApiLoader,
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api"
import { darkMap } from "../User/darkMap"
import { AuthContext } from "../Context/authContext"
import homeIcon from "./homeIcon.png"
import uploadIcon from "./uploadImgIcon.png"
import { containerStyle, myGoogleApiKey } from "../Utils/gmap"
import { db } from "../Utils/firebase"
import { doc, setDoc } from "firebase/firestore"

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 80%;
  margin: 0 auto;
`
const Title = styled.div`
  color: #000000;
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
  width: 300px;
  height: 30px;
  font-size: 15px;
  color: #ffffff;
  background-color: #000000;
  border: 1px solid #000000;
  opacity: 0.8;
  z-index: 100;
`

const BtnAddPin = styled.div`
  display: flex;
  justify-content: center;
  align-self: end;
  align-items: center;
  padding: 10px;
  height: 30px;
  color: #ffffff;
  background-color: #000000;
  opacity: 0.8;
  border-radius: 10px;
  cursor: pointer;
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
const ArticleWrapper = styled(UploadPhotoWrapper)``

const UploadImgLabel = styled.label`
  display: flex;
  align-items: center;
  height: 64px;
  cursor: pointer;
`
const UploadImgIcon = styled.img`
  width: 30px;
  height: 30px;
  z-index: 300;
`
const UploadImgInput = styled.input`
  display: none;
`
interface Position {
  placeId?: string | undefined
  lat: number | undefined
  lng: number | undefined
}

function User() {
  const { currentUser } = useContext(AuthContext)
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
  const [photos, setPhotos] = useState<string[]>([])

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: myGoogleApiKey!,
    libraries: ["places"],
  })

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
        console.log(searchResult[0])
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
  }
  // const addMemory = async () => {}
  return (
    <>
      <Wrapper>
        <Title>我是user的地圖頁</Title>
        <BtnLink to="/">回首頁</BtnLink>
        <BtnLink to="/mika/my-memories">點我去user的memories列表</BtnLink>
        <BtnLink to="/mika/my-friends">點我去user的friends列表</BtnLink>
      </Wrapper>
      {/* <LoadScript
          googleMapsApiKey={process.env.REACT_APP_google_API_KEY!}
          libraries={["places"]}
      > */}
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
          {hasAddPin ? (
            <PostArea>
              <ArticleWrapper>
                <ArticleTitleInput placeholder="Title"></ArticleTitleInput>
                <ArticleTitleInput placeholder="When did you go there?"></ArticleTitleInput>
                <textarea placeholder="What's on your mind?" rows={6} />
              </ArticleWrapper>
              <UploadPhotoWrapper>
                <UploadImgLabel>
                  <UploadImgIcon src={uploadIcon} />
                  {photos
                    ? photos.map((photo) => {
                        return `\n${photo}`
                      })
                    : "Choose photos"}
                  <UploadImgInput
                    type="file"
                    accept="image/*"
                    multiple={true}
                    onChange={(e) => {
                      if (e.target.files !== null) {
                        for (const file of e.target.files) {
                          setPhotos((prev: string[]) => {
                            return [...prev, file.name]
                          })
                        }
                      }
                    }}
                  />
                </UploadImgLabel>
                <BtnAddPin>Upload</BtnAddPin>
              </UploadPhotoWrapper>
            </PostArea>
          ) : (
            ""
          )}
          <Marker onLoad={onMkLoad} position={center} icon={homeIcon} />
          {/* {markers?.map((marker) => {
            return (
              <Marker
                key={marker.placeId}
                onLoad={onMkLoad}
                position={new google.maps.LatLng(marker.lat!, marker.lng)}
              />
            )
          })} */}
        </GoogleMap>
      ) : (
        ""
      )}
      {/* </LoadScript> */}
    </>
  )
}

export default User

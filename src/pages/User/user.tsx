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
  background-color: #ffffff;
  padding: 10px;
  height: 60%;
  opacity: 0.6;
  gap: 20px;
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
  }
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
            <StandaloneSearchBox
              onLoad={onLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <Input placeholder="City, Address..."></Input>
            </StandaloneSearchBox>
            <BtnAddPin onClick={addPin}>Confirm to add pin</BtnAddPin>
          </SearchWrapper>
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
      {/* </LoadScript> */}
    </>
  )
}

export default User

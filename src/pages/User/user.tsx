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

const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
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
  width: 100px;
  height: 30px;
  justify-content: center;
  align-self: self-end;
  align-items: center;
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
  const [newpin, setNewPin] = useState<google.maps.LatLng | Position>()
  // const [marker, setMarker] = useState<google.maps.Marker>()
  const [markers, setMarkers] = useState<Position[]>([
    {
      placeId: "00000000mmlee",
      lat: 25.061945,
      lng: 121.5484174,
    },
  ])
  const [searchBox, setSearchBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  console.log("newpin", newpin)
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
        setNewPin({ lat: newLat, lng: newLng })
        setMarkers((prev) => {
          return [
            ...prev,
            { placeId: searchResult[0].place_id, lat: newLat, lng: newLng },
          ]
        })
      }
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref)

  return (
    <>
      <Wrapper>
        <Title>我是user的地圖頁</Title>
        <BtnLink to="/">點我回首頁</BtnLink>
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
            <StandaloneSearchBox
              onLoad={onLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <Input placeholder="City, Address..."></Input>
            </StandaloneSearchBox>
            <BtnAddPin>Add pin</BtnAddPin>
          </SearchWrapper>
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

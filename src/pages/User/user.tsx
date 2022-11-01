import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { darkMap } from "../User/darkMap"

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

const center = {
  lat: 25.061945,
  lng: 121.5484174,
}

function User() {
  const containerStyle = {
    minHeight: "100vh",
    width: "100vw",
  }

  const onLoad = (marker: google.maps.Marker) => {
    console.log(" marker", marker)
  }

  return (
    <>
      <Wrapper>
        <Title>我是user的地圖頁</Title>
        <BtnLink to="/">點我回首頁</BtnLink>
        <BtnLink to="/mika/my-memories">點我去user的memories列表</BtnLink>
        <BtnLink to="/mika/my-friends">點我去user的friends列表</BtnLink>
      </Wrapper>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_google_API_KEY!}
        libraries={["places"]}
      >
        <GoogleMap
          id="my-map"
          mapTypeId="94ce067fe76ff36f"
          mapContainerStyle={containerStyle}
          center={center}
          zoom={2}
          options={{ draggable: true, styles: darkMap }}
        >
          <Marker onLoad={onLoad} position={center} />
        </GoogleMap>
      </LoadScript>
    </>
  )
}

export default User

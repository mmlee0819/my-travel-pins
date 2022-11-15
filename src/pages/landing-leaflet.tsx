import React, { useState, useEffect, useRef, useContext } from "react"
import styled from "styled-components"
import { AuthContext } from "./Context/authContext"
import L from "leaflet"
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  GeoJSON,
  ZoomControl,
} from "react-leaflet"
import { Feature, GeoJsonObject } from "geojson"

import "leaflet/dist/leaflet.css"
import worldGeoData from "./Utils/custom.geo.json"
import homeMarker from "./assets/markers/hometownIcon.png"

const Container = styled.div`
  max-width: 1440px;
  width: 100%;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 20px;
`
const TitleWrapper = styled.div`
  position: absolute;
  top: 70px;
  right: 80px;
  text-align: right;
  font-family: "Jaldi";
  color: #fff;
`
const Title = styled.div`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 40px;
`
const SubTitle = styled.div`
  padding-right: 3px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0px;
`

const Slogan = styled.div`
  display: flex;
  justify-content: center;
  font-family: "Just Me Again Down Here";
  font-size: 1rem;
`
const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  margin: 0;
`

const FormWrapper = styled.form`
  position: absolute;
  top: 0px;
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  margin: 0 auto;
  padding: 30px;
  gap: 20px;
  background-color: #ffffff;
  opacity: 0.9;
`
const Input = styled.input`
  height: 40px;
`
const BtnWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin-bottom: 50px;
  background-color: #ffffff;
  opacity: 0.6;
  gap: 20px;
`
const Btn = styled.div`
  display: inline-block;
  color: #000000;
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 10px;
  cursor: pointer;
`

const DefaultIcon = L.icon({
  iconUrl: homeMarker,
  iconSize: [40, 30],
})

L.Marker.prototype.options.icon = DefaultIcon
// interface CountriesFeature extends GeoJsonObject {
//   type: "Feature"
//   geometry: {
//     type: string
//     coordinates: []
//   }
//   properties: {
//     continent: "North America"
//     name: "Costa Rica"
//     ne_id: 1159320525
//     postal: "CR"
//     region_un: "Americas"
//     region_wb: "Latin America & Caribbean"
//     sovereignt: "Costa Rica"
//     subregion: "Central America"
//     subunit: "Costa Rica"
//     type: "Sovereign country"
//     woe_id: 23424791
//   }
// }

function Home() {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)

  console.log("worldGeoData", worldGeoData)
  // const [hometownBox, setHometownBox] = useState<
  //   google.maps.places.SearchBox | StandaloneSearchBox
  // >()
  // const [result, setResult] = useState<google.maps.places.PlaceResult[]>()
  // const onPlacesChanged = () => {
  //   if (hometownBox instanceof google.maps.places.SearchBox) {
  //     console.log(hometownBox.getPlaces())
  //     const searchResult = hometownBox.getPlaces()
  //     setResult(searchResult)
  //   } else console.log("失敗啦")
  // }
  // const onLoad = (ref: google.maps.places.SearchBox) => setHometownBox(ref)

  // const { isLoaded, currentUser, isLogin, signUp, signIn } =
  //   useContext(AuthContext)
  const { currentUser, isLogin, signUp, signIn } = useContext(AuthContext)

  const myCustomStyle = {
    stroke: false,
    // color: "#2d2d2d",
    // weight: 1,
    fill: true,
    fillColor: "#fff",
    fillOpacity: 1,
  }

  return (
    <Container>
      <TitleWrapper>
        <Title>My Travel Pins</Title>
        <SubTitle>your treasure keeper and query helper</SubTitle>
      </TitleWrapper>
      <MapContainer
        id="homeMap"
        center={[51.5, -0.09]}
        zoomControl={false}
        zoom={0}
        scrollWheelZoom={false}
        dragging={false}
        style={{
          margin: "0 auto",
          width: "100%",
          height: "100%",
          zIndex: "50",
          backgroundColor: "rgb(255, 255, 255, 0)",
          borderRadius: "10px",
        }}
      >
        {worldGeoData.features.map((country) => {
          return (
            <GeoJSON
              key={country.properties.name}
              data={country}
              style={myCustomStyle}
            />
          )
        })}

        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <Marker position={[42, 121]}>
          <Popup offset={[0, -10]} keepInView={true}>
            My Hometown <br />
            Taiwan
          </Popup>
        </Marker>
      </MapContainer>
      {/* <Wrapper>
        {isLogin && currentUser !== undefined ? (
          ""
        ) : (
          <>
            <FormWrapper>
              <Input ref={nameRef} name="userName" placeholder="name" />
              <Input
                ref={emailRef}
                name="accountEmail"
                placeholder="xxx@xxxxx"
              />
              <Input
                ref={pwRef}
                name="password"
                placeholder="at least 6 letters"
              />

              <Input placeholder="Your hometown"></Input>

              <BtnWrapper>
                <Btn
                // onClick={() => {
                //   if (
                //     result &&
                //     nameRef?.current !== null &&
                //     emailRef?.current !== null &&
                //     pwRef?.current !== null
                //   ) {
                //     signUp(
                //       nameRef?.current?.value,
                //       emailRef?.current?.value,
                //       pwRef?.current?.value,
                //      result
                //     )
                //   }
                // }}
                >
                  Sign up
                </Btn>
                <Btn
                // onClick={() => {
                //   signIn(emailRef.current.value, pwRef.current.value)
                // }}
                >
                  Sign in
                </Btn>
              </BtnWrapper>
            </FormWrapper>
          </>
        )}
      </Wrapper>*/}
      <Slogan>
        Save your favorite memories and share with your loved ones.
      </Slogan>
    </Container>
  )
}

export default Home

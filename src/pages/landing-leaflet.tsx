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
const Title = styled.div`
  color: #000000;
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
    fill: true,
    fillColor: "#fff",
    fillOpacity: 1,
  }

  return (
    <Container>
      <MapContainer
        id="homeMap"
        center={[51.5, -0.09]}
        zoomControl={false}
        zoom={0}
        scrollWheelZoom={false}
        dragging={false}
        style={{
          top: "30px",
          margin: "0 auto",
          width: "100%",
          height: "calc(100% - 30px)",
          zIndex: "50",
          backgroundColor: "#5594b7",
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
        <Marker position={[33, 121]}>
          <Popup offset={[0, -20]} keepInView={true}>
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
    </Container>
  )
}

export default Home

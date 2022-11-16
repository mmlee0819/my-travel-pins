import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  Dispatch,
  SetStateAction,
  MouseEvent,
} from "react"
import styled from "styled-components"
import { AuthContext } from "./Context/authContext"
import L, { LatLng } from "leaflet"
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  GeoJSON,
  ZoomControl,
  useMapEvents,
} from "react-leaflet"

import "leaflet/dist/leaflet.css"
import { countries } from "./Utils/custom.geo"
import homeMarker from "./assets/markers/hometownIcon.png"
import PhotoWall from "./Components/photoWall"

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

// const PhotoWrapper = styled.div`
//   position: absolute;
//   display: flex;
//   top: 140px;
//   right: 280px;
//   width: 50px;
//   height: 40px;
//   padding: 5px;
//   background-color: #0a3354d6;
//   border-radius: 5px;
//   z-index: 170;
// `

// const MongoDesert = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
// `
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

interface Props {
  position: LatLng | null
  setPosition: Dispatch<SetStateAction<LatLng | null>>
}
interface CountryType {
  type: "Feature"
  properties: {
    featurecla: string
    scalerank: number
    labelrank: number
    sovereignt: string
    sov_a3: string
    adm0_dif: number
    level: number
    type: string
    name: string
  }
}
const myCustomStyle = {
  stroke: false,
  fill: true,
  fillColor: "#fff",
  fillOpacity: 1,
  zIndex: 50,
}

const onEachFeature = (country: any, layer: any) => {
  layer.on("mouseover", function (e: any) {
    console.log(e.target.feature.properties.name)
    if (e.target.feature.properties.name === country.properties.name) {
      layer.setStyle({
        stroke: false,
        fill: true,
        fillColor: "#ffd500",
        fillOpacity: 1,
      })
    }
  })
  layer.on("mouseout", function (e: any) {
    console.log(e)
    layer.setStyle({
      stroke: false,
      fill: true,
      fillColor: "#fff",
      fillOpacity: 1,
    })
  })
}
const TargetArea = (props: Props) => {
  const { position, setPosition } = props

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })

  return <Title />
}

function Home() {
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)

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
  const [position, setPosition] = useState<LatLng | null>(null)
  console.log("position", position)

  return (
    <Container>
      <TitleWrapper>
        <Title>My Travel Pins</Title>
        <SubTitle>your treasure keeper and query helper</SubTitle>
      </TitleWrapper>
      <MapContainer
        id="homeMap"
        center={[60, 90]}
        zoomControl={true}
        zoom={0}
        scrollWheelZoom={true}
        dragging={true}
        style={{
          margin: "0 auto",
          width: "100%",
          height: "100%",
          zIndex: "30",
          backgroundColor: "rgb(255, 255, 255, 0)",
          borderRadius: "10px",
        }}
      >
        {countries.features.map((country) => {
          return (
            <GeoJSON
              key={country.properties.name}
              data={country}
              style={myCustomStyle}
              onEachFeature={onEachFeature}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          )
        })}

        <TargetArea position={position} setPosition={setPosition} />
        {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
        <PhotoWall />
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

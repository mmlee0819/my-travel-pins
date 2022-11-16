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
  Polyline,
  useMapEvents,
} from "react-leaflet"

import "leaflet/dist/leaflet.css"
import { countries } from "./Utils/custom.geo"
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
}

const polylineColor = { color: "#2d2d2d", weight: 0.2 }

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

  console.log("countries", countries)
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
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [40, 135],
            [60.94190876534587, 207.94735583582917],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [32, 129.19727864639543],
            [44.119522447002225, 238.84090939374232],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [67.08194834149987, 121],
            [82.67959375707717, 202.29303247795994],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [67.08194834149987, 75.78115084640598],
            [80.98178034291453, 75.78115084640598],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [50, 10],
            [90, -60],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [50, -90],
            [83, -150],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [85.83307589186336, -223.59693915403705],
            [83.36240172078469, -257.3462606722642],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [45, -110],
            [60, -210],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [-10, -70],
            [-16.58274254777613, -126.567639789134],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [-10, -70],
            [-16.58274254777613, -126.567639789134],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [20, 10],
            [-62.2369168861301, -35.1632273439355],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [0, 25],
            [-41.98777931411351, 44.991411261853955],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [-25, 135],
            [-62.8847858855777, 172.95758868513195],
          ]}
        />
        <Polyline
          pathOptions={polylineColor}
          positions={[
            [-40, 175],
            [-21.890407818937252, 227.80023615225105],
          ]}
        />
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

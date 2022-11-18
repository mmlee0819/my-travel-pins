import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  useContext,
} from "react"
import styled from "styled-components"
import L, { LatLng, LeafletEvent } from "leaflet"
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
import { StandaloneSearchBox } from "@react-google-maps/api"
import "leaflet/dist/leaflet.css"
import { countries } from "./Utils/custom.geo"
import homeMarker from "./assets/markers/hometownIcon.png"
import PhotoWall from "./Components/photoWall"
import { AuthContext } from "./Context/authContext"

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 20px;
`
const TitleWrapper = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  text-align: right;
  font-family: "Jaldi";
  color: #fff;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    top: 10px;
    right: 20px;
  }
`
const Title = styled.div`
  font-size: 76px;
  font-weight: 700;
  letter-spacing: 2px;
  line-height: 40px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 2rem;
  }
`
const SubTitle = styled.div`
  padding-right: 3px;
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 1rem;
  }
`

const Slogan = styled.div`
  display: flex;
  justify-content: center;
  font-family: "Just Me Again Down Here";
  font-size: 28px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 1rem;
  }
`
const TabWrapper = styled.div`
  position: absolute;
  left: 90px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  font-family: "Jomhuria";
  font-size: 48px;
  opacity: 1;
  gap: 20px;
  z-index: 150;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 28px;
  }
`
const Tab = styled.div<{ isSignUp: boolean; isSignIn: boolean }>`
  display: inline-block;
  border: 1px solid #fff;
  border-top: none;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px 2px 10px;
  }
`
const SignUpTab = styled(Tab)`
  color: ${(props) => (props.isSignUp ? "#034961" : "#fff")};
  background-color: ${(props) => (props.isSignUp ? "#fff" : "none")};
  padding: ${(props) => (props.isSignUp ? "2px 15px" : "2px 10px")};
  &:hover {
    color: ${(props) => !props.isSignUp && "#5594b7"};
    background-color: #fff;
  }
`

const SignInTab = styled(Tab)`
  color: ${(props) => (props.isSignIn ? "#034961" : "#fff")};
  background-color: ${(props) => (props.isSignIn ? "#fff" : "none")};
  padding: ${(props) => (props.isSignIn ? "2px 15px" : "2px 10px")};
  &:hover {
    color: ${(props) => !props.isSignIn && "#5594b7"};
    background-color: #fff;
  }
`
const Wrapper = styled.div`
  position: absolute;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  width: 60%;
  height: 100%;
  background-color: rgb(255, 255, 255, 0.6);
  border-radius: 10px;
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
  iconSize: [40, 43],
})

L.Marker.prototype.options.icon = DefaultIcon

interface Props {
  position: LatLng | null
  setPosition: Dispatch<SetStateAction<LatLng | null>>
}

interface AuthProps {
  isSignUp: boolean
  isSignIn: boolean
}

interface CountryType {
  type: "Feature"
  properties: {
    name: string
    scalerank: number
    labelrank: number
    sovereignt: string
    level: number
    type: string
  }
}
const myCustomStyle = {
  stroke: false,
  fill: true,
  fillColor: "#fff",
  fillOpacity: 1,
  zIndex: 50,
}

const onEachFeature = (country: CountryType, layer: L.GeoJSON) => {
  layer.on("mouseover", (event: LeafletEvent) => {
    if (event.target.feature.properties.name === country.properties.name) {
      layer.setStyle({
        stroke: false,
        fill: true,
        fillColor: "#ffd500",
        fillOpacity: 1,
      })
    }
  })
  layer.on("mouseout", () => {
    layer.setStyle({
      stroke: false,
      fill: true,
      fillColor: "#fff",
      fillOpacity: 1,
    })
  })
}

function TargetArea(props: Props) {
  const { position, setPosition } = props

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })

  return <div />
}
function AuthArea(props: AuthProps) {
  const { isLoaded, currentUser, isLogin, signUp, signIn } =
    useContext(AuthContext)
  const { isSignUp, isSignIn } = props
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)
  const [hometownBox, setHometownBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  const [result, setResult] = useState<google.maps.places.PlaceResult[]>()
  const onPlacesChanged = () => {
    if (hometownBox instanceof google.maps.places.SearchBox) {
      console.log(hometownBox.getPlaces())
      const searchResult = hometownBox.getPlaces()
      setResult(searchResult)
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setHometownBox(ref)
  return (
    <Wrapper>
      {(!isLogin || currentUser === null || currentUser === undefined) &&
        isSignUp && (
          <>
            <Input ref={nameRef} name="userName" placeholder="name" />
            <Input ref={emailRef} name="accountEmail" placeholder="xxx@xxxxx" />
            <Input
              ref={pwRef}
              name="password"
              placeholder="at least 6 letters"
            />

            <Input placeholder="Your hometown"></Input>
            <Btn
              onClick={() => {
                if (
                  result &&
                  nameRef?.current !== null &&
                  emailRef?.current !== null &&
                  pwRef?.current !== null
                ) {
                  signUp(
                    nameRef?.current?.value,
                    emailRef?.current?.value,
                    pwRef?.current?.value,
                    result
                  )
                }
              }}
            >
              Sign up
            </Btn>
          </>
        )}
      {(!isLogin || currentUser === null || currentUser === undefined) &&
        isSignIn && (
          <>
            <Input ref={emailRef} name="accountEmail" placeholder="xxx@xxxxx" />
            <Input
              ref={pwRef}
              name="password"
              placeholder="at least 6 letters"
            />
            <Btn
              onClick={() => {
                if (emailRef?.current !== null && pwRef?.current !== null) {
                  signIn(emailRef?.current?.value, pwRef?.current?.value)
                }
              }}
            >
              Sign in
            </Btn>
          </>
        )}
    </Wrapper>
  )
}
function Home() {
  const { isLoaded, currentUser, isLogin, signUp, signIn } =
    useContext(AuthContext)

  const [position, setPosition] = useState<LatLng | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isSignIn, setIsSignIn] = useState(false)
  console.log({ position })

  // const [mapZoom, setMapZoom] = useState(0)
  // console.log("mapZoom", mapZoom)
  // const onZoomChange = () => {
  //   if (
  //     (window.innerWidth > window.innerHeight && window.innerWidth < 900) ||
  //     (window.innerWidth > window.innerHeight && window.innerHeight < 600)
  //   ) {
  //     setMapZoom(0)
  //   } else if (window.innerWidth > 900 && window.innerHeight > 600) {
  //     setMapZoom(1)
  //   }
  // }
  // useEffect(() => {
  //   const handleResize = () => {
  //     console.log("resize的window.innerWidth", window.innerWidth)
  //     console.log("resize的window.innerHeight", window.innerHeight)
  //     if (
  //       (window.innerWidth > window.innerHeight && window.innerWidth < 900) ||
  //       (window.innerWidth > window.innerHeight && window.innerHeight < 600)
  //     ) {
  //       console.log("條件1的window.innerWidth", window.innerWidth)
  //       console.log("條件1的window.innerHeight", window.innerHeight)
  //       setMapZoom(0)
  //     } else if (
  //       window.innerWidth > window.innerHeight &&
  //       window.innerWidth > 900 &&
  //       window.innerHeight > 600
  //     ) {
  //       console.log("條件2的window.innerWidth", window.innerWidth)
  //       console.log("條件2的window.innerHeight", window.innerHeight)
  //       setMapZoom(1)
  //     }
  //   }
  //   console.log("初始window.innerWidth", window.innerWidth)
  //   console.log("初始window.innerHeight", window.innerHeight)
  //   onZoomChange()
  //   window.addEventListener("resize", handleResize)
  //   return () => {
  //     window.removeEventListener("resize", handleResize)
  //   }
  // }, [mapZoom])
  return (
    <Container>
      <TitleWrapper>
        <Title>My Travel Pins</Title>
        <SubTitle>your treasure keeper and query helper</SubTitle>
      </TitleWrapper>
      {(!isLogin || currentUser === null) && (
        <>
          <TabWrapper>
            <SignUpTab
              isSignUp={isSignUp}
              isSignIn={isSignIn}
              onClick={() => {
                setIsSignIn(false)
                setIsSignUp(true)
              }}
            >
              Sign up
            </SignUpTab>
            <SignInTab
              isSignUp={isSignUp}
              isSignIn={isSignIn}
              onClick={() => {
                setIsSignUp(false)
                setIsSignIn(true)
              }}
            >
              Sign In
            </SignInTab>
          </TabWrapper>
          <MapContainer
            id="homeMap"
            center={[39.9437334482122, 58.35942441225613]}
            zoomControl={false}
            zoom={window.innerWidth > 900 && window.innerHeight > 600 ? 1 : 0}
            scrollWheelZoom={false}
            zoomSnap={0.5}
            dragging={false}
            trackResize
            style={{
              margin: "0 auto",
              width: "100%",
              height: "100%",
              zIndex: "30",
              backgroundColor: "rgb(255, 255, 255, 0)",
              borderRadius: "10px",
            }}
          >
            {countries.features.map((country) => (
              <GeoJSON
                key={country.properties.name}
                data={country}
                style={myCustomStyle}
                onEachFeature={onEachFeature}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
            ))}

            <TargetArea position={position} setPosition={setPosition} />
            {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
            <PhotoWall />
            <Marker position={[42, 121]}>
              <Popup offset={[0, -10]} keepInView>
                My Hometown <br />
                Taiwan
              </Popup>
            </Marker>
          </MapContainer>{" "}
        </>
      )}
      {(isSignUp || isSignIn) && (
        <AuthArea isSignUp={isSignUp} isSignIn={isSignIn} />
      )}
      <Slogan>
        Save your favorite memories and share with your loved ones.
      </Slogan>
    </Container>
  )
}

export default Home

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

const Attribution = styled.a`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  margin: 0;
  font-family: "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: #5594b7;
  background: rgb(255, 255, 255, 0.6);
  border: none;
  text-decoration: none;
  &:visited,
  &:hover,
  &:active {
    text-decoration: underline;
  }
`
const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 20px;
`
// const TitleWrapper = styled.div`
//   position: absolute;
//   top: 30px;
//   right: 50px;
//   width: 100%;
//   margin: 0 auto;
//   max-width: 1440px;
//   text-align: right;
//   font-family: "Jaldi";
//   color: #fff;
//   @media screen and (max-width: 900px) and (min-width: 600px),
//     (max-height: 600px) {
//     top: 18px;
//     right: 70px;
//   }
// `
const Title = styled.div`
  position: absolute;
  top: 10px;
  right: 80px;
  margin: 0 auto;
  max-width: 1440px;
  text-align: right;
  font-family: "Jomhuria";
  color: #fff;
  font-size: 90px;
  font-weight: 400;
  letter-spacing: 4px;
  line-height: 76px;
  z-index: 20;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    top: 0px;
    font-size: 76px;
  }
`

const Slogan = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  font-family: "Just Me Again Down Here";
  font-size: 28px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 1rem;
  }
`
const TabWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  margin: 0 auto;
  padding-left: 20px;
  max-width: 1440px;
  width: 100%;
  font-family: "Jomhuria";
  font-size: 40px;
  opacity: 1;
  gap: 20px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 28px;
  }
`
const Tab = styled.div<{ isSignUp: boolean; isSignIn: boolean }>`
  display: flex;
  padding: 0 15px;
  border: 1px solid #fff;
  border: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
    line-height: 28px;
    font-size: 28px;
  }
`
const SignUpTab = styled(Tab)`
  color: ${(props) => (props.isSignUp ? "#034961" : "#fff")};
  background-color: ${(props) => (props.isSignUp ? "#fff" : "none")};
  &:hover {
    color: ${(props) => !props.isSignUp && "#5594b7"};
    background-color: #fff;
  }
`

const SignInTab = styled(Tab)`
  color: ${(props) => (props.isSignIn ? "#034961" : "#fff")};
  background-color: ${(props) => (props.isSignIn ? "#fff" : "none")};
  &:hover {
    color: ${(props) => !props.isSignIn && "#5594b7"};
    background-color: #fff;
  }
`
const Wrapper = styled.div`
  position: absolute;
  top: 30px;
  left: 20px;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  width: 50%;
  padding: 20px 10px;
  font-family: "Poppins";
  font-size: 20px;
  background-color: rgb(255, 255, 255, 0.6);
  border-radius: 10px;
  box-shadow: 0 8px 6px #0000004c;
  gap: 15px;
  z-index: 100;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    top: 20px;
    font-size: 18px;
  }
`

const Input = styled.input`
  padding-left: 10px;
  margin: 0 auto;
  width: 90%;
  height: 28px;
  line-height: 28px;
  border: none;
`

const Btn = styled.div`
  display: flex;
  margin-top: 10px auto 30px auto;
  justify-content: center;
  align-self: center;
  width: 50%;
  height: 28px;
  line-height: 28px;
  font-size: 20px;
  color: #fff;
  background-color: #034961;
  border-radius: 5px;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
  }
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

  return null
}
function AuthArea(props: AuthProps) {
  const { currentUser, isLogin, signUp, signIn } = useContext(AuthContext)
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
            <Input ref={nameRef} name="userName" placeholder="Name" />
            <Input
              ref={emailRef}
              name="accountEmail"
              placeholder="Email: name@xxxx.com"
            />
            <Input
              ref={pwRef}
              name="password"
              placeholder="Password: at least 6 letters"
            />
            <StandaloneSearchBox
              onLoad={onLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <Input
                placeholder="City: your hometown"
                style={{
                  display: "flex",
                  flex: "1 1 auto",
                  width: "90%",
                  margin: "0px auto",
                }}
              />
            </StandaloneSearchBox>
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
              Create an account
            </Btn>
          </>
        )}
      {(!isLogin || currentUser === null || currentUser === undefined) &&
        isSignIn && (
          <>
            <Input
              ref={emailRef}
              name="accountEmail"
              placeholder="Account: name@xxxx.com"
            />
            <Input
              ref={pwRef}
              name="password"
              placeholder="Password: at least 6 letters"
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

function ChangeCenter({ mapZoom }: { mapZoom: number }) {
  const miniMap = useMap()
  if (mapZoom === 0.5) {
    miniMap.flyTo([56.57447264034455, -350.03737924171946], 0)
  } else {
    miniMap.flyTo([30.51620596509747, -210.12413187632802], 1)
  }
  return null
}
function Home() {
  const { isLoaded, currentUser, isLogin, signUp, signIn } =
    useContext(AuthContext)

  const [position, setPosition] = useState<LatLng | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isSignIn, setIsSignIn] = useState(false)
  console.log({ position })
  const [mapZoom, setMapZoom] = useState<number>(0)
  console.log("mapZoom", mapZoom)
  const onZoomChange = () => {
    if (
      (window.innerWidth > window.innerHeight && window.innerWidth < 900) ||
      (window.innerWidth > window.innerHeight && window.innerHeight < 600)
    ) {
      setMapZoom(0.5)
    } else if (window.innerWidth > 900 && window.innerHeight > 600) {
      setMapZoom(1.25)
    }
  }
  useEffect(() => {
    const handleResize = () => {
      // console.log("resize的window.innerWidth", window.innerWidth)
      // console.log("resize的window.innerHeight", window.innerHeight)
      if (
        (window.innerWidth > window.innerHeight && window.innerWidth < 900) ||
        (window.innerWidth > window.innerHeight && window.innerHeight < 600)
      ) {
        // console.log("條件1的window.innerWidth", window.innerWidth)
        // console.log("條件1的window.innerHeight", window.innerHeight)
        setMapZoom(0)
      } else if (
        window.innerWidth > window.innerHeight &&
        window.innerWidth > 900 &&
        window.innerHeight > 600
      ) {
        // console.log("條件2的window.innerWidth", window.innerWidth)
        // console.log("條件2的window.innerHeight", window.innerHeight)
        setMapZoom(1)
      }
    }
    // console.log("初始window.innerWidth", window.innerWidth)
    // console.log("初始window.innerHeight", window.innerHeight)
    onZoomChange()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [mapZoom])
  return (
    <>
      <Title>My Travel Pins</Title>
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
      <Container>
        {(!isLogin || currentUser === null) && (
          <>
            {/* {!isSignUp && !isSignIn && ( */}
            <MapContainer
              id="homeMap"
              center={[39.9437334482122, 65.35942441225613]}
              zoomControl={false}
              zoom={
                window.innerWidth > 900 && window.innerHeight > 600 ? 1.25 : 0.5
              }
              scrollWheelZoom={false}
              zoomSnap={0.25}
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
              {(isSignUp || isSignIn) && <ChangeCenter mapZoom={mapZoom} />}
              <TargetArea position={position} setPosition={setPosition} />
              {/* <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        /> */}
              {!isSignUp && !isSignIn && <PhotoWall />}
              <Marker position={[42, 121]}>
                <Popup offset={[0, -10]} keepInView>
                  My Hometown <br />
                  Taiwan
                </Popup>
              </Marker>
            </MapContainer>
            {/* )} */}
          </>
        )}
        {(isSignUp || isSignIn) && (
          <AuthArea isSignUp={isSignUp} isSignIn={isSignIn} />
        )}
      </Container>
      <Slogan>
        Save your favorite memories and share with your loved ones.
      </Slogan>
      {/* <Attribution href="https://www.openstreetmap.org/copyright">
        &copy; OpenStreetMap
      </Attribution> */}
    </>
  )
}

export default Home

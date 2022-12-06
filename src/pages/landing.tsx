import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  useContext,
} from "react"
import styled from "styled-components"
import L, { LatLng, LeafletEvent, LatLngTuple } from "leaflet"
import { useMap, Marker, Tooltip, GeoJSON, useMapEvents } from "react-leaflet"
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker"
import { StandaloneSearchBox } from "@react-google-maps/api"
import "leaflet/dist/leaflet.css"
import { countries } from "../utils/customGeo"
import { AuthContext } from "../context/authContext"
import PhotoWall from "../components/photoWall"
import { TipsContent, SampleMemory } from "../components/sampleContent"
import {
  Attribution,
  StyleMapContainer,
  Container,
} from "../components/styles/mapStyles"
import { StepTitle, Input, BtnText } from "../components/styles/formStyles"
import finger from "./assets/buttons/blackFinger.png"
import tip from "./assets/tip.png"
import home from "./assets/markers/home1.png"

const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0 auto;
  padding-top: 5px;
  padding-left: 20px;
  max-width: 1440px;
  width: 100%;
  height: 60px;
  font-size: ${(props) => props.theme.title.lg};
  opacity: 1;
  gap: 20px;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const Title = styled.div`
  display: flex;
  width: 50%;
  padding-right: 20px;
  flex: 1 1 auto;
  line-height: 40px;
  align-self: end;
  justify-content: end;
  color: ${(props) => props.theme.color.bgDark};
  font-weight: 700;
  z-index: 20;
`

const Slogan = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  font-family: "Just Me Again Down Here";
  font-size: 28px;
  color: #ffffffe7;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: 1rem;
  }
`
const AuthTitle = styled(StepTitle)`
  margin-top: 15px;
  font-weight: 700;
  font-size: ${(props) => props.theme.title.md};
`
const TabWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-self: end;
  margin: 0 auto;
  padding-left: 20px;
  max-width: 1440px;
  width: 100%;
  height: 30px;
  font-size: ${(props) => props.theme.title.md};
  font-weight: 500;
  opacity: 1;
  gap: 20px;
`
const Tab = styled.div<{ isSignUp: boolean; isSignIn: boolean }>`
  display: flex;
  padding: 0 15px;
  color: ${(props) => props.theme.color.bgDark};
  border: 1px solid #fff;
  border: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  @media screen and (min-width: 600px), (max-height: 600px) {
    padding: 2px 10px;
  }
`
const SignUpTab = styled(Tab)`
  color: ${(props) => props.isSignUp && props.theme.color.bgLight};
  background-color: ${(props) =>
    props.isSignUp ? props.theme.color.lightMain : "none"};
  cursor: ${(props) => (!props.isSignUp ? "pointer" : "default")};
  &:hover {
    color: ${(props) =>
      !props.isSignUp ? props.theme.color.deepMain : props.theme.color.bgLight};
    background-color: ${(props) =>
      !props.isSignUp && props.theme.color.bgLight};
    transition: ${(props) => !props.isSignUp && "background-color 0.5s"};
  }
`

const SignInTab = styled(Tab)`
  color: ${(props) => props.isSignIn && props.theme.color.bgLight};
  background-color: ${(props) =>
    props.isSignIn ? props.theme.color.lightMain : "none"};
  cursor: ${(props) => (!props.isSignIn ? "pointer" : "default")};
  &:hover {
    color: ${(props) =>
      !props.isSignIn ? props.theme.color.deepMain : props.theme.color.bgLight};
    background-color: ${(props) =>
      !props.isSignIn && props.theme.color.bgLight};
    transition: ${(props) => !props.isSignIn && "background-color 0.5s"};
  }
`
const TabText = styled.div`
  width: 100%;
  height: 100%;
`
const TipText = styled.div`
  display: flex;
  padding: 0 15px;
  border: none;
  gap: 5px;
  cursor: pointer;
  &:hover {
    border-bottom: 3px solid #fff;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
  }
`
const TipTab = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  background-image: url(${tip});
  background-size: contain;
  cursor: pointer;
  @media screen and (max-width: 600px), (max-height: 600px) {
    width: 25px;
    height: 25px;
  }
`
const Wrapper = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 50%;
  max-height: 100%;
  padding: 20px 40px;
  font-size: ${(props) => props.theme.title.md};
  background-color: rgb(255, 255, 255, 0.6);
  border-radius: 10px;
  box-shadow: 0px 8px 6px #0000004c;
  z-index: 100;
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`

const DefaultIcon = L.icon({
  iconUrl: home,
  iconSize: [30, 30],
})

L.Marker.prototype.options.icon = DefaultIcon

interface Props {
  position: LatLng | null
  setPosition: Dispatch<SetStateAction<LatLng | null>>
}

interface AuthProps {
  isSignUp: boolean
  isSignIn: boolean
  setIsSignUp: Dispatch<SetStateAction<boolean>>
  setIsSignIn: Dispatch<SetStateAction<boolean>>
  overlayRef: React.RefObject<HTMLDivElement>
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
interface RoutePositionType {
  lat: number
  lng: number
}

const myCustomStyle = {
  stroke: false,
  fill: true,
  fillColor: "#fff",
  fillOpacity: 0.8,
  zIndex: 50,
  cursor: "default",
}

function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  isSignUp: boolean,
  isSignIn: boolean,
  setIsSignUp: Dispatch<React.SetStateAction<boolean>>,
  setIsSignIn: Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        (event?.target as Node)?.parentElement?.className === "pac-item" ||
        (event?.target as Node)?.parentElement?.className === "pac-container"
      ) {
        return
      }
      if (isSignUp && !isSignIn) setIsSignUp(false)

      if (isSignIn && !isSignUp) setIsSignIn(false)
    }
    window.addEventListener("mousedown", listener)
    window.addEventListener("touchstart", listener)
    return () => {
      window.removeEventListener("mousedown", listener)
      window.removeEventListener("touchstart", listener)
    }
  }, [ref])
}

function AuthArea(props: AuthProps) {
  const { currentUser, isLogin, signUp, signIn } = useContext(AuthContext)
  const { overlayRef, isSignUp, isSignIn, setIsSignUp, setIsSignIn } = props
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)
  const [hometownBox, setHometownBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  const [result, setResult] = useState<google.maps.places.PlaceResult[]>()

  const onPlacesChanged = () => {
    if (hometownBox instanceof google.maps.places.SearchBox) {
      const searchResult = hometownBox.getPlaces()
      setResult(searchResult)
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setHometownBox(ref)

  useOnClickOutside(
    overlayRef,
    isSignUp,
    isSignIn,
    () => setIsSignUp(false),
    () => setIsSignIn(false)
  )

  return (
    <Wrapper ref={overlayRef}>
      {(!isLogin || currentUser === null || currentUser === undefined) &&
        isSignUp && (
          <>
            <AuthTitle>Name</AuthTitle>
            <Input ref={nameRef} name="userName" placeholder="Big Traveller" />
            <AuthTitle>Email</AuthTitle>
            <Input
              ref={emailRef}
              name="accountEmail"
              placeholder="name@xxxx.com"
            />
            <AuthTitle>Password</AuthTitle>
            <Input
              type="password"
              ref={pwRef}
              name="password"
              placeholder="over 6 letters"
            />
            <AuthTitle>Where is your hometown?</AuthTitle>
            <StandaloneSearchBox
              onLoad={onLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <Input placeholder="search and select a place" />
            </StandaloneSearchBox>
            <BtnText
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
            </BtnText>
          </>
        )}
      {(!isLogin || currentUser === null || currentUser === undefined) &&
        isSignIn && (
          <>
            <AuthTitle>Email</AuthTitle>
            <Input
              ref={emailRef}
              name="accountEmail"
              placeholder="name@xxxx.com"
            />
            <AuthTitle>Password</AuthTitle>
            <Input
              type="password"
              ref={pwRef}
              name="password"
              placeholder="over 6 letters"
            />
            <BtnText
              onClick={() => {
                if (emailRef?.current !== null && pwRef?.current !== null) {
                  signIn(emailRef?.current?.value, pwRef?.current?.value)
                }
              }}
            >
              Sign in
            </BtnText>
          </>
        )}
    </Wrapper>
  )
}
const onEachFeature = (country: CountryType, layer: L.GeoJSON) => {
  layer.on("mouseover", (event: LeafletEvent) => {
    if (event.target.feature.properties.name === country.properties.name) {
      layer.setStyle({
        stroke: false,
        fill: true,
        fillColor: "#7ccbab",
        fillOpacity: 1,
      })
    }
  })
  layer.on("mouseout", () => {
    layer.setStyle({
      stroke: false,
      fill: true,
      fillColor: "#fff",
      fillOpacity: 0.8,
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

const fingerIcon = L.icon({
  iconSize: [60, 60],
  iconAnchor: [30, 0],
  iconUrl: finger,
})

function FingerMarker({ data }: { data: RoutePositionType }) {
  const { lat, lng } = data
  const { mapZoom } = useContext(AuthContext)
  const [fingerPos, setFingerPos] = useState<LatLngTuple>([lat, lng])
  useEffect(() => {
    if (fingerPos[0] !== lat && fingerPos[1] !== lng) {
      setFingerPos([lat, lng])
    }
  }, [lat, lng, fingerPos])

  return (
    <>
      <LeafletTrackingMarker
        icon={fingerIcon}
        position={[lat, lng]}
        duration={mapZoom === "md" ? 500 : 2500}
      />
    </>
  )
}
function ChangeCenter() {
  const { mapZoom } = useContext(AuthContext)
  const miniMap = useMap()
  if (mapZoom === "md") {
    miniMap.flyTo([46.57447264034455, -180.03737924171946], 0.5)
  } else {
    miniMap.flyTo([30.51620596509747, -130.12413187632802], 1.25)
  }
  return null
}
function ChangeCenterBack() {
  const { mapZoom } = useContext(AuthContext)
  const originMap = useMap()
  if (mapZoom === "md") {
    originMap.flyTo([39.9437334482122, 65.35942441225613], 0.5)
  } else {
    originMap.flyTo([39.9437334482122, 65.35942441225613], 1.25)
  }
  return null
}

let cursor = 0
function Home() {
  const { currentUser, isLogin, mapZoom } = useContext(AuthContext)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<LatLng | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isSignIn, setIsSignIn] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [showSamplePost, setShowSamplePost] = useState(false)
  const [hasRead, setHasRead] = useState(false)

  const [fingerRoute, setFingerRoute] = useState({
    lat: 76.28248506785224,
    lng: 308,
  })
  const [routePositions, setRoutePositions] = useState([
    { lat: 76, lng: 309 },
    { lat: 77, lng: 310 },
  ])

  useEffect(() => {
    if (mapZoom === "lg") {
      setRoutePositions([
        { lat: 66.10851411418622, lng: 300.13876852999573 },
        { lat: 72.70521040764667, lng: 325.564188227921 },
      ])
    } else {
      setRoutePositions([
        { lat: 76, lng: 310 },
        { lat: 77, lng: 311 },
      ])
    }
  }, [mapZoom])

  useEffect(() => {
    if (showSamplePost) return
    setFingerRoute(routePositions[cursor])
    const interval = setInterval(() => {
      if (cursor === routePositions.length - 1) {
        cursor = 0
        setFingerRoute(routePositions[cursor])
        return
      }
      cursor += 1
      setFingerRoute(routePositions[cursor])
    }, 500)
    return () => {
      clearInterval(interval)
    }
  }, [showSamplePost, routePositions])

  return (
    <>
      <HeaderWrapper>
        <TabWrapper>
          <SignUpTab
            isSignUp={isSignUp}
            isSignIn={isSignIn}
            onClick={() => {
              setShowSamplePost(false)
              setIsSignIn(false)
              setIsSignUp(true)
            }}
          >
            <TabText> Sign up</TabText>
          </SignUpTab>
          <SignInTab
            isSignUp={isSignUp}
            isSignIn={isSignIn}
            onClick={() => {
              setShowSamplePost(false)
              setIsSignUp(false)
              setIsSignIn(true)
            }}
          >
            <TabText>Sign In</TabText>
          </SignInTab>
          {/* <TipText
            onClick={() => {
              setShowTips((prev) => !prev)
            }}
          >
            <TipTab />
            Tips
          </TipText> */}
        </TabWrapper>
        <Title>My Travel Pins</Title>
      </HeaderWrapper>
      <Container>
        {showSamplePost && (
          <SampleMemory
            setShowSamplePost={setShowSamplePost}
            setHasRead={setHasRead}
            setIsSignUp={setIsSignUp}
            setIsSignIn={setIsSignIn}
          />
        )}
        <Attribution href="https://leafletjs.com/">source: Leaflet</Attribution>
        {(!isLogin || currentUser === null) && (
          <>
            <StyleMapContainer
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
                />
              ))}
              {!hasRead && !showSamplePost && (
                <FingerMarker data={fingerRoute} />
              )}
              {(isSignUp || isSignIn) && <ChangeCenter />}
              {}
              <TargetArea position={position} setPosition={setPosition} />

              {!isSignUp && !isSignIn && overlayRef.current === null && (
                <>
                  <ChangeCenterBack />
                  <PhotoWall setShowSamplePost={setShowSamplePost} />
                </>
              )}
              {isSignUp && (
                <Marker position={[30, 121]}>
                  <Tooltip
                    direction="bottom"
                    offset={[0, 20]}
                    opacity={1}
                    permanent
                  >
                    Your Hometown
                  </Tooltip>
                </Marker>
              )}
              <Marker position={[30, 121]}>
                <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                  Hometown
                </Tooltip>
              </Marker>
            </StyleMapContainer>
          </>
        )}
        {(isSignUp || isSignIn) && (
          <AuthArea
            isSignUp={isSignUp}
            isSignIn={isSignIn}
            setIsSignUp={setIsSignUp}
            setIsSignIn={setIsSignIn}
            overlayRef={overlayRef}
          />
        )}
      </Container>
      <Slogan>
        Save your favorite memories and share with your loved ones.
      </Slogan>

      {showTips && <TipsContent setShowTips={setShowTips} />}
    </>
  )
}

export default Home

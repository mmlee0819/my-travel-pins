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
import { MapContext } from "../context/mapContext"
import PhotoWall from "../components/photoWall"
import TipsContent from "../components/sampleContent"
import { notifyWarn } from "../components/reminder"
import {
  Attribution,
  StyleMapContainer,
  Container,
} from "../components/styles/mapStyles"
import {
  StepTitle,
  Input,
  BtnText,
  Spinner,
} from "../components/styles/formStyles"
import finger from "../assets/buttons/blackFinger.png"
import home from "../assets/markers/home1.png"
import menu from "../assets/buttons/menu.png"
import whiteMenu from "../assets/buttons/whiteMenu.png"

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
  min-width: 200px;
  height: 30px;
  font-size: ${(props) => props.theme.title.md};
  font-weight: 500;
  opacity: 1;
  gap: 20px;
  @media screen and (max-width: 540px) {
    display: none;
  }
`
const MiniTabWrapper = styled.div<{ showMiniTab: boolean }>`
  display: none;
  @media screen and (max-width: 540px) {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    width: fit-content;

    justify-content: center;
    align-self: end;
    overflow: hidden;
    margin: 0 auto 0 10px;
    min-width: 200px;
    max-height: 0px;
    padding-top: 3px;
    font-size: ${(props) => props.theme.title.md};
    font-weight: 500;
    border-radius: 5px;
    opacity: 1;
    gap: 20px;
    z-index: 110;
    transition: max-height 0.5s ease-in-out;
    ${(props) =>
      props.showMiniTab &&
      `
    max-height: 100px; 
    padding-top: 0px;`}
  }
`
const TabMenu = styled.div<{ showMiniTab: boolean }>`
  display: none;
  @media screen and (max-width: 540px) {
    display: flex;
    align-self: end;
    margin-bottom: 10px;
    width: 20px;
    height: 20px;
    background-image: ${(props) =>
      props.showMiniTab ? `url(${menu})` : `url(${whiteMenu})`};
    background-size: 100% 100%;
    cursor: pointer;
    &:hover {
      background-image: url(${menu});
    }
  }
`
const Tab = styled.div<{ authStatus: string }>`
  display: flex;
  padding: 0 15px;
  color: ${(props) => props.theme.color.bgDark};
  border: 1px solid #fff;
  border: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  cursor: pointer;
  @media screen and (max-width: 540px) {
    padding: 2px 10px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`
const SignUpTab = styled(Tab)`
  ${(props) =>
    props.authStatus === "isSigningUp" &&
    ` color: ${props.theme.color.bgLight};
      background-color:${props.theme.color.lightMain};
      cursor:default;`}
  &:hover {
    ${(props) =>
      props.authStatus !== "isSigningUp" &&
      `color: ${props.theme.color.deepMain};
       background-color:${props.theme.color.bgLight};
       transition: background-color 0.5s;`}
  }
`

const SignInTab = styled(Tab)`
  ${(props) =>
    props.authStatus === "isSigningIn" &&
    ` color: ${props.theme.color.bgLight};
      background-color:${props.theme.color.lightMain};
      cursor:default;`}
  &:hover {
    ${(props) =>
      props.authStatus !== "isSigningIn" &&
      `color: ${props.theme.color.deepMain};
       background-color:${props.theme.color.bgLight};
       transition: background-color 0.5s;`}
  }
`
const TabText = styled.div`
  width: 100%;
  height: 100%;
`

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  width: 50%;
  min-width: 350px;
  max-height: 100%;
  padding: 20px 40px;
  font-size: ${(props) => props.theme.title.md};
  background-color: rgb(255, 255, 255, 0.6);
  border-radius: 5px;
  box-shadow: 0px 8px 6px #0000004c;
  z-index: 100;
  @media screen and (max-width: 540px) {
    padding: 40px 20px 20px 20px;
    min-width: initial;
    width: 100%;
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
  authStatus: string
  setAuthStatus: Dispatch<SetStateAction<string>>
  setShowMiniTab: Dispatch<SetStateAction<boolean>>
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
  setAuthStatus: Dispatch<SetStateAction<string>>,
  setShowMiniTab: Dispatch<SetStateAction<boolean>>
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const targetNode = event?.target as Node
      const targetElement = event?.target as Element
      if (
        !ref.current ||
        ref.current.contains(targetNode) ||
        targetElement.classList.contains("pac-item") ||
        targetElement.classList.contains("pac-matched") ||
        targetNode?.parentElement?.className === "pac-item" ||
        targetNode?.parentElement?.className === "pac-container"
      ) {
        return
      }
      setAuthStatus("")
      setShowMiniTab(false)
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
  const { currentUser, isLogin, signUp, signIn, isLoading } =
    useContext(AuthContext)
  const { overlayRef, authStatus, setAuthStatus, setShowMiniTab } = props
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)
  const hometownRef = useRef<HTMLInputElement>(null)
  const [hometownBox, setHometownBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  const [result, setResult] = useState<google.maps.places.PlaceResult[]>()

  const onPlacesChanged = () => {
    if (hometownBox instanceof google.maps.places.SearchBox) {
      const searchResult = hometownBox.getPlaces()
      setResult(searchResult)
    }
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setHometownBox(ref)

  useEffect(() => {
    if (authStatus === "") return
    if (authStatus === "isSigningUp") nameRef?.current?.focus()
    if (authStatus === "isSigningIn") emailRef?.current?.focus()
  }, [authStatus])

  const handleSignUp = () => {
    if (nameRef?.current?.value.trim() === "") {
      nameRef.current.focus()
      notifyWarn("Your name is required")
      return
    }
    if (emailRef?.current?.value.trim() === "") {
      emailRef?.current.focus()
      notifyWarn("Email is required")
      return
    }
    if (pwRef?.current?.value.trim() === "") {
      pwRef?.current.focus()
      notifyWarn("Password is required")
      return
    }
    if (!result && hometownRef?.current !== null) {
      hometownRef?.current.focus()
      notifyWarn("Please select your hometown")
      return
    }
    if (
      typeof nameRef?.current?.value === "string" &&
      typeof emailRef?.current?.value === "string" &&
      typeof pwRef?.current?.value === "string" &&
      result
    ) {
      signUp(
        nameRef?.current?.value,
        emailRef?.current?.value,
        pwRef?.current?.value,
        result
      )
    }
  }

  const handleSignIn = () => {
    if (emailRef?.current?.value.trim() === "") {
      emailRef?.current.focus()
      notifyWarn("Invalid Email")
      return
    }
    if (pwRef?.current?.value.trim() === "") {
      pwRef?.current.focus()
      notifyWarn("Invalid password")
      return
    }
    if (
      typeof emailRef?.current?.value === "string" &&
      typeof pwRef?.current?.value === "string"
    ) {
      signIn(emailRef?.current?.value, pwRef?.current?.value)
    }
  }
  useOnClickOutside(
    overlayRef,
    () => setAuthStatus(""),
    () => setShowMiniTab(false)
  )

  return (
    <Wrapper ref={overlayRef}>
      {(!isLogin || currentUser === null || currentUser === undefined) &&
        authStatus === "isSigningUp" && (
          <>
            <AuthTitle>Name</AuthTitle>
            <Input
              ref={nameRef}
              name="userName"
              placeholder="Big Traveller"
              required
            />
            <AuthTitle>Email</AuthTitle>
            <Input
              ref={emailRef}
              name="accountEmail"
              placeholder="name@xxxx.com"
              required
            />
            <AuthTitle>Password</AuthTitle>
            <Input
              type="password"
              ref={pwRef}
              name="password"
              placeholder="over 6 letters"
              required
            />
            <AuthTitle>Where is your hometown?</AuthTitle>
            <StandaloneSearchBox
              onLoad={onLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <Input
                ref={hometownRef}
                placeholder="search and select a place"
                required
              />
            </StandaloneSearchBox>
            <BtnText id="BtnSignUp" onClick={handleSignUp}>
              {isLoading ? <Spinner /> : "Create an account"}
            </BtnText>
          </>
        )}
      {(!isLogin || currentUser === null || currentUser === undefined) &&
        authStatus === "isSigningIn" && (
          <>
            <AuthTitle>Email</AuthTitle>
            <Input
              ref={emailRef}
              name="accountEmail"
              placeholder="name@xxxx.com"
              required
            />
            <AuthTitle>Password</AuthTitle>
            <Input
              type="password"
              ref={pwRef}
              name="password"
              placeholder="over 6 letters"
              required
            />
            <BtnText onClick={handleSignIn}>
              {isLoading ? <Spinner /> : "Sign in"}
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
  const { mapZoom } = useContext(MapContext)
  const [fingerPos, setFingerPos] = useState<LatLngTuple>([lat, lng])
  const [speed, setSpeed] = useState(2500)
  useEffect(() => {
    if (mapZoom !== "xs") {
      setSpeed(2500)
    } else {
      setSpeed(500)
    }
  }, [mapZoom])
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
        duration={speed}
      />
    </>
  )
}
function ChangeCenter() {
  const { mapZoom } = useContext(MapContext)
  const miniMap = useMap()
  if (mapZoom === "lg") {
    miniMap.flyTo([30.51620596509747, -130], 1.25)
  } else if (mapZoom === "md") {
    miniMap.flyTo([46.57447264034455, -130], 0.75)
  } else if (mapZoom === "sm") {
    miniMap.flyTo([39.9437334482122, -100], 0.5)
  } else if (mapZoom === "xxs") {
    miniMap.flyTo([39.9437334482122, -150], 0.5)
  }
  return null
}
function ChangeCenterBack() {
  const { mapZoom } = useContext(MapContext)
  const originMap = useMap()
  if (mapZoom === "lg") {
    originMap.flyTo([39.9437334482122, 50.35942441225613], 1.25)
  } else if (mapZoom === "md") {
    originMap.flyTo([39.9437334482122, 35.35942441225613], 1)
  } else if (mapZoom === "sm") {
    originMap.flyTo([39.9437334482122, 38.35942441225613], 0.5)
  } else if (mapZoom === "xxs") {
    originMap.flyTo([39.9437334482122, 66], 0.75)
  }
  return null
}

let cursor = 0
function Home() {
  const { currentUser, isLogin } = useContext(AuthContext)
  const { mapZoom } = useContext(MapContext)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<LatLng | null>(null)
  const [authStatus, setAuthStatus] = useState("")
  const [showTips, setShowTips] = useState(false)
  const [showMiniTab, setShowMiniTab] = useState(false)
  const [initialZoom, setInitialZoom] = useState(1.25)
  const [fingerRoute, setFingerRoute] = useState({
    lat: 76.28248506785224,
    lng: 308,
  })
  const [routePositions, setRoutePositions] = useState([
    { lat: 76, lng: 309 },
    { lat: 77, lng: 310 },
  ])
  console.log({ mapZoom })
  useEffect(() => {
    if (mapZoom === "lg") {
      setInitialZoom(1.25)
      setRoutePositions([
        { lat: 70.10851411418622, lng: 300.13876852999573 },
        { lat: 74.70521040764667, lng: 325.564188227921 },
      ])
    } else if (mapZoom === "md") {
      setInitialZoom(1)
      setRoutePositions([
        { lat: 68, lng: 298 },
        { lat: 71, lng: 300 },
      ])
    } else if (mapZoom === "sm") {
      setInitialZoom(0.5)
      setRoutePositions([
        { lat: 69, lng: 320 },
        { lat: 73, lng: 322 },
      ])
    } else if (mapZoom === "xs" || mapZoom === "xxs") {
      setInitialZoom(0.5)
    }
  }, [mapZoom])

  useEffect(() => {
    if (showTips || mapZoom === "xxs" || authStatus !== "") return
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
  }, [showTips, mapZoom, authStatus])

  console.log({ position })
  return (
    <>
      <HeaderWrapper>
        <TabMenu
          showMiniTab={showMiniTab}
          onClick={() => {
            setShowMiniTab((isShown) => !isShown)
            if (showMiniTab) {
              setAuthStatus("")
            }
          }}
        />
        <TabWrapper>
          <SignUpTab
            authStatus={authStatus}
            onClick={() => {
              setShowTips(false)
              setAuthStatus("isSigningUp")
            }}
          >
            <TabText> Sign up</TabText>
          </SignUpTab>
          <SignInTab
            authStatus={authStatus}
            onClick={() => {
              setShowTips(false)
              setAuthStatus("isSigningIn")
            }}
          >
            <TabText>Sign In</TabText>
          </SignInTab>
        </TabWrapper>
        <Title>My Travel Pins</Title>
      </HeaderWrapper>
      <Container>
        <MiniTabWrapper showMiniTab={showMiniTab}>
          <SignUpTab
            authStatus={authStatus}
            onClick={() => {
              setShowTips(false)
              setAuthStatus("isSigningUp")
            }}
          >
            <TabText> Sign up</TabText>
          </SignUpTab>
          <SignInTab
            authStatus={authStatus}
            onClick={() => {
              setShowTips(false)
              setAuthStatus("isSigningIn")
            }}
          >
            <TabText>Sign In</TabText>
          </SignInTab>
        </MiniTabWrapper>
        <Attribution href="https://leafletjs.com/">source: Leaflet</Attribution>
        {(!isLogin || currentUser === null) && (
          <>
            <StyleMapContainer
              id="homeMap"
              center={
                window.innerWidth > 900 && window.innerHeight > 600
                  ? [39.9437334482122, 50.35942441225613]
                  : [39, 35]
              }
              zoomControl={false}
              zoom={initialZoom}
              scrollWheelZoom={false}
              zoomSnap={0.25}
              dragging={window.innerWidth < 540 ? true : false}
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
              {!showTips && authStatus === "" && (
                <FingerMarker data={fingerRoute} />
              )}
              {authStatus !== "" && <ChangeCenter />}
              <TargetArea position={position} setPosition={setPosition} />

              {authStatus === "" && (
                <>
                  <ChangeCenterBack />
                  {mapZoom !== "xxs" && !showTips && (
                    <PhotoWall setShowTips={setShowTips} />
                  )}
                </>
              )}
              {authStatus === "isSigningUp" && (
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
        {authStatus !== "" && (
          <AuthArea
            authStatus={authStatus}
            setAuthStatus={setAuthStatus}
            setShowMiniTab={setShowMiniTab}
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

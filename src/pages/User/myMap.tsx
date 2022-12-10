import React from "react"
import {
  useState,
  useRef,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import styled from "styled-components"
import L, { LatLng, LeafletEvent } from "leaflet"
import { StandaloneSearchBox } from "@react-google-maps/api"
import {
  Tooltip,
  useMap,
  Marker,
  Popup,
  GeoJSON,
  ZoomControl,
  useMapEvents,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { countries } from "../../utils/customGeo"
import { notifyWarn } from "../../components/reminder"
import {
  Attribution,
  StyleMapContainer,
  Container,
  Wrapper,
} from "../../components/styles/mapStyles"
import {
  StepText,
  StepTitle,
  Input,
  BtnText,
} from "../../components/styles/formStyles"
import {
  BgOverlay,
  ReminderArea,
  ReminderText,
  BtnWrapper,
  BtnLight,
  BtnBlue,
} from "../../components/styles/modalStyles"
import { AuthContext } from "../../context/authContext"
import Upload from "../../components/post/uploadPhoto"
import { db, storage } from "../../utils/firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { checkRealTimePinsInfo, getPins, PinContent } from "../../utils/pins"
import Editor from "../../components/post/editor"
import addPinIcon from "../../assets/markers/addPin.png"
import pins from "../../assets/markers/pins.png"
import DetailMemory from "../../components/pinContent/detailMemory"
import spinner from "../../assets/dotsSpinner.svg"
import xmark from "../../assets/buttons/x-mark.png"
import home from "../../assets/markers/home1.png"
import pinIcon from "../../assets/location.png"

const PhotoText = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  margin: 5px 0;
  width: 100%;
  min-width: 150px;
  height: 120px;
  font-size: ${(props) => props.theme.title.md};
  color: ${(props) => props.theme.color.bgDark};
  background-color: ${(props) => props.theme.btnColor.bgGreen};
  border-radius: 5px;
`
const Spinner = styled(Container)`
  background-image: url(${spinner});
  background-size: 100% 100%;
  background-color: rgb(255, 255, 255, 0);
  border: none;
`
const Xmark = styled.div`
  position: absolute;
  top: 25px;
  right: 20px;
  background-image: url(${xmark});
  background-size: 100% 100%;
  width: 15px;
  height: 15px;
  cursor: pointer;
  z-index: 50;
`
const PostPinWrapper = styled(Wrapper)`
  display: flex;
  flex-flow: column nowrap;
  width: 50%;
  height: 100%;
  padding: 20px 20px;
  font-size: ${(props) => props.theme.title.md};
  z-index: 48;
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`

const LocationText = styled(StepText)`
  align-items: center;
  gap: 10px;
`
const PinIcon = styled.div`
  width: 15px;
  height: 15px;
  background-image: url(${pinIcon});
  background-size: 100% 100%;
`
const BtnAddPin = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  width: 50px;
  height: 50px;
  background-image: url(${addPinIcon});
  background-size: 100% 100%;
  z-index: 60;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    width: 40px;
    height: 40px;
  }
`

const ArticleWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  gap: 5px;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

export const PinInfoArea = styled.div`
  background-color: #ffffff;
  cursor: pointer;
`
export const PinInfoImg = styled.img`
  margin: 5px 0;
  width: 100%;
  min-width: 150px;
  height: 120px;
`
export const PinInfoTitle = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 700;
`

interface CenterType {
  center: LatLng | null
  setCenter: Dispatch<SetStateAction<LatLng | null>>
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
  stroke: true,
  color: "#8c8c8c",
  weight: 0.5,
  fill: true,
  fillColor: "#fff",
  fillOpacity: 0.8,
  zIndex: 50,
}

function TargetArea(props: CenterType) {
  const { center, setCenter } = props

  useMapEvents({
    click(e) {
      setCenter(e.latlng)
    },
  })

  return null
}

const onEachFeature = (country: CountryType, layer: L.GeoJSON) => {
  layer.bindTooltip(country.properties.name, {
    direction: "bottom",
    sticky: true,
    className: "leaflet-tooltip",
  })
  layer.on("mouseover", (event: LeafletEvent) => {
    if (event.target.feature.properties.name === country.properties.name) {
      layer.setStyle({
        fill: true,
        fillColor: "#7ccbab",
        fillOpacity: 1,
      })
    }
  })
  layer.on("mouseout", () => {
    layer.setStyle({
      fill: true,
      fillColor: "#fff",
      fillOpacity: 0.8,
    })
  })
}
function ChangeCenter() {
  const { mapZoom } = useContext(AuthContext)
  const miniMap = useMap()
  if (mapZoom === "lg") {
    miniMap.flyTo([45, -170], 1.25)
  } else {
    miniMap.flyTo([42, 167], 1)
  }
  return null
}
function ChangeCenterBack() {
  const { mapZoom } = useContext(AuthContext)
  const originMap = useMap()
  if (mapZoom === "lg") {
    originMap.flyTo([45, 10], 1.75)
  } else {
    originMap.flyTo([41, 5], 1.5)
  }
  return null
}

const DefaultIcon = L.icon({
  iconUrl: home,
  iconSize: [40, 43],
  iconAnchor: [40, 43],
})

const lgNewPinIcon = L.icon({
  iconSize: [30, 30],
  iconAnchor: [12, 30],
  iconUrl: pins,
})
const mdNewPinIcon = L.icon({
  iconSize: [30, 30],
  iconAnchor: [12, 30],
  iconUrl: pins,
})

const getCurrentDate = () => {
  const dateObj = new Date()
  const month = ("0" + (dateObj.getMonth() + 1)).slice(-2)
  const day = ("0" + dateObj.getDate()).slice(-2)
  const year = dateObj.getFullYear()
  const today = `${year}-${month}-${day}`

  return today
}

export default function MyMap() {
  const {
    isLoaded,
    isLogin,
    currentUser,
    mapZoom,
    setIsMyMap,
    setIsMyMemory,
    setIsMyFriend,
    setIsFriendHome,
    setIsFriendMemory,
  } = useContext(AuthContext)

  const [center, setCenter] = useState<LatLng | null>(null)
  const [newPin, setNewPin] = useState({
    id: "",
    userId: "",
    location: {
      lat: 0,
      lng: 0,
      name: "",
      placeId: "",
    },
  })

  const [markers, setMarkers] = useState<PinContent[]>([])
  const [selectedMarker, setSelectedMarker] = useState<PinContent>()
  const [searchBox, setSearchBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  const [filesName, setFilesName] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hasAddPin, setHasAddPin] = useState(false)
  const [hasUpload, setHasUpload] = useState(false)
  const [urls, setUrls] = useState<string[]>([])
  const [artiTitle, setArtiTitle] = useState<string>("")
  const [travelDate, setTravelDate] = useState<string>(getCurrentDate)
  const [artiContent, setArtiContent] = useState<string>("")
  const [hasFetched, setHasFetched] = useState(false)
  const [showMemory, setShowMemory] = useState(false)
  const [showPostArea, setShowPostArea] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [canUpload, setCanUpload] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLInputElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const [refReady, setRefReady] = useState(false)
  const popupRef = useRef<any>(null)

  useEffect(() => {
    if (!selectedMarker) return

    if (refReady && popupRef !== undefined) {
      popupRef.current.openPopup()
    }
  }, [selectedMarker?.location.placeId, refReady])

  useEffect(() => {
    setIsMyMap(true)
    setIsMyMemory(false)
    setIsMyFriend(false)
    setIsFriendHome(false)
    setIsFriendMemory(false)
    if (typeof currentUser?.id === "string" && !showMemory) {
      getPins(
        currentUser,
        currentUser?.id,
        hasFetched,
        setHasFetched,
        setMarkers
      )
    } else return
  }, [currentUser?.id, showMemory])
  useEffect(() => {
    if (
      currentUser !== undefined &&
      currentUser !== null &&
      typeof currentUser?.id === "string"
    ) {
      checkRealTimePinsInfo(currentUser?.id, setMarkers)
      return checkRealTimePinsInfo(currentUser?.id, setMarkers)
    }
  }, [currentUser?.id])

  const onPlacesChanged = () => {
    if (searchBox instanceof google.maps.places.SearchBox) {
      const searchResult = searchBox.getPlaces()
      if (searchResult !== undefined && currentUser) {
        const newLat = searchResult[0]?.geometry?.location?.lat()
        const newLng = searchResult[0]?.geometry?.location?.lng()
        const placeName = searchResult[0]?.name
        const placeId = searchResult[0]?.place_id
        if (newLat && newLng && placeName && placeId) {
          const newPinInfo = {
            id: `${currentUser?.id}-${placeId}-${Date.now()}`,
            userId: `${currentUser?.id}`,
            location: {
              lat: newLat,
              lng: newLng,
              name: placeName,
              placeId: placeId,
            },
          }
          setNewPin(newPinInfo)
          setHasAddPin(true)
          setCanUpload(true)
        }
      }
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref)

  const handleClosePostArea = () => {
    if (
      newPin.location.placeId !== "" ||
      (artiTitle !== "" && artiContent !== "<p><br></p>") ||
      urls.length !== 0
    ) {
      setShowAlert(true)
    } else {
      setShowPostArea(false)
    }
  }
  const addMemory = async () => {
    if (newPin.location.placeId === "") {
      locationRef?.current?.focus()
      notifyWarn("Place marker is required")
      return
    }
    if (artiTitle === "") {
      titleRef?.current?.focus()
      titleRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      notifyWarn("Title is required")
      return
    }
    try {
      await setDoc(doc(db, "pins", newPin?.id), newPin)
      const docRef = doc(db, "pins", newPin.id)
      const artiInfo = {
        article: {
          title: artiTitle,
          travelDate: travelDate,
          content: artiContent,
        },
        postTimestamp: Date.now(),
        postReadableTime: new Date(),
        albumURLs: urls,
        albumNames: filesName,
      }
      await updateDoc(docRef, artiInfo)
      setMarkers((prev) => {
        return [
          ...prev,
          {
            id: newPin.id,
            userId: newPin.userId,
            article: {
              title: artiTitle,
              travelDate: travelDate,
              content: artiContent,
            },
            postTimestamp: artiInfo.postTimestamp,
            postReadableTime: artiInfo.postReadableTime,
            albumURLs: urls,
            albumNames: filesName,
            location: {
              placeId: newPin.location.placeId,
              lat: newPin.location.lat,
              lng: newPin.location.lng,
              name: newPin.location.name,
            },
          },
        ]
      })
      setSelectedMarker({
        id: newPin.id,
        userId: newPin.userId,
        article: {
          title: artiTitle,
          travelDate: travelDate,
          content: artiContent,
        },
        postTimestamp: artiInfo.postTimestamp,
        postReadableTime: artiInfo.postReadableTime,
        albumURLs: urls,
        albumNames: filesName,
        location: {
          placeId: newPin.location.placeId,
          lat: newPin.location.lat,
          lng: newPin.location.lng,
          name: newPin.location.name,
        },
      })
      if (newPin.location.placeId !== "" && locationRef.current !== null) {
        locationRef.current.value = ""
      }
      setRefReady(true)
      setFilesName([])
      setUploadProgress(0)
      setUrls([])
      setArtiTitle("")
      setTravelDate(getCurrentDate)
      setArtiContent("")
      setHasAddPin(false)
      setCanUpload(false)
    } catch (error) {
      console.log(error)
    }
  }

  const cancelPost = () => {
    if (urls.length !== 0 && typeof currentUser?.id === "string") {
      const folderName = `${currentUser?.id?.slice(
        0,
        4
      )}-${newPin.location.placeId.slice(0, 6)}`
      try {
        filesName.map(async (file) => {
          await deleteObject(ref(storage, `/${folderName}/${file}`))
        })
      } catch (error) {
        console.log(error)
      }
    }
    if (locationRef.current !== null) locationRef.current.value === ""

    setHasAddPin(false)
    setShowAlert(false)
    setUploadProgress(0)
    setFilesName([])
    setUrls([])
    setArtiTitle("")
    setArtiContent("")
    setTravelDate(getCurrentDate)
    setNewPin({
      id: "",
      userId: "",
      location: {
        lat: 0,
        lng: 0,
        name: "",
        placeId: "",
      },
    })
  }

  if (!isLogin || currentUser === undefined || currentUser === null)
    return <Spinner />

  return (
    <>
      {!isLoaded ||
      typeof currentUser?.hometownLat !== "number" ||
      typeof currentUser?.hometownLng !== "number" ? (
        <Spinner />
      ) : (
        <>
          {showAlert && (
            <>
              <BgOverlay />
              <ReminderArea>
                <ReminderText>
                  Are you sure <br />
                  you want to discard this post?
                </ReminderText>

                <BtnWrapper>
                  <BtnLight
                    onClick={() => {
                      setShowAlert(false)
                    }}
                  >
                    cancel
                  </BtnLight>
                  <BtnBlue
                    onClick={() => {
                      cancelPost()
                      setShowAlert(false)
                      setShowPostArea(false)
                    }}
                  >
                    Discard
                  </BtnBlue>
                </BtnWrapper>
              </ReminderArea>
            </>
          )}
          <Container>
            {!showPostArea && (
              <BtnAddPin
                onClick={() => {
                  setShowPostArea(true)
                }}
              />
            )}
            {showPostArea && (
              <PostPinWrapper ref={overlayRef}>
                <Xmark onClick={handleClosePostArea} />
                {!hasAddPin ? (
                  <>
                    <StepTitle>To remember your trip</StepTitle>
                    <StepText>Step 1&ensp;:&ensp; Pin a place!</StepText>

                    <StandaloneSearchBox
                      onLoad={onLoad}
                      onPlacesChanged={onPlacesChanged}
                    >
                      <Input
                        ref={locationRef}
                        placeholder="Where did you go?"
                        required
                      ></Input>
                    </StandaloneSearchBox>
                    <StepText>Step 2&ensp;:&ensp; Log your memory</StepText>
                  </>
                ) : (
                  <>
                    <StepText>Log your memory</StepText>
                    <LocationText>
                      <PinIcon />
                      {newPin?.location?.name}
                    </LocationText>
                  </>
                )}
                <ArticleWrapper>
                  <Input
                    ref={titleRef}
                    placeholder="Title"
                    value={artiTitle}
                    onChange={(e) => {
                      setArtiTitle(e.target.value)
                    }}
                    required
                  />
                  <Input
                    type="date"
                    pattern="\d{4}-\d{2}-\d{2}"
                    min="1900-01-01"
                    max="9999-12-31"
                    onChange={(e) => {
                      setTravelDate(e.target.value)
                    }}
                    value={travelDate}
                  />
                  <Editor
                    artiContent={artiContent}
                    setArtiContent={setArtiContent}
                  />
                  <Upload
                    locationRef={locationRef}
                    canUpload={canUpload}
                    currentPin={newPin}
                    setFilesName={setFilesName}
                    hasUpload={hasUpload}
                    setHasUpload={setHasUpload}
                    urls={urls}
                    setUrls={setUrls}
                    setUploadProgress={setUploadProgress}
                  />
                  <BtnText onClick={addMemory}>Confirm to post</BtnText>
                </ArticleWrapper>
              </PostPinWrapper>
            )}

            <StyleMapContainer
              id="my-Map"
              center={
                mapZoom === "lg"
                  ? [
                      selectedMarker?.location?.lat || 45,
                      selectedMarker?.location?.lng || 10,
                    ]
                  : [
                      selectedMarker?.location?.lat || 41,
                      selectedMarker?.location?.lng || 5,
                    ]
              }
              zoomControl={false}
              zoom={mapZoom === "lg" ? 1.75 : 1.5}
              scrollWheelZoom={true}
              zoomSnap={0.25}
              dragging={true}
              trackResize
              style={{
                position: `${showPostArea ? "absolute" : "initial"}`,
                top: `${showPostArea ? "0" : "initial"}`,
                right: `${showPostArea ? "0" : "initial"}`,
                margin: "0 auto",
                width: `${showPostArea ? "50%" : "100%"}`,
                height: "100%",
                zIndex: "30",
                backgroundColor: "rgb(255, 255, 255, 0)",
                borderRadius: "10px",
                border: "none",
              }}
              minZoom={mapZoom === "lg" ? 0.7 : 0.5}
            >
              <ZoomControl position="bottomright" />
              {countries.features.map((country) => (
                <GeoJSON
                  key={country.properties.name}
                  data={country}
                  style={myCustomStyle}
                  onEachFeature={onEachFeature}
                />
              ))}
              {showPostArea && <ChangeCenter />}
              {!showPostArea && <ChangeCenterBack />}
              <TargetArea center={center} setCenter={setCenter} />
              <Marker
                position={[currentUser?.hometownLat, currentUser?.hometownLng]}
              >
                <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                  Hometown {currentUser?.hometownName}
                </Tooltip>
              </Marker>
              {markers?.map((marker: any, index: number) => {
                return (
                  <Marker
                    ref={popupRef}
                    key={`${marker.location.placeId}-${index}`}
                    position={[marker.location.lat, marker.location.lng]}
                    icon={mapZoom === "lg" ? lgNewPinIcon : mdNewPinIcon}
                    eventHandlers={{
                      click() {
                        setRefReady(false)
                        setSelectedMarker(marker)
                      },
                    }}
                  >
                    <Popup
                      offset={mapZoom === "lg" ? [-1, -20] : [0, -20]}
                      keepInView={true}
                    >
                      <PinInfoArea
                        id={marker.location.placeId}
                        onClick={() => {
                          setShowMemory(true)
                          popupRef.current.closePopup()
                        }}
                      >
                        <PinInfoTitle>
                          {marker?.article?.travelDate}
                        </PinInfoTitle>
                        {marker.albumURLs && marker.albumURLs.length > 0 ? (
                          <PinInfoImg src={marker?.albumURLs[0]} />
                        ) : (
                          <PhotoText>{marker?.article?.title}</PhotoText>
                        )}
                        <PinInfoTitle>{marker?.location?.name}</PinInfoTitle>
                      </PinInfoArea>
                    </Popup>
                  </Marker>
                )
              })}
            </StyleMapContainer>
            {showMemory && (
              <DetailMemory
                selectedMarker={selectedMarker}
                setShowMemory={setShowMemory}
              />
            )}
            <Attribution href="https://leafletjs.com/">
              source: Leaflet
            </Attribution>
          </Container>
        </>
      )}
    </>
  )
}

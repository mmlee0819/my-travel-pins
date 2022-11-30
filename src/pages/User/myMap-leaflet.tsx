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
import { countries } from "../Utils/customGeo"
import {
  Attribution,
  StyleMapContainer,
  Container,
  Wrapper,
} from "./components/styles"
import home from "../assets/markers/home1.png"
import { StandaloneSearchBox } from "@react-google-maps/api"
import { AuthContext } from "../Context/authContext"
import Upload from "./components/uploadPhoto"
import { db, storage } from "../Utils/firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { getPins, PinContent } from "./ts_fn_commonUse"
import Editor from "../Components/editor"
import addPinIcon from "../assets/markers/addPin.png"
import pins from "../assets/markers/pins.png"
import DetailMemory from "../Components/detailMemory"
import spinner from "../assets/dotsSpinner.svg"
import xmark from "../assets/buttons/x-mark.png"

const PhotoText = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
  width: 150px;
  height: 120px;
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
  top: 30px;
  right: 30px;
  background-image: url(${xmark});
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
  cursor: pointer;
`
const PostPinWrapper = styled(Wrapper)`
  top: 3px;
  display: flex;
  flex-flow: column nowrap;
  width: 50%;
  height: 100%;

  padding: 20px 20px;
  font-size: ${(props) => props.theme.title.md};
  z-index: 48;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding-left: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: ${(props) => props.theme.title.lg};
  color: ${(props) => props.theme.color.bgDark};
  background-color: #ffffff;
  border: 3px solid #ffffff;
  border-radius: 5px;
  opacity: 1;
  &:focus {
    outline: #7ccbab;
    border: 3px solid #7ccbab;
  }
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`

const StepText = styled.div`
  display: flex;
  padding: 0px 10px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 700;
  color: ${(props) => props.theme.color.bgDark};
  border: none;
  gap: 5px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
    padding: 2px 10px;
  }
`
const BtnText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin: 30px auto;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 400;
  color: ${(props) => props.theme.color.bgLight};
  background-color: ${(props) => props.theme.btnColor.bgGreen};
  border-radius: 5px;
  border: none;
  gap: 5px;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
    height: 30px;
    font-size: ${(props) => props.theme.title.md};
  }
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

const BtnWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  margin: 30px auto;

  justify-content: space-between;
  align-self: center;
`
const BtnBlue = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 48%;
  padding: 5px;
  font-family: "Poppins";
  font-size: 20px;
  color: #ffffff;
  background-color: ${(props) => props.theme.btnColor.bgBlue};
  border-radius: 5px;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
  }
`
const BtnRed = styled(BtnBlue)`
  background-color: ${(props) => props.theme.btnColor.bgRed};
`

const ArticleWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
`

export const PinInfoArea = styled.div`
  background-color: #ffffff;
  cursor: pointer;
`
export const PinInfoImg = styled.img`
  width: 150px;
  height: 120px;
`
export const PinInfoTitle = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 700;
`

const BgOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.color.bgDark};
  opacity: 0.9;
  z-index: 50;
`
const ReminderArea = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  padding: 20px;
  color: ${(props) => props.theme.color.bgDark};
  background-color: #fff;
  border-radius: 5px;
  z-index: 52;
`
const ReminderText = styled.div`
  margin: 20px auto 0 auto;
  text-align: center;
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
interface CenterType {
  center: LatLng | null
  setCenter: Dispatch<SetStateAction<LatLng | null>>
}
interface Position {
  placeId?: string | undefined
  name?: string | undefined
  lat: number | undefined
  lng: number | undefined
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
    miniMap.flyTo([45, -185], 1.25)
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
  iconSize: [40, 40],
  iconAnchor: [40, 40],
  iconUrl: pins,
})
const mdNewPinIcon = L.icon({
  iconSize: [30, 30],
  iconAnchor: [30, 30],
  iconUrl: pins,
})

function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  locationRef: React.RefObject<HTMLInputElement>,
  setShowAlert: Dispatch<React.SetStateAction<boolean>>,
  setShowPostArea: Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        locationRef?.current?.value === "" ||
        (event?.target as HTMLDivElement)?.className === "pac-item" ||
        (event?.target as Node)?.parentElement?.className === "pac-item" ||
        (event?.target as Node)?.parentElement?.className === "pac-container"
      )
        return

      setShowAlert(true)
    }

    window.addEventListener("mousedown", listener)
    window.addEventListener("touchstart", listener)
    return () => {
      window.removeEventListener("mousedown", listener)
      window.removeEventListener("touchstart", listener)
    }
  }, [ref])
}

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
  console.log("currentUser", currentUser)
  const [center, setCenter] = useState<LatLng | null>(null)
  const [location, setLocation] = useState<google.maps.LatLng | Position>()
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
  console.log({ searchBox })
  const [filesName, setFilesName] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hasUpload, setHasUpload] = useState(false)
  const [urls, setUrls] = useState<string[]>([])
  const [artiTitle, setArtiTitle] = useState<string>("")
  const [travelDate, setTravelDate] = useState<string>(getCurrentDate)
  const [artiContent, setArtiContent] = useState<string>("")
  const [hasPosted, setHasPosted] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  const [showMemory, setShowMemory] = useState(false)
  const [showPostArea, setShowPostArea] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLInputElement>(null)
  const [refReady, setRefReady] = useState(false)
  const popupRef = useRef<any>(null)

  useEffect(() => {
    if (!selectedMarker) return
    console.log("popupRef.current", popupRef.current)
    if (refReady && popupRef !== undefined) {
      popupRef.current.openPopup()
    }
  }, [selectedMarker?.location.placeId])

  console.log({ showAlert })

  console.log({ showPostArea })
  console.log({ selectedMarker })

  useOnClickOutside(
    overlayRef,
    locationRef,
    () => setShowAlert(true),
    () => setShowPostArea(false)
  )

  useEffect(() => {
    setIsMyMap(true)
    setIsMyMemory(false)
    setIsMyFriend(false)
    setIsFriendHome(false)
    setIsFriendMemory(false)
    if (typeof currentUser?.id === "string") {
      getPins(
        currentUser,
        currentUser?.id,
        hasFetched,
        setHasFetched,
        setMarkers
      )
    } else return
  }, [currentUser?.id])

  const onPlacesChanged = () => {
    if (searchBox instanceof google.maps.places.SearchBox) {
      console.log(searchBox.getPlaces())
      const searchResult = searchBox.getPlaces()
      if (searchResult !== undefined && currentUser) {
        const newLat = searchResult[0]?.geometry?.location?.lat()
        const newLng = searchResult[0]?.geometry?.location?.lng()
        const placeName = searchResult[0]?.name
        const placeId = searchResult[0]?.place_id
        if (newLat && newLng) {
          setLocation({ lat: newLat, lng: newLng })
        }
        if (newLat && newLng && placeName && placeId) {
          const newPinInfo = {
            id: `${currentUser?.id}-${placeId}`,
            userId: `${currentUser?.id}`,
            location: {
              lat: newLat,
              lng: newLng,
              name: placeName,
              placeId: placeId,
            },
          }
          setNewPin(newPinInfo)
        }
      }
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref)

  const addMemory = async () => {
    if (!newPin) return
    try {
      await setDoc(doc(db, "pins", newPin?.id), newPin)
      if (filesName.length !== 0 && !hasUpload) {
        alert(
          "It seems that you have some photos, please click upload button first!"
        )
        return
      }
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
            article: {
              title: artiTitle,
              travelDate: travelDate,
              content: artiContent,
            },
            postTimestamp: Date.now(),
            postReadableTime: new Date(),
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
        article: {
          title: artiTitle,
          travelDate: travelDate,
          content: artiContent,
        },
        postTimestamp: Date.now(),
        postReadableTime: new Date(),
        albumURLs: urls,
        albumNames: filesName,
        location: {
          placeId: newPin.location.placeId,
          lat: newPin.location.lat,
          lng: newPin.location.lng,
          name: newPin.location.name,
        },
      })
      if (locationRef.current !== undefined && locationRef.current !== null) {
        locationRef.current.value = ""
      }
      setRefReady(true)
      setHasPosted(true)
      setFilesName([])
      setPhotos([])
      setUploadProgress(0)
      setUrls([])
      setArtiTitle("")
      setTravelDate(getCurrentDate)
      setArtiContent("")
    } catch (error) {
      console.log(error)
    }
  }

  const cancelPost = () => {
    if (urls.length !== 0 && typeof currentUser?.id === "string") {
      const folderName = `${currentUser?.id?.slice(
        0,
        4
      )}-${newPin.location.placeId.slice(0, 4)}`
      try {
        filesName.map(async (file) => {
          await deleteObject(ref(storage, `/${folderName}/${file}`))
        })
      } catch (error) {
        console.log(error)
      }
    }
    setShowAlert(false)
    setHasPosted(true)
    setFilesName([])
    setPhotos([])
    setUploadProgress(0)
    setUrls([])
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
                  you want to discard all changes <br />
                  and edit later?
                </ReminderText>

                <BtnWrapper>
                  <BtnRed
                    onClick={() => {
                      cancelPost()
                      setShowPostArea(false)
                    }}
                  >
                    Yes
                  </BtnRed>
                  <BtnBlue
                    onClick={() => {
                      setShowAlert(false)
                    }}
                  >
                    No, back to edit
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
                <Xmark
                  onClick={() => {
                    if (
                      locationRef.current !== undefined &&
                      locationRef.current !== null &&
                      locationRef?.current?.value !== ""
                    ) {
                      setShowAlert(true)
                    } else {
                      setShowPostArea(false)
                    }
                  }}
                />
                <StepText>To remember your trip</StepText>
                <>
                  <StepText>Step 1&ensp;:&ensp; Pin a place!</StepText>
                  <StandaloneSearchBox
                    onLoad={onLoad}
                    onPlacesChanged={onPlacesChanged}
                  >
                    <Input
                      ref={locationRef}
                      placeholder="Where did you go?"
                    ></Input>
                  </StandaloneSearchBox>
                </>

                {/* {hasAddPin && !hasPosted && ( */}
                <>
                  <StepText>Step 2&ensp;:&ensp; Log your memory</StepText>
                  <ArticleWrapper>
                    <Input
                      placeholder="Title"
                      value={artiTitle}
                      onChange={(e) => {
                        setArtiTitle(e.target.value)
                      }}
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
                  </ArticleWrapper>
                  <Upload
                    currentPin={newPin}
                    filesName={filesName}
                    setFilesName={setFilesName}
                    photos={photos}
                    setPhotos={setPhotos}
                    hasUpload={hasUpload}
                    setHasUpload={setHasUpload}
                    urls={urls}
                    setUrls={setUrls}
                    setUploadProgress={setUploadProgress}
                  />
                  <BtnText
                    onClick={() => {
                      // addPin()
                      addMemory()
                    }}
                  >
                    Confirm to post
                  </BtnText>
                </>
                {/* )} */}
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
                margin: "0 auto",
                width: "100%",
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
              {markers?.map((marker: any) => {
                return (
                  <>
                    <Marker
                      ref={popupRef}
                      key={marker.location.placeId}
                      position={[marker.location.lat, marker.location.lng]}
                      icon={mapZoom === "lg" ? lgNewPinIcon : mdNewPinIcon}
                      eventHandlers={{
                        click() {
                          setShowPostArea(false)
                          setSelectedMarker(marker)
                        },
                      }}
                    >
                      <Popup
                        offset={mapZoom === "lg" ? [-20, -30] : [-15, -20]}
                        keepInView={true}
                      >
                        <PinInfoArea
                          id={marker.location.placeId}
                          onClick={() => {
                            setShowMemory(true)
                          }}
                        >
                          {marker.albumURLs ? (
                            <PinInfoImg src={marker?.albumURLs[0]} />
                          ) : (
                            <PhotoText>No photo uploaded</PhotoText>
                          )}

                          <PinInfoTitle>{marker?.location?.name}</PinInfoTitle>
                        </PinInfoArea>
                      </Popup>
                    </Marker>
                  </>
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

import React from "react"
import {
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import styled from "styled-components"
import L, { LatLng, LeafletEvent } from "leaflet"
import {
  MapContainer,
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
import home from "../assets/markers/home.png"
import { StandaloneSearchBox } from "@react-google-maps/api"
import { AuthContext } from "../Context/authContext"
import Upload from "./functions/uploadPhoto"
import { db, storage } from "../Utils/firebase"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { getPins, PinContent } from "./ts_fn_commonUse"
import Editor from "../Components/editor"
import defaultImage from "../assets/defaultImage.png"
import addPinIcon from "../assets/markers/addPin.png"
import pins from "../assets/markers/pins.png"
import DetailMemory from "../Components/detailMemory"

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 20px;
`

const Title = styled.div`
  color: #000000;
`
const Wrapper = styled.div<{ hasAddPin: boolean }>`
  position: absolute;
  margin: auto;
  width: 50%;
  height: ${(props) => (props.hasAddPin ? "100%" : "200px")};
  padding: 20px 10px;
  top: 0;
  right: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  font-family: "Poppins";
  font-size: 20px;
  background-color: #2d2d2d;
  opacity: 1;
  border-radius: 10px;
  box-shadow: 0 8px 6px #0000004c;
  z-index: 60;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
  }
`

const Input = styled.input`
  width: 100%;
  height: 30px;
  padding-left: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 18px;
  color: #2d2d2d;
  background-color: #ffffff;
  border: 3px solid #ffffff;
  border-radius: 5px;
  opacity: 1;
  &:focus {
    outline: #f99c62;
    border: 3px solid #f99c62;
  }
`
const StepText = styled.div`
  display: flex;
  padding: 0px 10px;
  font-family: "Jomhuria";
  font-size: 40px;
  color: #fff;
  border: none;
  gap: 5px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 30px;
    padding: 2px 10px;
  }
`
const BtnText = styled.div`
  display: flex;
  align-items: end;
  justify-content: end;
  width: 100%;
  height: 40px;
  font-family: "Poppins";
  color: #f99c62;
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
  }
`
const BtnAddPin = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
  display: flex;
  width: 60px;
  height: 60px;
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
const BtnConfirmAddPin = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  background-image: url(${addPinIcon});
  background-size: 100% 100%;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    width: 30px;
    height: 30px;
  }
`

const CancelReminder = styled(BtnText)`
  margin-top: 30px;
  color: #fff;
  text-align: end;
`

const UploadPhotoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`
const BtnWrapper = styled(UploadPhotoWrapper)`
  margin-top: 15px;
`

const BtnUpload = styled.button`
  display: flex;
  align-self: center;
  align-items: center;
  padding: 10px;
  height: 30px;
  color: #ffffff;
  background-color: #5594b7;
  border: none;
  opacity: 1;
  border-radius: 10px;
  cursor: pointer;
`
const BtnConfirm = styled(BtnUpload)`
  background-color: #f99c62;
`
const BtnCancel = styled(BtnUpload)`
  background-color: #034961;
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
  fillOpacity: 1,
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
        fillColor: "#ffd500",
        fillOpacity: 1,
      })
    }
  })
  layer.on("mouseout", () => {
    layer.setStyle({
      fill: true,
      fillColor: "#fff",
      fillOpacity: 1,
    })
  })
}
function ChangeCenter() {
  const { mapZoom } = useContext(AuthContext)
  const miniMap = useMap()
  if (mapZoom === "lg") {
    miniMap.flyTo([45, 179], 2)
  } else {
    miniMap.flyTo([42, 167], 1)
  }
  return null
}
function ChangeCenterBack() {
  const { mapZoom } = useContext(AuthContext)
  const originMap = useMap()
  if (mapZoom === "lg") {
    originMap.flyTo([45, 50], 2)
  } else {
    originMap.flyTo([41, 121], 1)
  }
  return null
}
const DefaultIcon = L.icon({
  iconUrl: home,
  iconSize: [40, 43],
  iconAnchor: [40, 443],
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

export default function MyMap() {
  const {
    isLoaded,
    isLogin,
    currentUser,
    navigate,
    mapZoom,
    setIsMyMap,
    setIsMyMemory,
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
  console.log({ center })
  const [markers, setMarkers] = useState<PinContent[]>([])
  const [selectedMarker, setSelectedMarker] = useState<PinContent>()
  const [searchBox, setSearchBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  const [hasAddPin, setHasAddPin] = useState(false)
  const [filesName, setFilesName] = useState<string[]>([])
  const [photos, setPhotos] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hasUpload, setHasUpload] = useState(false)
  const [urls, setUrls] = useState<string[]>([])
  const [artiTitle, setArtiTitle] = useState<string>("")
  const [travelDate, setTravelDate] = useState<string>("")
  const [artiContent, setArtiContent] = useState<string>("")
  const [hasPosted, setHasPosted] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  const [showMemory, setShowMemory] = useState(false)
  const [showPostArea, setShowPostArea] = useState(false)

  useEffect(() => {
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

  const addPin = async () => {
    if (!newPin) return
    await setDoc(doc(db, "pins", newPin?.id), newPin)
    setMarkers((prev) => {
      return [
        ...prev,
        {
          location: {
            placeId: newPin.location.placeId,
            lat: newPin.location.lat,
            lng: newPin.location.lng,
            name: newPin.location.name,
          },
        },
      ]
    })
    setHasAddPin(true)
    setHasPosted(false)
    setHasUpload(false)
    setHasFetched(false)
  }

  const addMemory = async () => {
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
      postTime: new Date(),
      albumURLs: urls,
      albumNames: filesName,
    }
    try {
      await updateDoc(docRef, artiInfo)
      setHasPosted(true)
      setHasAddPin(false)
      setFilesName([])
      setPhotos([])
      setUploadProgress(0)
      setUrls([])
      if (currentUser) {
        setIsMyMap(false)
        setIsMyMemory(true)
        navigate(`/${currentUser.name}/my-memories`)
      }
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
    setHasPosted(true)
    setHasAddPin(false)
    setFilesName([])
    setPhotos([])
    setUploadProgress(0)
    setUrls([])
  }

  if (!isLogin || currentUser === undefined || currentUser === null)
    return <Title>你沒有登入</Title>

  return (
    <>
      {isLoaded &&
        typeof currentUser?.hometownLat === "number" &&
        typeof currentUser?.hometownLng === "number" && (
          <Container>
            {!showPostArea && (
              <BtnAddPin
                onClick={() => {
                  setShowPostArea(true)
                }}
              />
            )}
            {showPostArea && (
              <Wrapper hasAddPin={hasAddPin}>
                <StepText>To remember your trip</StepText>
                {!hasAddPin && (
                  <>
                    <StepText>Step 1: Pin a place!</StepText>
                    <StandaloneSearchBox
                      onLoad={onLoad}
                      onPlacesChanged={onPlacesChanged}
                    >
                      <Input placeholder="Where did you go?"></Input>
                    </StandaloneSearchBox>
                    <BtnText onClick={addPin}>
                      Confirm to pin
                      <BtnConfirmAddPin />
                    </BtnText>
                  </>
                )}
                {hasAddPin && !hasPosted && (
                  <>
                    <StepText>Step 2: Log your memory</StepText>
                    <ArticleWrapper>
                      <Input
                        placeholder="Title"
                        onChange={(e) => {
                          setArtiTitle(e.target.value)
                        }}
                      />
                      <Input
                        type="date"
                        onChange={(e) => {
                          setTravelDate(e.target.value)
                        }}
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
                    <BtnWrapper>
                      <BtnConfirm onClick={addMemory}>
                        Confirm to post
                      </BtnConfirm>
                      <BtnCancel onClick={cancelPost}>Cancel</BtnCancel>
                    </BtnWrapper>
                    <CancelReminder>
                      If you cancel to post,
                      <br /> all content and uploaded files will not be
                      preserved.
                    </CancelReminder>
                  </>
                )}
              </Wrapper>
            )}

            <MapContainer
              id="my-Map"
              center={
                mapZoom === "lg"
                  ? [
                      selectedMarker?.location?.lat || 45,
                      selectedMarker?.location?.lng || 50,
                    ]
                  : [
                      selectedMarker?.location?.lat || 41,
                      selectedMarker?.location?.lng || 121,
                    ]
              }
              zoomControl={false}
              zoom={mapZoom === "lg" ? 2 : 1}
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
              }}
              minZoom={mapZoom === "lg" ? 2 : 1}
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
              {hasAddPin && !hasPosted && <ChangeCenter />}
              {!hasAddPin && !hasPosted && <ChangeCenterBack />}
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
                        keepInView
                      >
                        <PinInfoArea
                          onClick={() => {
                            setShowMemory(true)
                          }}
                        >
                          <PinInfoImg
                            src={
                              marker.albumURLs
                                ? marker?.albumURLs[0]
                                : defaultImage
                            }
                          />
                          <PinInfoTitle>{marker?.location?.name}</PinInfoTitle>
                        </PinInfoArea>
                      </Popup>
                    </Marker>
                  </>
                )
              })}
            </MapContainer>
            {showMemory && (
              <DetailMemory
                selectedMarker={selectedMarker}
                setShowMemory={setShowMemory}
              />
            )}
          </Container>
        )}
    </>
  )
}

import React from "react"
import { Link } from "react-router-dom"
import {
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import styled from "styled-components"
import L, { LatLng, LeafletEvent, LatLngTuple } from "leaflet"
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
import homeMarker from "../assets/markers/hometownIcon.png"
import { TabWrapper, SplitWrapper } from "./myFriends"
import { AuthContext } from "../Context/authContext"
import { db } from "../Utils/firebase"
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore"
import { DocumentData } from "@firebase/firestore-types"
import defaultImage from "../assets/defaultImage.png"
import { DefinedDocumentData, getPins, PinContent } from "./ts_fn_commonUse"
import pins from "../assets/markers/pins.png"
import DetailMemoryOnMap from "../Components/detailMemoryOnMap"

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 20px;
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

const TabLink = styled(Link)`
  padding: 5px 8px;
  text-align: center;
  color: #000000;
  text-decoration: none;
  cursor: pointer;
  &:visited {
    color: #000000;
  }
  &:hover {
    color: #2d65be;
  }
  &:active {
    color: #000000;
  }
`
const TabTitle = styled.div`
  padding: 5px 8px;
  width: 130px;
  text-align: center;
  color: #2d65be;
  border: 1px solid #beb9b9;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: none;
`
const LeftSplit = styled.div`
  width: 31px;
  border-top: 1px solid #beb9b9;
`
const RightSplit = styled(LeftSplit)`
  flex: 1 1 auto;
  margin-left: 128px;
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
  iconUrl: homeMarker,
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

function FriendsMap() {
  const { isLoaded, currentUser, mapZoom } = useContext(AuthContext)

  // const [center, setCenter] = useState<LatLng | null>(null)
  const [friendInfo, setFriendInfo] = useState<DefinedDocumentData>()
  const [markers, setMarkers] = useState<
    DocumentData[] | DefinedDocumentData[] | PinContent[]
  >([])
  const [selectedMarker, setSelectedMarker] = useState<PinContent | undefined>()
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [showMemory, setShowMemory] = useState(false)

  console.log("markers", markers)
  const url = window.location.href
  const splitUrlArr = url.split("/")
  const friendId = splitUrlArr.slice(-1)[0]
  let friendName = splitUrlArr.slice(-2, -1)[0]
  if (friendName[0] === "%") {
    friendName = decodeURI(friendName)
  }

  useEffect(() => {
    const getFriendInfo = async () => {
      if (typeof friendId !== "string") return
      const docRef = doc(db, "users", friendId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setFriendInfo(docSnap.data())
        // setHometownText(docSnap.data().hometownName)
      } else {
        console.log("No such document!")
      }
    }
    getFriendInfo()
  }, [friendId])

  useEffect(() => {
    const getAllPinsOfFriend = async () => {
      const q = query(collection(db, "pins"), where("userId", "==", friendId))
      const querySnapshot = await getDocs(q)
      // const newMarkers: DocumentData[] | PinContent[] = []
      const newMarkers: any[] = []
      querySnapshot.forEach((doc: any) => {
        newMarkers.push(doc.data())
      })
      setMarkers(newMarkers)
    }
    getAllPinsOfFriend()
  }, [])

  return (
    <>
      <Container>
        {isLoaded &&
          typeof friendInfo?.hometownLat === "number" &&
          typeof friendInfo?.hometownLng === "number" && (
            <MapContainer
              id={`${friendName}-map`}
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
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
              ))}
              {/* <TargetArea center={center} setCenter={setCenter} /> */}
              <Marker
                position={[friendInfo?.hometownLat, friendInfo?.hometownLng]}
              >
                <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                  Hometown {friendInfo?.hometownName}
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
          )}
        <TabWrapper>
          <TabTitle>{`${friendName}'s Map`}</TabTitle>
          <TabLink
            to={`/${currentUser?.name}/my-friend/${friendName}/${friendId}/memories`}
          >{`${friendName}'s Memories`}</TabLink>
        </TabWrapper>
        <SplitWrapper>
          <LeftSplit />
          <RightSplit />
        </SplitWrapper>
      </Container>
      {showMemory && (
        <DetailMemoryOnMap
          selectedMarker={selectedMarker}
          setShowMemory={setShowMemory}
        />
      )}
    </>
  )
}

export default FriendsMap

import React from "react"
import { useParams } from "react-router-dom"
import { useState, useContext, useEffect, useRef } from "react"
import styled from "styled-components"
import L, { LeafletEvent } from "leaflet"
import {
  MapContainer,
  Tooltip,
  Marker,
  Popup,
  GeoJSON,
  ZoomControl,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { countries } from "../../utils/customGeo"
import homeMarker from "../../assets/markers/home1.png"
import { AuthContext } from "../../context/authContext"
import { db } from "../../utils/firebase"
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore"
import { DocumentData } from "@firebase/firestore-types"
import { DefinedDocumentData, PinContent } from "../../utils/pins"
import pins from "../../assets/markers/pins.png"
import DetailMemory from "../../components/pinContent/detailMemory"

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
  width: 120px;
  height: 120px;
`
const UserInfoArea = styled.div`
  display: flex;
  flex-flow: column nowrap;
  background-color: #ffffff;
  gap: 5px;
`
const AvatarImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`
export const PinInfoTitle = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 700;
`

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

const DefaultIcon = L.icon({
  iconUrl: homeMarker,
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

function FriendsMap() {
  const {
    isLoaded,
    currentUser,
    mapZoom,
    setIsMyMap,
    setIsMyMemory,
    setIsMyFriend,
    setIsFriendHome,
    setIsFriendMemory,
  } = useContext(AuthContext)

  const [friendInfo, setFriendInfo] = useState<DefinedDocumentData>()
  const [markers, setMarkers] = useState<
    DocumentData[] | DefinedDocumentData[] | PinContent[]
  >([])
  const [selectedMarker, setSelectedMarker] = useState<PinContent | undefined>()
  const [showMemory, setShowMemory] = useState(false)
  const [refReady, setRefReady] = useState(false)
  const { friendName, friendId } = useParams()
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!friendInfo || !markerRef.current) return
    if (markerRef.current instanceof L.Marker) {
      markerRef.current.openPopup()
    }
  }, [friendInfo, refReady, markerRef.current])

  useEffect(() => {
    const getFriendInfo = async () => {
      if (typeof friendId !== "string") return
      const docRef = doc(db, "users", friendId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setFriendInfo(docSnap.data())
      } else {
        console.log("No such document!")
      }
    }
    setIsMyMap(false)
    setIsMyMemory(false)
    setIsMyFriend(false)
    setIsFriendMemory(false)
    setIsFriendHome(true)
    getFriendInfo()
  }, [friendId])

  useEffect(() => {
    const getAllPinsOfFriend = async () => {
      const q = query(collection(db, "pins"), where("userId", "==", friendId))
      const querySnapshot = await getDocs(q)
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
          typeof friendInfo?.hometownLng === "number" &&
          typeof friendInfo?.photoURL === "string" && (
            <MapContainer
              id={`${friendName}-map`}
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
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
              ))}

              <Marker
                ref={(ref) => {
                  setRefReady(true)
                  markerRef.current = ref
                }}
                position={[friendInfo?.hometownLat, friendInfo?.hometownLng]}
              >
                <Popup offset={[0, -5]} keepInView>
                  <UserInfoArea>
                    <AvatarImg
                      src={friendInfo?.photoURL}
                      alt={`${friendInfo.name} avatar`}
                    />
                    {friendInfo.name}
                  </UserInfoArea>
                </Popup>

                <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                  Hometown {friendInfo?.hometownName}
                </Tooltip>
              </Marker>

              {markers?.map((marker: any) => {
                return (
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
                        {marker.albumURLs ? (
                          <PinInfoImg src={marker?.albumURLs[0]} />
                        ) : (
                          <PhotoText>No photo uploaded</PhotoText>
                        )}
                        <PinInfoTitle>{marker?.location?.name}</PinInfoTitle>
                      </PinInfoArea>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          )}
      </Container>
      {showMemory && (
        <DetailMemory
          selectedMarker={selectedMarker}
          setShowMemory={setShowMemory}
        />
      )}
    </>
  )
}

export default FriendsMap
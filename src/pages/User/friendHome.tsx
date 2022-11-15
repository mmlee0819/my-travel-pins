import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api"
import { AuthContext } from "../Context/authContext"
import {
  NavWrapper,
  Title,
  BtnLink,
  Container,
  TabWrapper,
  ContentArea,
  SplitWrapper,
} from "./myFriends"
import { PinInfoArea, PinInfoTitle, PinInfoImg } from "./myMap"
import {
  DefinedDocumentData,
  PinContent,
  choosePinOnMap,
} from "./ts_fn_commonUse"
import { db } from "../Utils/firebase"
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore"
import { darkMap } from "./darkMap"
import homeIcon from "./homeIcon.png"
import StreetView, { containerStyle } from "../Utils/gmap"
import defaultImage from "../assets/defaultImage.png"
import { DocumentData } from "@firebase/firestore-types"

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
const ContentWrapper = styled(ContentArea)`
  margin: 0 auto;
  padding: 15px;
  gap: 20px;
  border: none;
`

function FriendsHome() {
  const { isLoaded, isLogin, currentUser } = useContext(AuthContext)
  const [hometownText, setHometownText] = useState("")
  const [friendInfo, setFriendInfo] = useState<DefinedDocumentData>()
  const [markers, setMarkers] = useState<
    DocumentData[] | DefinedDocumentData[] | PinContent[]
  >([])
  const [selectedMarker, setSelectedMarker] = useState<PinContent>()
  const [showInfoWindow, setShowInfoWindow] = useState(false)
  const [showMemory, setShowMemory] = useState(false)
  console.log("hometownText", hometownText)
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
        setHometownText(docSnap.data().hometownName)
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
      const newMarkers: DefinedDocumentData[] | PinContent[] = []
      querySnapshot.forEach((doc) => {
        newMarkers.push(doc.data())
      })
      setMarkers(newMarkers)
    }
    getAllPinsOfFriend()
  }, [])
  const center = {
    lat: friendInfo?.hometownLat,
    lng: friendInfo?.hometownLng,
  }
  const onMkLoad = (marker: google.maps.Marker) => {
    console.log(" marker", marker)
  }
  const onInfoWinLoad = (infoWindow: google.maps.InfoWindow) => {
    console.log("infoWindow: ", infoWindow)
  }

  return (
    <Container>
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
      <ContentArea>
        <ContentWrapper>
          {isLoaded &&
          typeof friendInfo?.hometownLat === "number" &&
          typeof friendInfo?.hometownLng === "number" ? (
            <GoogleMap
              id={`${friendName}-map`}
              mapTypeId="94ce067fe76ff36f"
              mapContainerStyle={containerStyle}
              center={{
                lat: selectedMarker?.location?.lat || friendInfo?.hometownLat,
                lng: selectedMarker?.location?.lng || friendInfo?.hometownLng,
              }}
              zoom={selectedMarker ? 6 : 2}
              options={{ draggable: true, styles: darkMap }}
            >
              {typeof center?.lat === "number" &&
              typeof center?.lng === "number" ? (
                <Marker
                  onLoad={onMkLoad}
                  position={{
                    lat: friendInfo?.hometownLat,
                    lng: friendInfo?.hometownLng,
                  }}
                  icon={homeIcon}
                  onClick={() => {
                    if (typeof friendInfo?.hometownName === "string") {
                      setHometownText(friendInfo?.hometownName)
                    }
                  }}
                />
              ) : (
                ""
              )}
              {hometownText ? (
                <InfoWindow
                  onLoad={onInfoWinLoad}
                  position={{
                    lat: friendInfo?.hometownLat,
                    lng: friendInfo?.hometownLng,
                  }}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -50),
                  }}
                  onCloseClick={() => {
                    setHometownText("")
                  }}
                >
                  <PinInfoArea>
                    <PinInfoTitle>
                      {hometownText !== "" ? `Hometown ${hometownText}` : ""}
                    </PinInfoTitle>
                  </PinInfoArea>
                </InfoWindow>
              ) : (
                ""
              )}
              {markers?.map((marker) => {
                if (
                  typeof marker?.location?.lat !== "number" &&
                  typeof marker?.location?.lng !== "number"
                )
                  return
                return (
                  <Marker
                    key={marker?.location?.placeId}
                    onLoad={onMkLoad}
                    position={
                      new google.maps.LatLng(
                        marker.location.lat,
                        marker.location.lng
                      )
                    }
                    onClick={(e: google.maps.MapMouseEvent) => {
                      choosePinOnMap(
                        e,
                        markers,
                        setSelectedMarker,
                        setShowInfoWindow
                      )
                    }}
                  />
                )
              })}
              {selectedMarker &&
              typeof selectedMarker?.location?.lat === "number" &&
              typeof selectedMarker?.location?.lng === "number" ? (
                <>
                  <InfoWindow
                    onLoad={onInfoWinLoad}
                    onCloseClick={() => {
                      setSelectedMarker(undefined)
                    }}
                    position={{
                      lat: selectedMarker?.location?.lat,
                      lng: selectedMarker?.location?.lng,
                    }}
                    options={{
                      pixelOffset: new window.google.maps.Size(0, -40),
                    }}
                  >
                    <PinInfoArea
                      onClick={() => {
                        setShowMemory(true)
                      }}
                    >
                      <PinInfoImg
                        src={
                          selectedMarker.albumURLs
                            ? selectedMarker?.albumURLs[0]
                            : defaultImage
                        }
                      />
                      <PinInfoTitle>
                        {selectedMarker?.location?.name}
                      </PinInfoTitle>
                    </PinInfoArea>
                  </InfoWindow>
                  {selectedMarker && showInfoWindow && showMemory && (
                    <StreetView
                      selectedMarker={selectedMarker}
                      setShowMemory={setShowMemory}
                    />
                  )}
                </>
              ) : (
                ""
              )}
            </GoogleMap>
          ) : (
            "Please wait..."
          )}
        </ContentWrapper>
      </ContentArea>
    </Container>
  )
}
export default FriendsHome

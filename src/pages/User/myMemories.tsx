import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../Utils/firebase"
import { GoogleMap, Marker } from "@react-google-maps/api"
import trashBin from "./trashBin.png"
import defaultImage from "../assets/defaultImage.png"
import { AuthContext } from "../Context/authContext"
import { DocumentData } from "@firebase/firestore-types"

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 80%;
  margin: 0 auto;
`
const Title = styled.div`
  color: #000000;
`

const BtnLink = styled(Link)`
  margin: 0 20px;
`

const MemoryListWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 90%;
  margin: 10px auto;
  padding: 10px;
  gap: 20px;
  border: 1px solid #000000;
`
const MemoryList = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 150px;
  padding: 10px 0;
  gap: 20px;
`
const BtnDelete = styled.img`
  align-self: center;
  width: 40px;
  height: 40px;
`
const ImgsWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 120px;
  width: 50%;
  gap: 10px;
  border: none;
  overflow: overlay;
`
const MemoryImg = styled.img`
  width: 30%;
  height: 120px;
`
const ArticleWrapper = styled(MemoryListWrapper)`
  width: 200px;
  padding: 0 15px;
  font-size: 14px;
  gap: 10px;
  border: none;
`
const MapWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  text-align: center;
  height: 120px;
  width: 120px;
  font-size: 14px;
`
const BtnReadMore = styled.div`
  display: flex;
  align-self: end;
  text-align: center;
  padding: 5px;
  border: 1px solid #000000;
  border-radius: 5px;
  cursor: pointer;
`
function MyMemories() {
  const { currentUser, isLoaded } = useContext(AuthContext)
  const [memories, setMemories] = useState<DocumentData>([])
  const [hasFetched, setHasFetched] = useState(false)
  console.log(currentUser)
  console.log("memories", memories)

  useEffect(() => {
    const getPins = async () => {
      if (currentUser !== null && !hasFetched) {
        const pinsRef = collection(db, "pins")
        const q = query(pinsRef, where("userId", "==", currentUser?.id))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          setMemories((prev: DocumentData[]) => {
            return [...prev, doc.data()]
          })
        })
        setHasFetched(true)
      }
    }
    getPins()
  }, [currentUser])

  return (
    <>
      <Wrapper>
        <Title>我是user的回憶列表</Title>
        <BtnLink to="/">Home</BtnLink>
        <BtnLink to="/mika">My-map</BtnLink>
        <BtnLink to="/mika/my-friends">MY-friends</BtnLink>
      </Wrapper>
      {isLoaded ? (
        <MemoryListWrapper>
          {memories
            ? memories.map((memory: DocumentData) => {
                return (
                  <MemoryList key={memory.id}>
                    <BtnDelete src={trashBin} />
                    <MapWrapper>
                      <GoogleMap
                        mapContainerStyle={{ height: "100px", width: "120px" }}
                        center={{
                          lat: memory.location.lat,
                          lng: memory.location.lng,
                        }}
                        zoom={16}
                        options={{
                          draggable: true,
                          mapTypeControl: false,
                          streetViewControl: false,
                          scaleControl: false,
                          fullscreenControl: false,
                        }}
                      >
                        <Marker
                          position={{
                            lat: memory.location.lat,
                            lng: memory.location.lng,
                          }}
                        />
                      </GoogleMap>
                      <Title>{memory?.location?.name}</Title>
                    </MapWrapper>
                    <ImgsWrapper>
                      {memory?.album ? (
                        memory?.album?.map((photo: string) => {
                          return (
                            <MemoryImg key={photo.slice(0, -8)} src={photo} />
                          )
                        })
                      ) : (
                        <>
                          <MemoryImg src={defaultImage} />
                          <Title>No photo uploaded</Title>
                        </>
                      )}
                    </ImgsWrapper>
                    <ArticleWrapper>
                      <Title>{memory?.article?.travelDate}</Title>
                      <Title>{memory?.article?.title}</Title>
                      <Title>{memory?.article?.content}</Title>
                      <BtnReadMore>
                        {memory.article ? "Read more" : "Add memory"}
                      </BtnReadMore>
                    </ArticleWrapper>
                  </MemoryList>
                )
              })
            : ""}
        </MemoryListWrapper>
      ) : (
        <Title>Please wait...</Title>
      )}
    </>
  )
}

export default MyMemories

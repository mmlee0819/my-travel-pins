import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../Context/authContext"
import { GoogleMap, Marker } from "@react-google-maps/api"

import { getPins, getSpecificPin } from "./ts_fn_commonUse"
import {
  MapWrapper,
  ImgsWrapper,
  ArticleWrapper,
  BtnReadMore,
  MemoryImg,
} from "./myMemories"
import {
  ContentArea,
  ContentWrapper,
  DetailContentWrapper,
  DetailArticleWrapper,
  DetailImg,
  DetailImgsWrapper,
  DetailMapWrapper,
} from "./components/UIforMemoriesPage"
import { DocumentData } from "@firebase/firestore-types"
import defaultImage from "../assets/defaultImage.png"

const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  color: #2d2d2d;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 20px;
`
const Title = styled.div`
  color: #000000;
`
const MemoryListWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  padding: 10px;
  background-color: #ffffff;
  gap: 20px;
`
const MemoryList = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 150px;
  padding: 10px 0;
  background-color: #ffffff;
  gap: 20px;
`

function FriendMemories() {
  const { isLoaded, isLogin, currentUser } = useContext(AuthContext)
  const [memories, setMemories] = useState<DocumentData[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [memory, setMemory] = useState<DocumentData>()
  const [memoryIsShow, setMemoryIsShow] = useState(false)

  const url = window.location.href
  const splitUrlArr = url.split("/")
  const friendId = splitUrlArr.slice(-2, -1)[0]
  let friendName = splitUrlArr.slice(-3, -2)[0]
  if (friendName[0] === "%") {
    friendName = decodeURI(friendName)
  }
  useEffect(() => {
    getPins(currentUser, friendId, hasFetched, setHasFetched, setMemories)
  }, [friendId])

  return (
    <>
      <Container>
        <ContentArea>
          <ContentWrapper>
            {isLoaded ? (
              <MemoryListWrapper>
                {memories
                  ? memories.map((item) => {
                      return (
                        <DetailContentWrapper key={item.id}>
                          <MemoryList>
                            <MapWrapper>
                              <GoogleMap
                                mapContainerStyle={{
                                  height: "100px",
                                  width: "100%",
                                }}
                                center={{
                                  lat: item.location.lat,
                                  lng: item.location.lng,
                                }}
                                zoom={10}
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
                                    lat: item.location.lat,
                                    lng: item.location.lng,
                                  }}
                                />
                              </GoogleMap>
                              <Title>{item?.location?.name}</Title>
                            </MapWrapper>
                            <ImgsWrapper>
                              {item?.albumURLs ? (
                                item?.albumURLs?.map((photo: string) => {
                                  return (
                                    <MemoryImg
                                      key={photo.slice(0, -8)}
                                      src={photo}
                                    />
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
                              <Title>{item?.article?.travelDate}</Title>
                              <Title>{item?.article?.title}</Title>
                              <Title>{item?.article?.content}</Title>
                              <BtnReadMore
                                id={item?.id}
                                onClick={() => {
                                  if (memoryIsShow && memory?.id !== item?.id) {
                                    setMemoryIsShow(false)
                                    getSpecificPin(
                                      item?.id,
                                      setMemory,
                                      setMemoryIsShow
                                    )
                                  } else if (
                                    memoryIsShow &&
                                    memory?.id === item?.id
                                  ) {
                                    setMemoryIsShow(false)
                                  } else {
                                    getSpecificPin(
                                      item?.id,
                                      setMemory,
                                      setMemoryIsShow
                                    )
                                  }
                                }}
                              >
                                {item?.article?.content !== ""
                                  ? "Read more"
                                  : "Add memory"}
                              </BtnReadMore>
                            </ArticleWrapper>
                          </MemoryList>
                          {memory && memoryIsShow && memory.id === item.id ? (
                            <DetailContentWrapper
                              key={`${memory.id}-${memory.location.placeId}`}
                            >
                              <DetailArticleWrapper>
                                <Title>{memory?.article?.travelDate}</Title>
                                <Title>{memory?.article?.title}</Title>
                              </DetailArticleWrapper>
                              <Title>{memory?.article?.content}</Title>
                              <DetailImgsWrapper>
                                {memory?.albumURLs &&
                                  memory?.albumURLs?.length !== 0 &&
                                  memory?.albumURLs.map((photoUrl: string) => {
                                    return (
                                      <DetailImg
                                        key={photoUrl}
                                        bkImage={photoUrl}
                                      />
                                    )
                                  })}
                              </DetailImgsWrapper>
                              {memoryIsShow ? (
                                <DetailMapWrapper>
                                  <Title>{memory?.location?.name}</Title>
                                  <GoogleMap
                                    mapContainerStyle={{
                                      height: "300px",
                                      width: "100%",
                                    }}
                                    center={{
                                      lat: memory.location.lat,
                                      lng: memory.location.lng,
                                    }}
                                    zoom={14}
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
                                </DetailMapWrapper>
                              ) : (
                                ""
                              )}
                            </DetailContentWrapper>
                          ) : (
                            ""
                          )}
                        </DetailContentWrapper>
                      )
                    })
                  : ""}
              </MemoryListWrapper>
            ) : (
              <Title>Please wait...</Title>
            )}
          </ContentWrapper>
        </ContentArea>
      </Container>
    </>
  )
}
export default FriendMemories

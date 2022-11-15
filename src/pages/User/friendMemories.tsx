import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../Context/authContext"
import { GoogleMap, Marker } from "@react-google-maps/api"
import {
  Container,
  ContentArea,
  Title,
  TabWrapper,
  SplitWrapper,
} from "./myFriends"
import { getPins, getSpecificPin } from "./ts_fn_commonUse"
import {
  MapWrapper,
  ImgsWrapper,
  ArticleWrapper,
  BtnReadMore,
  MemoryImg,
} from "./myMemories"
import {
  DetailMapWrapper,
  DetailImgsWrapper,
  DetailArticleWrapper,
  DetailContentWrapper,
  DetailImg,
} from "./components/UIforMemoriesPage"
import { DocumentData } from "@firebase/firestore-types"
import defaultImage from "../assets/defaultImage.png"

const ContentWrapper = styled(ContentArea)`
  margin: 0 auto;
  padding: 15px;
  background-color: #ffffff;
  gap: 20px;
  border: none;
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
  width: 154px;
  border-top: 1px solid #beb9b9;
`
const RightSplit = styled(LeftSplit)`
  flex: 1 1 auto;
  margin-left: 128px;
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
        <TabWrapper>
          <TabLink
            to={`/${currentUser?.name}/my-friend/${friendName}/${friendId}`}
          >{`${friendName}'s Map`}</TabLink>
          <TabTitle>{`${friendName}'s Memories`}</TabTitle>
        </TabWrapper>
        <SplitWrapper>
          <LeftSplit />
          <RightSplit />
        </SplitWrapper>
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

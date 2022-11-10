import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useState, useContext, useEffect } from "react"
import { AuthContext } from "../Context/authContext"
import { GoogleMap, Marker } from "@react-google-maps/api"
import {
  NavWrapper,
  Title,
  BtnLink,
  Container,
  TabWrapper,
  ContentArea,
  SplitWrapper,
  ContentWrapper,
} from "./myFriends"
import { DefinedDocumentData, getPins, getSpecificPin } from "./commonUse"
import {
  MemoryListWrapper,
  MemoryList,
  ImgsWrapper,
  ArticleWrapper,
  MapWrapper,
  BtnReadMore,
  MemoryImg,
} from "./myMemories"
import { DocumentData } from "@firebase/firestore-types"
import defaultImage from "../assets/defaultImage.png"

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
  console.log(currentUser)
  console.log("memories", memories)
  console.log("memory", memory)
  const url = window.location.href
  const splitUrlArr = url.split("/")
  const friendId = splitUrlArr.slice(-2, -1)[0]
  const friendName = splitUrlArr.slice(-3, -2)[0]
  useEffect(() => {
    getPins(currentUser, friendId, hasFetched, setHasFetched, setMemories)
  }, [friendId])

  return (
    <>
      <NavWrapper>
        {isLogin && currentUser !== undefined ? (
          <>
            <Title>我是user的好友列表</Title>
            <BtnLink to="/">HOME</BtnLink>
            <BtnLink to={`/${currentUser?.name}`}>My-map</BtnLink>
            <BtnLink to={`/${currentUser?.name}/my-memories`}>
              my-memories
            </BtnLink>
          </>
        ) : (
          <Title>你沒有登入</Title>
        )}
      </NavWrapper>
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
                        <MemoryList key={item.id}>
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
                                getSpecificPin(
                                  item?.id,
                                  setMemory,
                                  setMemoryIsShow
                                )
                              }}
                            >
                              {item?.article?.content !== ""
                                ? "Read more"
                                : "Add memory"}
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
          </ContentWrapper>
        </ContentArea>
      </Container>
    </>
  )
}
export default FriendMemories

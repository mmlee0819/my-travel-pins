import React from "react"
import styled from "styled-components"
import { useState, useContext, useEffect } from "react"
import { doc, deleteDoc } from "firebase/firestore"
import { db, storage } from "../Utils/firebase"
import { GoogleMap, Marker } from "@react-google-maps/api"
import trashBin from "./trashBin.png"
import defaultImage from "../assets/defaultImage.png"
import { AuthContext } from "../Context/authContext"
import { DocumentData } from "@firebase/firestore-types"
import { ref, deleteObject } from "firebase/storage"
import { getPins, getSpecificPin } from "./ts_fn_commonUse"
import {
  Container,
  ContentArea,
  ContentWrapper,
  DetailContentWrapper,
  DetailArticleWrapper,
  DetailImg,
  DetailImgsWrapper,
  DetailMapWrapper,
  TabWrapper,
  TabLink,
  TabTitle,
} from "./components/UIforMemoriesPage"

const Title = styled.div`
  color: #000000;
`

export const MemoryListWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin: 10px auto;
  padding: 10px;
  gap: 20px;
`

export const MemoryList = styled.div`
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
  cursor: pointer;
`

export const ImgsWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 120px;
  width: 50%;
  gap: 10px;
  border: none;
  overflow: overlay;
`
export const MemoryImg = styled.img`
  width: 30%;
  height: 120px;
`
export const ArticleWrapper = styled(MemoryListWrapper)`
  width: 200px;
  padding: 0 15px;
  font-size: 14px;
  gap: 10px;
  border: none;
`
export const MapWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  text-align: center;
  height: 100%;
  width: 20%;
  font-size: 14px;
`
export const BtnReadMore = styled.div`
  display: flex;
  align-self: end;
  text-align: center;
  padding: 5px;
  border: 1px solid #000000;
  border-radius: 5px;
  cursor: pointer;
`
const LeftSplit = styled.div`
  width: 116px;
  border-top: 1px solid #beb9b9;
`
const RightSplit = styled(LeftSplit)`
  flex: 1 1 auto;
  margin-left: 129px;
`
export default function MyMemories() {
  const { currentUser, isLoaded, isLogin } = useContext(AuthContext)
  const [memories, setMemories] = useState<DocumentData>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [memory, setMemory] = useState<DocumentData>()
  const [memoryIsShow, setMemoryIsShow] = useState(false)
  const [qResultIds, setQResultIds] = useState<string[]>([])
  console.log(currentUser)
  console.log("memories", memories)

  const deleteMemory = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    try {
      const folderName = `${memories[0].userId.slice(
        0,
        4
      )}-${memories[0].location.placeId.slice(0, 4)}`

      const newMemories = memories.filter((memory: DocumentData) => {
        return memory.id !== (e.target as Element).id
      })
      const chosenMemory = memories.filter((memory: DocumentData) => {
        return memory.id === (e.target as Element).id
      })
      if (chosenMemory[0].albumNames) {
        chosenMemory[0].albumNames.map(async (fileName: string) => {
          await deleteObject(ref(storage, `/${folderName}/${fileName}`))
        })
      }
      const docRef = doc(db, "pins", (e.target as Element).id)
      await deleteDoc(docRef)
      setMemories(newMemories)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (
      currentUser !== undefined &&
      currentUser !== null &&
      typeof currentUser?.id === "string"
    ) {
      getPins(
        currentUser,
        currentUser?.id,
        hasFetched,
        setHasFetched,
        setMemories
      )
    }
  }, [currentUser?.id])

  return (
    <Container>
      <TabWrapper>
        <TabLink to={`/${currentUser?.name}`}>My map</TabLink>
        <TabTitle>My Memories</TabTitle>
        <TabLink to={`/${currentUser?.name}/my-friends`}>My friends</TabLink>
      </TabWrapper>

      <ContentArea>
        <ContentWrapper>
          {isLoaded ? (
            <MemoryListWrapper>
              {memories &&
                memories.map((item: DocumentData) => {
                  return (
                    <DetailContentWrapper key={item.id}>
                      <MemoryList>
                        <BtnDelete
                          src={trashBin}
                          id={item.id}
                          onClick={(e) => {
                            deleteMemory(e)
                          }}
                        />
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
                      {memory && memoryIsShow && memory?.id === item.id && (
                        <DetailContentWrapper
                          key={`${memory?.id}-${memory?.location.placeId}`}
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
                          {memoryIsShow && (
                            <DetailMapWrapper>
                              <Title>{memory?.location?.name}</Title>
                              <GoogleMap
                                mapContainerStyle={{
                                  height: "300px",
                                  width: "100%",
                                }}
                                center={{
                                  lat: memory?.location.lat,
                                  lng: memory?.location.lng,
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
                                    lat: memory?.location.lat,
                                    lng: memory?.location.lng,
                                  }}
                                />
                              </GoogleMap>
                            </DetailMapWrapper>
                          )}
                        </DetailContentWrapper>
                      )}
                    </DetailContentWrapper>
                  )
                })}
            </MemoryListWrapper>
          ) : (
            <Title>Please wait...</Title>
          )}
        </ContentWrapper>
      </ContentArea>
    </Container>
  )
}

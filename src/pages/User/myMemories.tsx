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
  ContentWrapper,
  DetailContentWrapper,
  DetailArticleWrapper,
  DetailImg,
  DetailImgsWrapper,
  DetailMapWrapper,
  Container,
  ContentArea,
} from "./components/UIforMemoriesPage"

const Text = styled.div`
  color: ${(props) => props.theme.color.bgDark};
  min-width: 30%;
`
const Title = styled(Text)`
  font-weight: 700;
  font-size: 24px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 18px;
  }
`

export const MemoryListWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  margin: 10px auto;
  width: 100%;
  padding: 10px;
  gap: 20px;
`

export const MemoryList = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 450px;
  padding: 10px 0;
  gap: 20px;
`
const BtnWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  margin-right: 10px;
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
  background-color: #3490ca;
  border-radius: 3px;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 16px;
  }
`
const BtnRed = styled(BtnBlue)`
  background-color: #ca3434;
`

const BtnDelete = styled.img`
  align-self: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
`

const ImgWrapper = styled.div`
  position: relative;
  display: block;
  width: 40%;
`
const MemoryImg = styled.img`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
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
  height: 50%;
  padding: 20px;
  background-color: #fff;
  z-index: 52;
`
const ReminderText = styled.div`
  font-family: "Jomhuria";
  margin: 20px auto 0 auto;
  text-align: center;
  font-size: 40px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 30px;
  }
`
const DeleteTargetText = styled(Title)`
  text-align: center;
  margin-bottom: 40px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    margin-bottom: 30px;
  }
`

export const ArticleWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  min-width: 40%;
  margin: 10px 0;
  font-family: "Poppins";
  font-size: 20px;
  gap: 20px;
  border: none;

  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    gap: 10px;
    font-size: 16px;
  }
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

export default function MyMemories() {
  const { currentUser, isLoaded, isLogin } = useContext(AuthContext)
  const [memories, setMemories] = useState<DocumentData>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [memory, setMemory] = useState<DocumentData>()
  const [memoryIsShow, setMemoryIsShow] = useState(false)
  const [qResultIds, setQResultIds] = useState<string[]>([])
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<
    number | undefined
  >(undefined)

  const deleteMemory = async (index: number) => {
    try {
      const folderName = `${memories[0].userId.slice(
        0,
        4
      )}-${memories[0].location.placeId.slice(0, 4)}`

      const newMemories = memories.filter((memory: DocumentData) => {
        return memory.id !== memories[index].id
      })
      const chosenMemory = memories.filter((memory: DocumentData) => {
        return memory.id === memories[index].id
      })
      if (chosenMemory[0].albumNames) {
        chosenMemory[0].albumNames.map(async (fileName: string) => {
          await deleteObject(ref(storage, `/${folderName}/${fileName}`))
        })
      }
      const docRef = doc(db, "pins", memories[index].id)
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
      <ContentArea>
        <ContentWrapper>
          {isLoaded && memories ? (
            memories.map((item: DocumentData, index: number) => {
              console.log(item)
              return (
                <>
                  <MemoryList key={item.id}>
                    <ImgWrapper>
                      {item?.albumURLs ? (
                        <MemoryImg src={item?.albumURLs[0]} />
                      ) : (
                        <>
                          <MemoryImg src={defaultImage} />

                          <Text>No photo uploaded</Text>
                        </>
                      )}
                    </ImgWrapper>
                    <ArticleWrapper>
                      <Title>{item?.article?.title}</Title>
                      <Text>{item?.article?.travelDate}</Text>
                      <Text>{item?.location?.name}</Text>
                      {/* <Title>{item?.article?.content}</Title> */}
                      <BtnWrapper>
                        <BtnBlue
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
                        </BtnBlue>
                        <BtnDelete
                          id={item.id}
                          src={trashBin}
                          onClick={(e) => {
                            setDeleteTargetIndex(index)
                          }}
                        />
                      </BtnWrapper>
                    </ArticleWrapper>
                    {deleteTargetIndex !== undefined &&
                      deleteTargetIndex === index && (
                        <>
                          <BgOverlay
                            onClick={() => {
                              setDeleteTargetIndex(undefined)
                            }}
                          />
                          <ReminderArea>
                            <ReminderText>
                              Are your sure <br />
                              you want to delete this memory?
                            </ReminderText>
                            <DeleteTargetText>
                              {memories[index]?.article?.title}
                            </DeleteTargetText>
                            <BtnWrapper>
                              <BtnRed
                                onClick={() => {
                                  deleteMemory(index)
                                  setDeleteTargetIndex(undefined)
                                }}
                              >
                                Confirm to delete
                              </BtnRed>
                              <BtnBlue
                                onClick={() => {
                                  setDeleteTargetIndex(undefined)
                                }}
                              >
                                Cancel
                              </BtnBlue>
                            </BtnWrapper>
                          </ReminderArea>
                        </>
                      )}
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
                              <DetailImg key={photoUrl} bkImage={photoUrl} />
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
                </>
              )
            })
          ) : (
            <Title>Please wait...</Title>
          )}
        </ContentWrapper>
      </ContentArea>
    </Container>
  )
}

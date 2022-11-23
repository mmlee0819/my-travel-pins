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
import DetailMemory from "../Components/detailMemory"
import { getPins, getSpecificPin, PinContent } from "./ts_fn_commonUse"
import {
  ContentWrapper,
  Container,
  ContentArea,
  ArticleWrapper,
  ImgWrapper,
  MemoryImg,
  MemoryList,
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
  const [memories, setMemories] = useState<PinContent[]>([])
  const [hasFetched, setHasFetched] = useState(false)
  const [memory, setMemory] = useState<PinContent>()
  const [memoryIsShow, setMemoryIsShow] = useState(false)
  const [qResultIds, setQResultIds] = useState<string[]>([])
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<
    number | undefined
  >(undefined)

  const deleteMemory = async (index: number) => {
    console.log({ memory })
    try {
      if (typeof memories[0].userId !== "string") return
      const folderName = `${memories[0].userId.slice(
        0,
        4
      )}-${memories[0].location.placeId.slice(0, 4)}`

      const newMemories = memories.filter((memory: PinContent) => {
        return memory.id !== memories[index].id
      })
      const chosenMemory = memories.filter((memory: PinContent) => {
        return memory.id === memories[index].id
      })
      if (chosenMemory[0].albumNames) {
        chosenMemory[0].albumNames.map(async (fileName: string) => {
          await deleteObject(ref(storage, `/${folderName}/${fileName}`))
        })
      }
      if (typeof memory?.id !== "string") return
      const docRef = doc(db, "pins", memory?.id)
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
          {isLogin && isLoaded && memories ? (
            memories.map((item: PinContent, index: number) => {
              return (
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
                    <BtnWrapper>
                      <BtnBlue
                        id={item?.id}
                        onClick={() => {
                          if (typeof item.id !== "string") return
                          setMemoryIsShow(true)
                          setMemory(item)
                          getSpecificPin(item?.id, setMemory, setMemoryIsShow)
                        }}
                      >
                        {item?.article?.content !== ""
                          ? "Read more"
                          : "Add memory"}
                      </BtnBlue>
                      <BtnDelete
                        id={item.id}
                        src={trashBin}
                        onClick={() => {
                          setMemory(item)
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
                            Are you sure <br />
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
              )
            })
          ) : (
            <Title>Please wait...</Title>
          )}
        </ContentWrapper>
      </ContentArea>
      {memoryIsShow && memory && memory.location && (
        <DetailMemory selectedMarker={memory} setShowMemory={setMemoryIsShow} />
      )}
    </Container>
  )
}

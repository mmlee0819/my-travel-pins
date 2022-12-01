import React from "react"
import styled from "styled-components"
import { useState, useContext, useEffect } from "react"
import { doc, deleteDoc } from "firebase/firestore"
import { db, storage } from "../Utils/firebase"
import { AuthContext } from "../Context/authContext"
import { ref, deleteObject } from "firebase/storage"
import DetailMemory from "../Components/detailMemory"
import {
  getPins,
  getSpecificPin,
  PinContent,
  checkRealTimePinsInfo,
} from "./functions/pins"
import {
  ContentWrapper,
  Container,
  ContentArea,
  ArticleWrapper,
  ImgWrapper,
  MemoryImg,
  MemoryList,
  Text,
  Title,
  PhotoText,
  IconInList,
} from "./components/UIforMemoriesPage"
import trashBinBlack from "../assets/buttons/trashBinBlack.png"
import calendar from "../assets/calendar.png"
import location from "../assets/location.png"
import spinner from "../assets/dotsSpinner.svg"

const Spinner = styled.div`
  width: 100%;
  height: 30px;
  margin: 0 auto;
  background-image: url(${spinner});
  background-size: 100% 100%;
  background-color: rgb(255, 255, 255, 0);
  border: none;
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
  font-size: ${(props) => props.theme.title.md};
  color: #ffffff;
  background-color: ${(props) => props.theme.btnColor.bgBlue};
  border-radius: 5px;
  cursor: pointer;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`
const BtnRed = styled(BtnBlue)`
  background-color: ${(props) => props.theme.btnColor.bgRed};
`

const BtnDelete = styled.img`
  align-self: center;
  width: 30px;
  height: 30px;
  cursor: pointer;
`

const BgOverlay = styled.div`
  position: absolute;
  top: 3px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.color.bgDark};
  border-radius: 5px;
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
  color: ${(props) => props.theme.color.bgDark};
  background-color: #fff;
  border-radius: 5px;
  z-index: 52;
`
const ReminderText = styled.div`
  margin: 20px auto 0 auto;
  text-align: center;
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
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

  console.log({ memories })

  const deleteMemory = async (index: number) => {
    console.log({ memory })
    try {
      if (typeof memories[0].userId !== "string") return
      const folderName = `${memories[0].userId.slice(
        0,
        4
      )}-${memory?.location?.placeId.slice(0, 6)}`

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
      setMemory(undefined)
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
      checkRealTimePinsInfo(currentUser?.id, setMemories)
      return checkRealTimePinsInfo(currentUser?.id, setMemories)
    }
  }, [currentUser?.id])

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
  }, [currentUser?.id, memories])

  return (
    <Container>
      <ContentArea>
        <ContentWrapper>
          {isLogin && isLoaded && memories ? (
            memories.map((item: PinContent, index: number) => {
              return (
                <MemoryList key={item.id}>
                  <ImgWrapper
                    id={item?.id}
                    onClick={() => {
                      if (typeof item.id !== "string") return
                      setMemoryIsShow(true)
                      setMemory(item)
                      getSpecificPin(item?.id, setMemory, setMemoryIsShow)
                    }}
                  >
                    {item?.albumURLs ? (
                      <MemoryImg src={item?.albumURLs[0]} />
                    ) : (
                      <PhotoText>No photo uploaded</PhotoText>
                    )}
                  </ImgWrapper>
                  <ArticleWrapper>
                    <Title
                      id={item?.id}
                      onClick={() => {
                        if (typeof item.id !== "string") return
                        setMemoryIsShow(true)
                        setMemory(item)
                        getSpecificPin(item?.id, setMemory, setMemoryIsShow)
                      }}
                    >
                      {item?.article?.title === undefined ||
                      item?.article?.title === ""
                        ? "Untitled"
                        : item?.article?.title}
                    </Title>
                    <Text>
                      <IconInList src={calendar} />
                      {item?.article?.travelDate}
                    </Text>

                    <Text>
                      <IconInList src={location} />
                      {item?.location?.name}
                    </Text>
                  </ArticleWrapper>
                  <BtnDelete
                    id={item.id}
                    src={trashBinBlack}
                    onClick={() => {
                      setMemory(item)
                      setDeleteTargetIndex(index)
                    }}
                  />
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
                            {memories[index]?.article?.title || "Untitled"}
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
            <Title>
              <Spinner />
            </Title>
          )}
        </ContentWrapper>
      </ContentArea>
      {memoryIsShow && memory && memory.location && (
        <DetailMemory selectedMarker={memory} setShowMemory={setMemoryIsShow} />
      )}
    </Container>
  )
}

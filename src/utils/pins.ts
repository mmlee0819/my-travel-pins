import { Dispatch, SetStateAction } from "react"
import { db } from "./firebase"
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  collection,
  where,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore"
import { DocumentData } from "@firebase/firestore-types"
import { UserInfoType } from "../context/authContext"
import { notifyError } from "../components/reminder"

export interface DefinedDocumentData {
  [field: string]: string | number | null | undefined | string[]
}

export interface PinContent {
  id: string
  userId: string
  location: {
    placeId: string
    lat: number
    lng: number
    name: string
  }
  albumNames: string[]
  albumURLs: string[]
  article: {
    title: string
    content?: string
    travelDate: string
  }
  postTimestamp?: number
  postReadableTime?: Date | string
}

export interface MessagesType {
  messenger: string
  msgContent: string
  msgTimestamp: number
  msgReadableTime: string
  name: string
  photoURL: string
}

export const getPins = async (
  currentUser: UserInfoType | DocumentData | undefined,
  id: string,
  hasFetched: boolean,
  setHasFetched: Dispatch<SetStateAction<boolean>>,
  setMemories: Dispatch<SetStateAction<PinContent[]>>
) => {
  if (currentUser !== null && !hasFetched) {
    const newMemories: DocumentData[] = []
    const pinsRef = collection(db, "pins")
    const q = query(pinsRef, where("userId", "==", id))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      newMemories.push(doc.data() as PinContent)
    })
    newMemories.sort((a, b) => {
      return b.postReadableTime.seconds - a.postReadableTime.seconds
    })
    setMemories(newMemories as PinContent[])
    setHasFetched(true)
  }
}

export const choosePinOnMap = (
  e: google.maps.MapMouseEvent,
  markers: DocumentData[],
  setSelectedMarker: Dispatch<
    SetStateAction<DocumentData | PinContent | undefined>
  >,
  setShowInfoWindow: Dispatch<SetStateAction<boolean>>
) => {
  const filteredMarker = markers.filter((marker) => {
    return (
      marker.location.lat === e.latLng?.lat() &&
      marker.location.lng === e.latLng?.lng()
    )
  })
  setSelectedMarker(filteredMarker[0])
  setShowInfoWindow(true)
}

export const getSpecificPin = async (
  pinId: string,
  setMemory: Dispatch<SetStateAction<PinContent | undefined>>,
  setMemoryIsShow: Dispatch<SetStateAction<boolean>>
) => {
  const docRef = doc(db, "pins", pinId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    setMemory(docSnap.data() as PinContent)
    setMemoryIsShow(true)
  } else {
    notifyError(
      "Sorry, we can not find this memory record, please contact mika@test.com"
    )
  }
}

export const addMsg = async (
  messengerId: string,
  id: string,
  refValue: string
) => {
  if (refValue.trim() === "") return
  try {
    const pinRef = doc(db, "pins", id)
    await updateDoc(pinRef, {
      messages: arrayUnion({
        messenger: messengerId,
        msgContent: refValue,
        msgReadableTime: new Date(),
        msgTimestamp: Date.now(),
      }),
    })
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = error["message"].slice(9) as string
      notifyError(
        `Failed to add new message, please take a note of ${errorMsg} and contact mika@test.com`
      )
    }
  }
}

export const checkRealTimePinsInfo = (
  id: string,
  setMemories: Dispatch<SetStateAction<PinContent[]>>
) => {
  const q = query(collection(db, "pins"), where("userId", "==", id))
  return onSnapshot(q, (querySnapshot) => {
    const newMemories: DocumentData[] = []
    querySnapshot.forEach((doc) => {
      newMemories.push(doc.data() as PinContent)
    })
    newMemories.sort((a, b) => {
      return b?.postReadableTime?.seconds - a?.postReadableTime?.seconds
    })
    setMemories(newMemories as PinContent[])
  })
}
export const checkRealTimePhotos = (
  id: string,
  setAlbumUrls: Dispatch<SetStateAction<string[]>>
) => {
  return onSnapshot(doc(db, "pins", id), (snapshotData: DocumentData) => {
    if (snapshotData.data() && snapshotData.data().albumURLs) {
      const newPhotos: string[] = snapshotData.data().albumURLs
      setAlbumUrls(newPhotos)
    }
  })
}

export const checkRealTimePinMessages = (
  id: string,
  setMessages: Dispatch<SetStateAction<DocumentData[]>>
) => {
  return onSnapshot(doc(db, "pins", id), (messageData: DocumentData) => {
    const fetchMessengers = async () => {
      if (
        messageData.data() === undefined ||
        messageData.data().messages === undefined
      )
        return
      const newMessages: MessagesType[] = messageData.data().messages
      if (newMessages === undefined) return
      await Promise.all(
        newMessages.map(
          async (item: DocumentData | MessagesType, index: number) => {
            const docRef = doc(db, "users", item.messenger)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
              newMessages[index].name = docSnap.data().name
              newMessages[index].photoURL = docSnap.data().photoURL
            }
          }
        )
      )
      setMessages(newMessages)
    }
    fetchMessengers()
  })
}

export const deleteMsg = async (id: string, item: DocumentData) => {
  try {
    const pinRef = doc(db, "pins", id)
    await updateDoc(pinRef, {
      messages: arrayRemove({
        messenger: item.messenger,
        msgContent: item.msgContent,
        msgReadableTime: item.msgReadableTime,
        msgTimestamp: item.msgTimestamp,
      }),
    })
  } catch (error) {
    if (error instanceof Error) {
      const errorMsg = error["message"].slice(9) as string
      notifyError(
        `Failed to delete a message, please take a note of ${errorMsg} and contact mika@test.com`
      )
    }
  }
}

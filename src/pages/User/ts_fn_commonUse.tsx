import { Dispatch, SetStateAction } from "react"
import { db } from "../Utils/firebase"
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
import { UserInfoType } from "../Context/authContext"

export interface DefinedDocumentData {
  [field: string]: string | number | null | undefined | string[]
}

export interface PinContent {
  id?: string
  userId?: string
  name?: string
  placeId?: string
  location: {
    placeId: string
    lat: number
    lng: number
    name: string
  }
  albumNames?: string[]
  albumURLs?: string[]
  article?: {
    title?: string
    content?: string
    travelDate?: string
  }
  postTimestamp?: number
  postReadableTime?: string
}

export interface MessagesType {
  messenger: string
  msgContent: string
  msgTimestamp: number
  msgReadableTime: string
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
    console.log("q", q)
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      newMemories.push(doc.data() as PinContent)
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
    console.log("Document data:", docSnap.data())
    setMemory(docSnap.data() as PinContent)
    setMemoryIsShow(true)
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!")
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
    console.log(error)
  }
}

export const checkRealTimePinsInfo = (
  id: string,
  setMemories: Dispatch<SetStateAction<PinContent[]>>
) => {
  const q = query(collection(db, "pins"), where("userId", "==", id))
  onSnapshot(q, (querySnapshot) => {
    const newMemories: PinContent[] = []
    querySnapshot.forEach((doc) => {
      newMemories.push(doc.data() as PinContent)
    })
    setMemories(newMemories)
  })
}
export const checkRealTimePinMessages = (
  id: string,
  setMessages: Dispatch<SetStateAction<DocumentData[]>>
) => {
  onSnapshot(doc(db, "pins", id), (doc: DocumentData) => {
    setMessages(doc.data().messages)
  })
}

export const queryMessengerInfo = async (
  id: string,
  setMessengerInfo: Dispatch<SetStateAction<DocumentData[]>>
) => {
  try {
    const docRef = doc(db, "users", id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      setMessengerInfo((prev) => {
        return [
          ...prev,
          { name: docSnap.data().name, photoURL: docSnap.data().photoURL },
        ]
      })
      console.log("Document data:", docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!")
    }
  } catch (error) {
    console.log(error)
  }
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
    console.log(error)
  }
}

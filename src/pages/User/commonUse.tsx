import React, { Dispatch, SetStateAction } from "react"
import { db } from "../Utils/firebase"
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
  Timestamp,
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
  location?: {
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
  postTime?: Timestamp
  postReadableTime?: string
}

export const getPins = async (
  currentUser: UserInfoType | DocumentData | undefined,
  id: string,
  hasFetched: boolean,
  setHasFetched: Dispatch<SetStateAction<boolean>>,
  setMemories: Dispatch<SetStateAction<DocumentData[]>>
) => {
  if (currentUser !== null && !hasFetched) {
    const newMemories: DocumentData[] = []
    const pinsRef = collection(db, "pins")
    const q = query(pinsRef, where("userId", "==", id))
    console.log("q", q)
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      newMemories.push(doc.data())
    })
    setMemories(newMemories)
    setHasFetched(true)
  }
}

export const choosePinOnMap = (
  e: google.maps.MapMouseEvent,
  markers: DocumentData[],
  setSelectedMarker: Dispatch<
    SetStateAction<DocumentData | PinContent | undefined>
  >
) => {
  const filteredMarker = markers.filter((marker) => {
    return (
      marker.location.lat === e.latLng?.lat() &&
      marker.location.lng === e.latLng?.lng()
    )
  })
  setSelectedMarker(filteredMarker[0])
}

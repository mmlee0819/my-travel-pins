import React from "react"
import { createContext, useState,  ReactNode } from "react"
import { DocumentData } from "@firebase/firestore-types"
import { db } from "../Utils/firebase"
import { doc, getDoc } from "firebase/firestore"

interface ToolContextType {
  currenciesData: DocumentData | undefined
  setCurrenciesData: (currenciesData: DocumentData | undefined) => void
  getRatesData: () => void
}
export const ToolContext = createContext<ToolContextType>({
  currenciesData: {},
  setCurrenciesData: (currenciesData: DocumentData | undefined) => Response,
  getRatesData: () => Response,
})
interface Props {
  children?: ReactNode
}
export const ToolContextProvider = ({ children }: Props) => {
  const [currenciesData, setCurrenciesData] = useState<
    DocumentData | undefined
  >({})
  const today = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`
  const docRef = doc(db, "currencies", today)

  const getRatesData = async () => {
    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setCurrenciesData(data)
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ToolContext.Provider
      value={{
        currenciesData,
        setCurrenciesData,
        getRatesData,
      }}
    >
      {children}
    </ToolContext.Provider>
  )
}

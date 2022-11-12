import React from "react"
import { createContext, useState, ReactNode } from "react"
import { DocumentData } from "@firebase/firestore-types"

interface ToolContextType {
  convertResult: number
  currentRate: number
  setCurrentRate: (currentRate: number) => void
  setConvertResult: (convertResult: number) => void
  selectedFrom: {
    id: string
    flag: string
    currency: string
  }
  setSelectedFrom: (selectedTo: {
    id: string
    flag: string
    currency: string
  }) => void
  selectedTo: {
    id: string
    flag: string
    currency: string
  }
  setSelectedTo: (selectedTo: {
    id: string
    flag: string
    currency: string
  }) => void
}

export const ToolContext = createContext<ToolContextType>({
  setCurrentRate: (currentRate: number) => Response,
  setConvertResult: (convertResult: number) => Response,
  convertResult: 0,
  currentRate: 0,
  selectedFrom: {
    id: "",
    flag: "",
    currency: "",
  },
  setSelectedFrom: (selectedTo: {
    id: string
    flag: string
    currency: string
  }) => Response,
  selectedTo: {
    id: "",
    flag: "",
    currency: "",
  },
  setSelectedTo: (selectedTo: { id: string; flag: string; currency: string }) =>
    Response,
})
interface Props {
  children?: ReactNode
}
export const ToolContextProvider = ({ children }: Props) => {
  const [currenciesData, setCurrenciesData] = useState<
    DocumentData | undefined
  >({})
  const [currentRate, setCurrentRate] = useState(0)
  const [convertResult, setConvertResult] = useState(0)
  const [selectedFrom, setSelectedFrom] = useState({
    id: "",
    flag: "",
    currency: "",
  })
  const [selectedTo, setSelectedTo] = useState({
    id: "",
    flag: "",
    currency: "",
  })

  return (
    <ToolContext.Provider
      value={{
        convertResult,
        currentRate,
        setCurrentRate,
        setConvertResult,
        selectedFrom,
        setSelectedFrom,
        selectedTo,
        setSelectedTo,
      }}
    >
      {children}
    </ToolContext.Provider>
  )
}

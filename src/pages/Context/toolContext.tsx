import React from "react"
import { createContext, useState, ReactNode } from "react"
import { DocumentData } from "@firebase/firestore-types"
import usa from "../assets/flags/usa.png"
import taiwan from "../assets/flags/taiwan.png"

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
    id: "TWD",
    flag: taiwan,
    currency: "TWD (台幣)",
  },
  setSelectedFrom: (selectedTo: {
    id: string
    flag: string
    currency: string
  }) => Response,
  selectedTo: {
    id: "USD",
    flag: usa,
    currency: "USD (美金)",
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
    id: "TWD",
    flag: taiwan,
    currency: "TWD (台幣)",
  })
  const [selectedTo, setSelectedTo] = useState({
    id: "USD",
    flag: usa,
    currency: "USD (美金)",
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

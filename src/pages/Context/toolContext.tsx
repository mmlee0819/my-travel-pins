import React from "react"
import { createContext, useState, useEffect, ReactNode } from "react"
import { DocumentData } from "@firebase/firestore-types"
import { db } from "../Utils/firebase"
import { doc, getDoc } from "firebase/firestore"

interface ToolContextType {
  currenciesData: DocumentData | undefined
  convertResult: number
  currentRate: number
  amount: string
  setAmount: (amount: string) => void
  setCurrentRate: (currentRate: number) => void
  setConvertResult: (convertResult: number) => void
  setCurrenciesData: (currenciesData: DocumentData | undefined) => void
  getRatesData: () => void
  calculateRates: (
    amount: string,
    currentRate: number,
    selectedFrom: {
      id: string
      flag: string
      currency: string
    },
    selectedTo: {
      id: string
      flag: string
      currency: string
    }
  ) => void
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
  currenciesData: {},
  setCurrenciesData: (currenciesData: DocumentData | undefined) => Response,
  setCurrentRate: (currentRate: number) => Response,
  setConvertResult: (convertResult: number) => Response,
  getRatesData: () => Response,
  amount: "",
  setAmount: (amount: string) => Response,
  convertResult: 0,
  currentRate: 0,
  calculateRates: (
    amount: string,
    currentRate: number,
    selectedFrom: {
      id: string
      flag: string
      currency: string
    },
    selectedTo: {
      id: string
      flag: string
      currency: string
    }
  ) => Response,
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
  const [amount, setAmount] = useState("")

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
  useEffect(() => {
    if (!currenciesData || selectedFrom.id === "" || selectedTo.id === "")
      return
    if (selectedFrom.id === "USD") {
      const filteredCurrency = `USD${selectedTo?.id}`
      const filteredRate = currenciesData?.[filteredCurrency]?.Exrate
      setCurrentRate(filteredRate)
      setConvertResult(0)
    } else if (selectedTo.id === "USD") {
      const filteredCurrency = `USD${selectedFrom?.id}`
      const filteredRate = currenciesData?.[filteredCurrency]?.Exrate
      setCurrentRate(1 / filteredRate)
      setConvertResult(0)
    } else if (selectedFrom.id !== "USD" && selectedTo.id !== "USD") {
      const filteredFrom = `USD${selectedFrom?.id}`
      let filteredRate = currenciesData?.[filteredFrom]?.Exrate
      const filteredTo = `USD${selectedTo?.id}`
      filteredRate = (1 / filteredRate) * currenciesData?.[filteredTo]?.Exrate
      setCurrentRate(filteredRate)
      setConvertResult(0)
    }
  }, [selectedFrom.id, selectedTo.id])

  const today = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`
  const yesterday = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
    new Date().getDate() - 1
  }`
  const todayDocRef = doc(db, "currencies", today)
  const yesterdayDocRef = doc(db, "currencies", yesterday)

  const getRatesData = async () => {
    try {
      const docSnap = await getDoc(todayDocRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setCurrenciesData(data)
      } else {
        // doc.data() will be undefined in this case
        const oldDocSnap = await getDoc(yesterdayDocRef)
        const data = oldDocSnap.data()
        setCurrenciesData(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const calculateRates = (
    amount: string,
    currentRate: number,
    selectedFrom: {
      id: string
      flag: string
      currency: string
    },
    selectedTo: {
      id: string
      flag: string
      currency: string
    }
  ) => {
    if (!amount) return
    const amountNum = Number(amount)
    const calculation = amountNum * currentRate
    setConvertResult(calculation)
    if (selectedFrom.id !== "USD" || selectedTo.id !== "USD") {
      const fourthCalcut = Math.round(calculation * 10000) / 10000
      setConvertResult(fourthCalcut)
    }
  }

  return (
    <ToolContext.Provider
      value={{
        currenciesData,
        setCurrenciesData,
        getRatesData,
        calculateRates,
        convertResult,
        currentRate,
        setCurrentRate,
        setConvertResult,
        amount,
        setAmount,
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

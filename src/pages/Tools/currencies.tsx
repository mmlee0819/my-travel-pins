import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react"
import { ToolContext } from "../Context/toolContext"
import styled from "styled-components"
import { Responsive, WidthProvider } from "react-grid-layout"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import { DocumentData } from "@firebase/firestore-types"
import { db } from "../Utils/firebase"
import { doc, getDoc } from "firebase/firestore"
import usa from "../assets/flags/usa.png"
import canada from "../assets/flags/canada.png"
import japan from "../assets/flags/japan.png"
import euro from "../assets/flags/euro.png"
import uk from "../assets/flags/uk.png"
import krw from "../assets/flags/sKorea.png"
import china from "../assets/flags/china.png"
import taiwan from "../assets/flags/taiwan.png"
import hkd from "../assets/flags/hkd.png"
import macao from "../assets/flags/macao.png"
import singapore from "../assets/flags/singapore.png"
import thailand from "../assets/flags/thailand.png"
import malaysia from "../assets/flags/malaysia.png"
import vietnam from "../assets/flags/vietnam.png"
import indonesia from "../assets/flags/indonesia.png"
import philippine from "../assets/flags/philippine.png"
import australia from "../assets/flags/australia.png"
import newZealand from "../assets/flags/newZealand.png"
import sweden from "../assets/flags/sweden.png"
import switzerland from "../assets/flags/switzerland.png"
import denmark from "../assets/flags/denmark.png"
import mexico from "../assets/flags/mexico.png"
import turkey from "../assets/flags/turkey.png"
import india from "../assets/flags/india.png"
import calculator from "../assets/calculator.png"

const GridArea = styled.div`
  font-family: "Poppins";
  position: absolute;
  display: flex;
  top: 0px;
  min-width: 500px;
  min-height: 300px;
  z-index: 99;
`
const GridItemWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  font-size: 12px;
  color: #ffffff;
  background: #2d2d2d;
`

const GridItemContent = styled.div`
  padding: 8px;
`
const BtnClick = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-left: 8px;
  padding: 5px;
  width: 90px;
  height: 30px;
  line-height: 20px;
  text-align: center;
  background-color: #034961;
  border-radius: 8px;
  cursor: pointer;
`
const ExchangesWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin-left: 8px;
`
const ExchangesRows = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: start;
  gap: 10%;
  z-index: 100;
`
const CurrenciesWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin-top: 5px;
  width: 420px;
`
const CurrencyRow = styled(ExchangesRows)`
  padding: 5px 0;
  width: 140px;
  color: #000000;
  background-color: #ffffff;
  border: none;
  gap: 2%;
`
const ExchangesTitle = styled.div`
  font-size: 12px;
  width: 140px;
  margin-top: 20px;
`
const AmountTitle = styled(ExchangesTitle)`
  width: 100px;
  margin-top: 20px;
`
const Credits = styled.a`
  width: 160px;
  padding: 8px;
  text-decoration: underline;
  &:visited {
    color: #ffffff;
    text-decoration: none;
  }
  &:hover {
    color: #ffffff;
  }
  &:active {
    color: #ffffff;
  }
`
const FlagImg = styled.img`
  margin: 0 5px;
  width: 15px;
  height: 15px;
`
const WhiteInputArea = styled.div`
  align-items: center;
  line-height: 20px;
  width: 140px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
`
const WhiteInputTitle = styled(WhiteInputArea)``
const AmountInput = styled.input`
  font-size: 12px;
  line-height: 20px;
  width: 100px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 5px;
`

const currenciesArr = [
  { id: "TWD", flag: taiwan, currency: "TWD (台幣)" },
  { id: "USD", flag: usa, currency: "USD (美金)" },
  { id: "JPY", flag: japan, currency: "JPY (日幣)" },
  { id: "KRW", flag: krw, currency: "KRW (韓元)" },
  { id: "EUR", flag: euro, currency: "EUR (歐元)" },
  { id: "GBP", flag: uk, currency: "GBP (英鎊)" },
  { id: "CAD", flag: canada, currency: "CAD (加幣)" },
  { id: "CNY", flag: china, currency: "CNY (人民幣)" },
  { id: "HKD", flag: hkd, currency: "HKD (港幣)" },
  { id: "MOP", flag: macao, currency: "MOP (澳門幣)" },
  { id: "SGD", flag: singapore, currency: "SGD (新加坡幣)" },
  { id: "THB", flag: thailand, currency: "THB (泰銖)" },
  { id: "MYR", flag: malaysia, currency: "MYR (馬來幣)" },
  { id: "VND", flag: vietnam, currency: "VND (越南盾)" },
  { id: "IDR", flag: indonesia, currency: "IDR (印尼盾)" },
  { id: "PHP", flag: philippine, currency: "PHP (菲律賓披索)" },
  { id: "AUD", flag: australia, currency: "AUD (澳幣)" },
  { id: "NZD", flag: newZealand, currency: "NZD (紐幣)" },
  { id: "SEK", flag: sweden, currency: "SEK (瑞典幣)" },
  { id: "CHF", flag: switzerland, currency: "CHF (瑞士法郎)" },
  { id: "DKK", flag: denmark, currency: "DKK (丹麥克朗)" },
  { id: "MXN", flag: mexico, currency: "MXN (墨西哥披索)" },
  { id: "TRY", flag: turkey, currency: "TRY (土耳其里拉)" },
  { id: "INR", flag: india, currency: "INR (印度盧比)" },
]

const today = `${new Date().getFullYear()}-${
  new Date().getMonth() + 1
}-${new Date().getDate()}`
const yesterday = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
  new Date().getDate() - 1
}`
const todayDocRef = doc(db, "currencies", today)
const yesterdayDocRef = doc(db, "currencies", yesterday)

export const getRatesData = async (
  setCurrenciesData: Dispatch<SetStateAction<DocumentData | undefined>>
) => {
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
  },
  setConvertResult: (convertResult: number) => void
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

const ResponsiveGridLayout = WidthProvider(Responsive)

const layouts = {
  lg: [{ i: "exRate-1", x: 0, y: 0, w: 3, h: 1, maxW: 1, maxH: 1 }],
  md: [{ i: "exRate-2", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
  sm: [{ i: "exRate-3", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
  xs: [{ i: "exRate-4", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
  xxs: [{ i: "exRate-5", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
}

interface Props {
  currenciesData: DocumentData | undefined
  showFrom: boolean
  setShowFrom: Dispatch<SetStateAction<boolean>>
  showTo: boolean
  setShowTo: Dispatch<SetStateAction<boolean>>
}

function CurrencyWidget(props: Props) {
  const { currenciesData, showFrom, setShowFrom, showTo, setShowTo } = props
  const {
    currentRate,
    setCurrentRate,
    convertResult,
    setConvertResult,
    selectedFrom,
    setSelectedFrom,
    selectedTo,
    setSelectedTo,
  } = useContext(ToolContext)

  const [amount, setAmount] = useState("")

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

  return (
    <GridArea>
      <ResponsiveGridLayout
        layouts={layouts}
        key="tools"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 3, md: 4, sm: 3, xs: 2, xxs: 1 }}
        width={1000}
        rowHeight={350}
        z-index={99}
      >
        <GridItemWrapper key="exchange-rate">
          <GridItemContent>Currency Converter</GridItemContent>
          <GridItemContent>{`Last updated: ${currenciesData?.USDTWD?.UTC}`}</GridItemContent>
          <ExchangesWrapper>
            <ExchangesWrapper>
              <AmountTitle>Amount</AmountTitle>
              <AmountInput
                type="number"
                min="1"
                onChange={(e) => {
                  setAmount(e.target.value)
                }}
              />
            </ExchangesWrapper>
            <ExchangesRows>
              <ExchangesWrapper>
                <ExchangesTitle>From</ExchangesTitle>
                <WhiteInputTitle
                  onClick={() => {
                    setShowFrom((prev: boolean) => !prev)
                  }}
                >
                  {selectedFrom.id === "" ? (
                    <WhiteInputArea />
                  ) : (
                    <CurrencyRow>
                      <FlagImg src={selectedFrom.flag} />
                      {selectedFrom.currency}
                    </CurrencyRow>
                  )}
                  <CurrenciesWrapper>
                    {showFrom &&
                      currenciesArr &&
                      currenciesArr.map((item) => {
                        return (
                          <>
                            <CurrencyRow
                              key={item.id}
                              id={item.id}
                              onClick={(e) => {
                                const filteredCurrency = currenciesArr.filter(
                                  (item) => {
                                    return item.id === (e.target as Element).id
                                  }
                                )
                                setSelectedFrom(filteredCurrency[0])
                              }}
                            >
                              <FlagImg src={item.flag} />
                              {item.currency}
                            </CurrencyRow>
                          </>
                        )
                      })}
                  </CurrenciesWrapper>
                </WhiteInputTitle>
              </ExchangesWrapper>
              <ExchangesWrapper>
                <ExchangesTitle>To</ExchangesTitle>
                <WhiteInputTitle
                  onClick={() => {
                    setShowTo((prev: boolean) => !prev)
                  }}
                >
                  {selectedTo.id === "" ? (
                    <WhiteInputArea />
                  ) : (
                    <CurrencyRow>
                      <FlagImg src={selectedTo.flag} />
                      {selectedTo.currency}
                    </CurrencyRow>
                  )}
                  <CurrenciesWrapper>
                    {showTo &&
                      currenciesArr &&
                      currenciesArr.map((item) => {
                        return (
                          <CurrencyRow
                            key={item.id}
                            id={item.id}
                            onClick={(e) => {
                              const filteredCurrency = currenciesArr.filter(
                                (item) => {
                                  return item.id === (e.target as Element).id
                                }
                              )
                              setSelectedTo(filteredCurrency[0])
                            }}
                          >
                            <FlagImg src={item.flag} />
                            {item.currency}
                          </CurrencyRow>
                        )
                      })}
                  </CurrenciesWrapper>
                </WhiteInputTitle>
              </ExchangesWrapper>
            </ExchangesRows>

            <AmountTitle>
              {currentRate ? `Exchange rate: ${currentRate}` : "Exchange rate"}
            </AmountTitle>
            <AmountTitle>
              {convertResult ? `Result: ${convertResult}` : "Result"}
            </AmountTitle>
          </ExchangesWrapper>
          <BtnClick
            onClick={() => {
              calculateRates(
                amount,
                currentRate,
                selectedFrom,
                selectedTo,
                setConvertResult
              )
            }}
          >
            <FlagImg src={calculator} />
            Convert
          </BtnClick>
          <Credits href="https://tw.rter.info/howto_currencyapi.php">
            Credits: ©RTER.info
          </Credits>
        </GridItemWrapper>
      </ResponsiveGridLayout>
    </GridArea>
  )
}
export default CurrencyWidget

import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react"
import { ToolContext } from "../Context/toolContext"
import styled from "styled-components"
import { Input } from "../Components/styles/formStyles"
import {
  GridContainer,
  GridItemWrapper,
  Xmark,
} from "../Components/styles/widgetStyles"
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

const Title = styled.div`
  padding: 0;
  height: 30px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 700;
  margin-bottom: 20px;
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const BtnClick = styled.div<{ showFrom: boolean; showTo: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  min-width: 140px;
  height: 40px;
  line-height: 20px;
  text-align: center;
  font-size: ${(props) => props.theme.title.md};
  color: #fff;
  background-color: ${(props) =>
    props.showFrom || props.showTo ? "#fff" : "#034961"};
  border-radius: 5px;
  cursor: pointer;
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`
const ExchangesWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column wrap;
`
const ExchangesRows = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`
const CurrenciesFromWrapper = styled.div<{ showCurrency: boolean }>`
  position: absolute;
  top: 75px;
  left: 0;
  display: flex;
  flex-flow: row wrap;
  margin-top: 5px;
  background-color: #fff;
  z-index: 198;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  ${(props) =>
    props.showCurrency &&
    `  min-width: 200px;
  height: 300px; 
  border: 1px solid #2d2d2d;
  border-radius: 5px;`}
`
const CurrenciesToWrapper = styled(CurrenciesFromWrapper)`
  top: 155px;
`
const CurrencyRow = styled(ExchangesRows)`
  position: relative;
  flex: 1 1 auto;
  justify-content: start;
  width: 200px;
  height: 36px;
  color: #2d2d2d;
  background-color: #ffffff;
  border-radius: 3px;
  gap: 2%;
  z-index: 195;

  &:hover {
    color: #ffffff;
    background-color: #034961;
  }
`
const CurrentOne = styled(CurrencyRow)`
  width: 200px;
  min-width: 200px;
  z-index: 185;
`
const ExchangesTitle = styled.div`
  font-weight: 500;
  /* margin: 10px 0; */
`
const AmountTitle = styled(ExchangesTitle)`
  margin-top: 20px;
`

const GridItemContent = styled(ExchangesTitle)`
  margin: 20px 0 40px 0;
`

const ResultTitle = styled(AmountTitle)`
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 700;
  color: #034961;
  margin: 10px 0 20px 0;
`
const Credits = styled.a`
  display: flex;
  flex: 1 1 auto;
  justify-content: start;
  margin-top: 35px;
  font-size: 16px;
  color: #b4b1b1;
  text-decoration: underline;
  &:visited {
    color: #b4b1b1;
    text-decoration: none;
  }
  &:hover {
    color: #454545;
  }
  &:active {
    color: #b4b1b1;
  }
`
const FlagImg = styled.img`
  margin: 0 5px;
  width: 15px;
  height: 15px;
`

const WhiteInputTitle = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  min-height: 40px;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: ${(props) => props.theme.title.md};
  color: ${(props) => props.theme.color.bgDark};
  background-color: #ffffff;
  border: 2px solid ${(props) => props.theme.btnColor.bgGreen};
  border-radius: 5px;
  opacity: 1;
  &:focus {
    outline: #7ccbab;
    border: 3px solid #7ccbab;
  }
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
  cursor: pointer;
`

const AmountInput = styled(Input)`
  border: 2px solid ${(props) => props.theme.btnColor.bgGreen}; ;
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

const layouts = {
  xl: [{ i: "exRate-1", x: 0, y: 0, w: 2, h: 1, maxW: 4, maxH: 2 }],
  lg: [{ i: "exRate-2", x: 0, y: 0, w: 3, h: 2, maxW: 3, maxH: 2 }],
  md: [{ i: "exRate-3", x: 0, y: 0, w: 1, h: 1, maxW: 1, maxH: 1 }],
  sm: [{ i: "exRate-4", x: 0, y: 0, w: 1, h: 1, maxW: 1, maxH: 1 }],
  xs: [{ i: "exRate-5", x: 0, y: 0, w: 1, h: 1, maxW: 1, maxH: 1 }],
}

interface Props {
  currenciesData: DocumentData | undefined
  showFrom: boolean
  setShowFrom: Dispatch<SetStateAction<boolean>>
  showTo: boolean
  setShowTo: Dispatch<SetStateAction<boolean>>
  showExchange: boolean
  setShowExchange: Dispatch<SetStateAction<boolean>>
}

function CurrencyWidget(props: Props) {
  const {
    currenciesData,
    showFrom,
    setShowFrom,
    showTo,
    setShowTo,
    showExchange,
    setShowExchange,
  } = props
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
    if (!currenciesData || amount === "") return
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
  }, [currenciesData, amount])

  return (
    <GridContainer
      showWidget={showExchange}
      layouts={layouts}
      key="currency-widget"
      breakpoints={{ xl: 1440, lg: 1200, md: 900, sm: 600, xs: 375 }}
      cols={{ xl: 4, lg: 3, md: 3, sm: 3, xs: 1 }}
      rowHeight={450}
      z-index={160}
      maxRows={1.5}
    >
      <GridItemWrapper key="exchange-rate">
        <Xmark
          onClick={() => {
            setShowExchange(false)
            setSelectedFrom({
              id: selectedFrom.id || "TWD",
              flag: selectedFrom.flag || taiwan,
              currency: selectedFrom.currency || "TWD (台幣)",
            })
            setSelectedTo({
              id: selectedTo.id || "USD",
              flag: selectedTo.flag || usa,
              currency: selectedTo.currency || "USD (美金)",
            })
            setConvertResult(0)
          }}
        />
        <Title>Currency Converter</Title>
        <ExchangesWrapper>
          <ExchangesTitle>From</ExchangesTitle>
          <WhiteInputTitle
            onClick={() => {
              if (showTo) {
                setShowTo(false)
              }
              setShowFrom((prev: boolean) => !prev)
            }}
          >
            {selectedFrom.id !== "" && (
              <CurrentOne>
                <FlagImg src={selectedFrom.flag} />
                {selectedFrom.currency}
              </CurrentOne>
            )}
            <CurrenciesFromWrapper showCurrency={showFrom}>
              {showFrom &&
                currenciesArr &&
                currenciesArr.map((item) => {
                  return (
                    <>
                      <CurrencyRow
                        key={`from-${item.id}`}
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
            </CurrenciesFromWrapper>
          </WhiteInputTitle>
          <ExchangesTitle>To</ExchangesTitle>
          <WhiteInputTitle
            onClick={() => {
              if (!showFrom) {
                setShowTo((prev: boolean) => !prev)
              }
            }}
          >
            <CurrentOne>
              <FlagImg src={selectedTo.flag} />
              {selectedTo.currency}
            </CurrentOne>

            <CurrenciesToWrapper showCurrency={showTo}>
              {showTo &&
                currenciesArr &&
                currenciesArr.map((item) => {
                  return (
                    <CurrencyRow
                      key={`to-${item.id}`}
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
            </CurrenciesToWrapper>
          </WhiteInputTitle>
        </ExchangesWrapper>
        <AmountTitle>Amount</AmountTitle>
        <AmountInput
          type="number"
          min="1"
          onChange={(e) => {
            setAmount(e.target.value)
          }}
        />

        <BtnClick
          showFrom={showFrom}
          showTo={showTo}
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
      </GridItemWrapper>
      {convertResult !== 0 && (
        <GridItemWrapper
          key="convert-result"
          data-grid={{ x: 1, y: 0, w: 1, h: 1 }}
        >
          <Title>Result</Title>
          <ExchangesTitle>
            {`${amount} ${selectedFrom.currency} = `}
          </ExchangesTitle>
          <ResultTitle>{`${convertResult.toFixed(2)} ${
            selectedTo.currency
          }`}</ResultTitle>
          <GridItemContent>
            {`1 ${selectedFrom.id} = ${currentRate.toFixed(4)} ${
              selectedTo.id
            }`}
            <br />
            {`1 ${selectedTo.id} = ${(1 / currentRate).toFixed(4)} ${
              selectedFrom.id
            }`}
          </GridItemContent>
          <ExchangesTitle>
            Last updated: <br />
            {currenciesData?.USDTWD?.UTC} UTC
          </ExchangesTitle>
          <Credits href="https://tw.rter.info/howto_currencyapi.php">
            Credits: ©RTER.info
          </Credits>
        </GridItemWrapper>
      )}
    </GridContainer>
  )
}
export default CurrencyWidget

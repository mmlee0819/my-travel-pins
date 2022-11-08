import React from "react"
import { useState, useContext } from "react"
import { useDrag } from "@use-gesture/react"
import { useSpring, animated } from "@react-spring/web"
import { Responsive, WidthProvider } from "react-grid-layout"
import styled from "styled-components"
import robot from "../assets/robotic1.png"
import currency from "../assets/whiteCurrencies.png"
import flight from "../assets/whiteAirplane.png"
import hsr from "../assets/whiteHSR.png"
import train from "../assets/whiteTrain.png"
import tripAdvisor from "../assets/tripadvisor.png"
import weather from "../assets/whiteWeather.png"
import calculator from "../assets/calculator.png"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import { currencies } from "../Tools/currencies"
import { ToolContext } from "../Context/toolContext"

const ToolsWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 100px;
  right: 30px;
  z-index: 100;
`
const DragWrapper = styled(animated.div)`
  position: relative;
  will-change: transform;
  background-color: #034961;
  border-radius: 20px;
  touch-action: none;
  cursor: grab;
`

const RobotIcon = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 10%;
  background-image: url(${robot});
  background-size: contain;
  cursor: grab;
`

const CurrencyIcon = styled(RobotIcon)`
  height: 30px;
  width: 30px;
  margin: 10px auto;
  background-image: url(${currency});
  background-size: contain;
  cursor: pointer;
`
const FlightIcon = styled(CurrencyIcon)`
  background-image: url(${flight});
`
const TrainIcon = styled(CurrencyIcon)`
  background-image: url(${train});
`
const HSRIcon = styled(CurrencyIcon)`
  background-image: url(${hsr});
`
const TAIcon = styled(CurrencyIcon)`
  background-image: url(${tripAdvisor});
`
const Weather = styled(CurrencyIcon)`
  background-image: url(${weather});
`

const GridArea = styled.div`
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

const ResponsiveGridLayout = WidthProvider(Responsive)

const layouts = {
  lg: [{ i: "exRate-1", x: 0, y: 0, w: 3, h: 1, maxW: 1, maxH: 1 }],
  md: [{ i: "exRate-2", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
  sm: [{ i: "exRate-3", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
  xs: [{ i: "exRate-4", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
  xxs: [{ i: "exRate-5", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
}

function ToolsRobot() {
  const {
    currenciesData,
    getRatesData,
    calculateRates,
    currentRate,
    convertResult,
    setCurrentRate,
    setConvertResult,
    amount,
    setAmount,
    selectedFrom,
    setSelectedFrom,
    selectedTo,
    setSelectedTo,
  } = useContext(ToolContext)
  const [showTools, setShowTools] = useState(false)
  const [showExchange, setShowExchange] = useState(false)
  const [showFrom, setShowFrom] = useState(false)
  const [showTo, setShowTo] = useState(false)

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 1, tension: 350, friction: 40 },
  }))
  const bindDrag = useDrag(({ offset }) => {
    api({
      x: offset[0],
      y: offset[1],
    })
  })

  return (
    <>
      <ToolsWrapper>
        <DragWrapper
          style={{ x, y }}
          {...bindDrag()}
          onClick={(e) => {
            if ((e.target as Element).id === "robotIcon" && showTools) {
              setSelectedFrom({ id: "", flag: "", currency: "" })
              setSelectedTo({ id: "", flag: "", currency: "" })
              setCurrentRate(0)
              setConvertResult(0)
              setShowExchange(false)
              setShowTools((prev) => !prev)
            } else if ((e.target as Element).id === "robotIcon" && !showTools) {
              setShowTools((prev) => !prev)
            }
          }}
        >
          <RobotIcon id="robotIcon" />
          {showTools ? (
            <>
              <Weather id="weatherIcon" />
              <CurrencyIcon
                id="currencyIcon"
                onClick={(e) => {
                  if (
                    (e.target as Element).id === "currencyIcon" &&
                    !showExchange
                  ) {
                    getRatesData()
                    setShowExchange((prev) => !prev)
                  } else if (
                    (e.target as Element).id === "currencyIcon" &&
                    showExchange
                  ) {
                    setShowExchange((prev) => !prev)
                  }
                }}
              />
              <FlightIcon id="flightIcon" />
              <HSRIcon id="hsrIcon" />
              <TrainIcon id="trainIcon" />
              <TAIcon id="tripAdviIcon" />
            </>
          ) : (
            ""
          )}
        </DragWrapper>
      </ToolsWrapper>
      {showExchange ? (
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
                          currencies &&
                          currencies.map((item) => {
                            return (
                              <>
                                <CurrencyRow
                                  key={item.id}
                                  id={item.id}
                                  onClick={(e) => {
                                    const filteredCurrency = currencies.filter(
                                      (item) => {
                                        return (
                                          item.id === (e.target as Element).id
                                        )
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
                          currencies &&
                          currencies.map((item) => {
                            return (
                              <CurrencyRow
                                key={item.id}
                                id={item.id}
                                onClick={(e) => {
                                  const filteredCurrency = currencies.filter(
                                    (item) => {
                                      return (
                                        item.id === (e.target as Element).id
                                      )
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
                  {currentRate
                    ? `Exchange rate: ${currentRate}`
                    : "Exchange rate"}
                </AmountTitle>
                <AmountTitle>
                  {convertResult ? `Result: ${convertResult}` : "Result"}
                </AmountTitle>
              </ExchangesWrapper>
              <BtnClick
                onClick={() => {
                  calculateRates(amount, currentRate, selectedFrom, selectedTo)
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
      ) : (
        ""
      )}
    </>
  )
}

export default ToolsRobot

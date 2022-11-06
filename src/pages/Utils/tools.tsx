import React from "react"
import { useState } from "react"
import { useDrag } from "@use-gesture/react"
import { useSpring, animated } from "@react-spring/web"
import GridLayout from "react-grid-layout"
import { Responsive, WidthProvider } from "react-grid-layout"
import styled from "styled-components"
import robot from "../assets/robotic1.png"
import currency from "../assets/whiteCurrencies.png"
import flight from "../assets/whiteAirplane.png"
import hsr from "../assets/whiteHSR.png"
import train from "../assets/whiteTrain.png"
import tripAdvisor from "../assets/tripadvisor.png"
import weather from "../assets/whiteWeather.png"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import { currencies } from "../Tools/currencies"

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
  z-index: 99;
`
const GridItemWrapper = styled.div`
  position: relative;
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
  width: 10%;
  height: 20px;
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
const CurrencyRow = styled(ExchangesRows)`
  color: #000000;
  background-color: #ffffff;
  border: none;
`
const ExchangesTitle = styled.div`
  font-size: 12px;
  width: 100px;
`
const FlagImg = styled.img`
  margin: 0 5px;
  width: 15px;
  height: 15px;
`

const WhiteInputArea = styled.div`
  align-items: center;
  line-height: 20px;
  width: 120px;
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
const layout = [{ i: "exchange-rate", x: 0, y: 0, w: 1, h: 1 }]
const getLayouts = () => {
  const savedLayouts = localStorage.getItem("grid-layout")
  return savedLayouts ? JSON.parse(savedLayouts) : { lg: layout }
}
function ToolsRobot() {
  const [showTools, setShowTools] = useState(false)
  const [showExange, setShowExange] = useState(false)
  const [showFrom, setShowFrom] = useState(false)
  const [showTo, setShowTo] = useState(false)
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
  const handleLayoutChange = (
    layout: GridLayout.Layout[],
    layouts: GridLayout.Layouts
  ) => {
    localStorage.setItem("grid-layout", JSON.stringify(layouts))
  }
  const today = new Date().toDateString()

  const getRates = async () => {
    try {
      const response = await fetch("https://tw.rter.info/capi.php", {
        method: "GET",
        headers: {
          "Content-Type": "text/javascript",
        },
      })
      console.log("response", response.json())
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <ToolsWrapper>
        <DragWrapper
          style={{ x, y }}
          {...bindDrag()}
          onClick={(e) => {
            if ((e.target as Element).id === "robotIcon") {
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
                  if ((e.target as Element).id === "currencyIcon") {
                    setShowExange((prev) => !prev)
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
      {showExange ? (
        <GridArea>
          <ResponsiveGridLayout
            layouts={getLayouts()}
            key="tools"
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
            rowHeight={60}
            width={1000}
            onLayoutChange={handleLayoutChange}
            z-index={99}
          >
            <GridItemWrapper key="exchange-rate">
              <GridItemContent>Exchange rates</GridItemContent>
              <GridItemContent>{`Data updated time: ${today}`}</GridItemContent>
              <ExchangesWrapper>
                <ExchangesRows>
                  <ExchangesTitle>Amount</ExchangesTitle>
                  <ExchangesTitle>From</ExchangesTitle>
                  <ExchangesTitle>To</ExchangesTitle>
                </ExchangesRows>
                <ExchangesRows>
                  <AmountInput />
                  <WhiteInputTitle
                    onClick={() => {
                      setShowFrom((prev) => !prev)
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
                  </WhiteInputTitle>
                  <WhiteInputTitle
                    onClick={() => {
                      setShowTo((prev) => !prev)
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
                    {showTo &&
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
                                    return item.id === (e.target as Element).id
                                  }
                                )
                                setSelectedTo(filteredCurrency[0])
                              }}
                            >
                              <FlagImg src={item.flag} />
                              {item.currency}
                            </CurrencyRow>
                          </>
                        )
                      })}
                  </WhiteInputTitle>
                </ExchangesRows>
              </ExchangesWrapper>
              <BtnClick
                onClick={() => {
                  getRates()
                }}
              >
                Click
              </BtnClick>
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

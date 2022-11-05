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

const ResponsiveGridLayout = WidthProvider(Responsive)
const layout = [{ i: "exchange-rate", x: 0, y: 0, w: 1, h: 1 }]
const getLayouts = () => {
  const savedLayouts = localStorage.getItem("grid-layout")
  return savedLayouts ? JSON.parse(savedLayouts) : { lg: layout }
}
function ToolsRobot() {
  const [showTools, setShowTools] = useState(false)
  const [showExange, setShowExange] = useState(false)
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
  const currentTime = new Date().toLocaleTimeString("en-US")
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
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
            rowHeight={60}
            width={1000}
            onLayoutChange={handleLayoutChange}
            z-index={99}
          >
            <GridItemWrapper key="exchange-rate">
              <GridItemContent>Exchange rates</GridItemContent>
              <GridItemContent>{`Current time: ${today} ${currentTime}`}</GridItemContent>
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

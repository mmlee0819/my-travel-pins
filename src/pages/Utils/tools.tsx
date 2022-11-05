import React from "react"
import { useState } from "react"
import { useDrag } from "@use-gesture/react"
import { useSpring, animated } from "@react-spring/web"
import styled from "styled-components"
import robot from "../assets/robotic1.png"
import currency from "../assets/whiteCurrencies.png"
import flight from "../assets/whiteAirplane.png"
import hsr from "../assets/whiteHSR.png"
import train from "../assets/whiteTrain.png"
import tripAdvisor from "../assets/tripadvisor.png"
import weather from "../assets/whiteWeather.png"

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
function ToolsRobot() {
  const [showTools, setShowTools] = useState(false)
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
            <CurrencyIcon id="currencyIcon" />
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
  )
}

export default ToolsRobot

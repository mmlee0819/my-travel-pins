import React, { useState, useContext, useEffect } from "react"
import styled from "styled-components"

import { useDrag } from "@use-gesture/react"
import { useSpring, animated } from "@react-spring/web"
import { DocumentData } from "@firebase/firestore-types"

import TipsContent from "../sampleContent"
import CurrencyWidget, { getRatesData } from "./currencies"
import WeatherWidget from "./weather"
import { ToolContext } from "../../context/toolContext"

import robot from "../../assets/chatbot.png"
import currency from "../../assets/whiteCurrencies.png"
import questionMark from "../../assets/question-mark.png"
import weather from "../../assets/whiteWeather.png"
import usa from "../../assets/flags/usa.png"
import taiwan from "../../assets/flags/taiwan.png"

const ToolsWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 80px;
  right: 35px;
  border-radius: 20px;
  z-index: 200;
`
const DragWrapper = styled(animated.div)`
  position: relative;
  will-change: transform;
  background-color: #034961;
  border-radius: 20px;
  touch-action: none;
  cursor: grab;
`

const RobotIcon = styled.div<{ showTools: boolean }>`
  height: 50px;
  width: 50px;
  border-radius: 10px;
  background-image: url(${robot});
  background-size: contain;
  cursor: grab;
  ${(props) =>
    props.showTools &&
    ` border-radius: 0;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;`}
`
const WidgetIcon = styled.div<{ currentWidget: string }>`
  height: 50px;
  width: 50px;
  background-image: url(${currency});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60% 60%;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.btnColor.bgBlue};
    border-radius: 0;
  }
`
const CurrencyIcon = styled(WidgetIcon)`
  background-color: ${(props) =>
    props.currentWidget === "exchange" && props.theme.btnColor.bgBlue};
`
const Weather = styled(WidgetIcon)`
  background-image: url(${weather});
  background-color: ${(props) =>
    props.currentWidget === "weather" ? props.theme.btnColor.bgBlue : "none"};
`

const QaIcon = styled(WidgetIcon)`
  background-image: url(${questionMark});
  background-color: ${(props) =>
    props.currentWidget === "tips" ? props.theme.btnColor.bgBlue : "none"};
`

function ToolsRobot() {
  const {
    setCurrentRate,
    setConvertResult,
    selectedFrom,
    setSelectedFrom,
    selectedTo,
    setSelectedTo,
  } = useContext(ToolContext)
  const [currentWidget, setCurrentWidget] = useState("")
  const [showTools, setShowTools] = useState(false)
  const [currenciesData, setCurrenciesData] = useState<
    DocumentData | undefined
  >({})
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

  const [loopStyles, setLoopStyles] = useState({
    loop: { reverse: false },
    from: { rotateZ: 0 },
    to: { rotateZ: 0 },
  })

  const styles = useSpring(loopStyles)
  useEffect(() => {
    if (
      !showTools &&
      (window.location.href === "https://my-travel-pins.web.app/" ||
        window.location.href === "https://localhost:3000/")
    ) {
      setLoopStyles({
        loop: { reverse: true },
        from: { rotateZ: -20 },
        to: { rotateZ: 20 },
      })
    }
    const handleMouseover = (e: MouseEvent) => {
      if ((e.target as Element).id === "robotIcon" || showTools) {
        setLoopStyles({
          loop: { reverse: false },
          from: { rotateZ: 0 },
          to: { rotateZ: 0 },
        })
      }
    }
    window.addEventListener("mouseover", handleMouseover)
    return () => {
      window.removeEventListener("mouseover", handleMouseover)
    }
  }, [showTools])

  useEffect(() => {
    const handleMouseout = (e: MouseEvent) => {
      if (
        (e.target as Element).id === "robotIcon" &&
        !showTools &&
        (window.location.href === "https://my-travel-pins.web.app/" ||
          window.location.href === "https://localhost:3000/")
      ) {
        setLoopStyles({
          loop: { reverse: true },
          from: { rotateZ: -20 },
          to: { rotateZ: 20 },
        })
      }
    }
    window.addEventListener("mouseout", handleMouseout)
    return () => {
      window.removeEventListener("mouseout", handleMouseout)
    }
  }, [showTools])

  const handleClickWeather = () => {
    if (currentWidget === "exchange") {
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
      setCurrentRate(0)
      setConvertResult(0)
      setCurrentWidget("weather")
    } else {
      setCurrentWidget("weather")
    }
  }

  const handleClickCurrency = () => {
    if (currentWidget !== "exchange") {
      getRatesData(setCurrenciesData)
      setCurrentWidget("exchange")
    }
  }

  return (
    <>
      <ToolsWrapper>
        <DragWrapper style={{ x, y, ...styles }} {...bindDrag()}>
          <RobotIcon
            showTools={showTools}
            id="robotIcon"
            onClick={() => {
              setShowTools((prev) => !prev)
            }}
          />
          {showTools && (
            <>
              <Weather
                currentWidget={currentWidget}
                onClick={handleClickWeather}
              />
              <CurrencyIcon
                currentWidget={currentWidget}
                onClick={handleClickCurrency}
              />
              <QaIcon
                currentWidget={currentWidget}
                onClick={() => {
                  setCurrentWidget("tips")
                }}
              />
            </>
          )}
        </DragWrapper>
      </ToolsWrapper>
      {currentWidget === "exchange" && (
        <CurrencyWidget
          currentWidget={currentWidget}
          setCurrentWidget={setCurrentWidget}
          showFrom={showFrom}
          setShowFrom={setShowFrom}
          showTo={showTo}
          setShowTo={setShowTo}
          currenciesData={currenciesData}
        />
      )}
      {currentWidget === "weather" && (
        <WeatherWidget
          currentWidget={currentWidget}
          setCurrentWidget={setCurrentWidget}
        />
      )}
      {currentWidget === "tips" && (
        <TipsContent setCurrentWidget={setCurrentWidget} />
      )}
    </>
  )
}

export default ToolsRobot

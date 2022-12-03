import React, { useState, useContext, useEffect } from "react"
import { useDrag } from "@use-gesture/react"
import { useSpring, animated } from "@react-spring/web"
import styled from "styled-components"
import { DocumentData } from "@firebase/firestore-types"
import robot from "../assets/chatbot.png"
import currency from "../assets/whiteCurrencies.png"
import tripAdvisor from "../assets/tripadvisor.png"
import weather from "../assets/whiteWeather.png"
import CurrencyWidget, { getRatesData } from "../Widgets/currencies"
import WeatherWidget from "../Widgets/weather"
import { ToolContext } from "../Context/toolContext"
import usa from "../assets/flags/usa.png"
import taiwan from "../assets/flags/taiwan.png"

const ToolsWrapper = styled.div`
  position: absolute;
  display: flex;
  top: 80px;
  right: 35px;
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

const TAIcon = styled(CurrencyIcon)`
  background-image: url(${tripAdvisor});
`
const Weather = styled(CurrencyIcon)`
  background-image: url(${weather});
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
  const [showTools, setShowTools] = useState(false)
  const [showExchange, setShowExchange] = useState(false)
  const [currenciesData, setCurrenciesData] = useState<
    DocumentData | undefined
  >({})
  const [showFrom, setShowFrom] = useState(false)
  const [showTo, setShowTo] = useState(false)
  const [showWeather, setShowWeather] = useState(false)

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

  return (
    <>
      <ToolsWrapper>
        <DragWrapper
          style={{ x, y, ...styles }}
          {...bindDrag()}
          onClick={(e) => {
            if ((e.target as Element).id === "robotIcon" && showTools) {
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
              setShowExchange(false)
              setShowTools((prev) => !prev)
              setShowWeather(false)
            } else if ((e.target as Element).id === "robotIcon" && !showTools) {
              setShowTools((prev) => !prev)
            }
          }}
        >
          <RobotIcon id="robotIcon" />
          {showTools && (
            <>
              <Weather
                id="weatherIcon"
                onClick={(e) => {
                  if (
                    (e.target as Element).id === "weatherIcon" &&
                    !showWeather
                  ) {
                    setShowExchange(false)
                    setShowWeather((prev) => !prev)
                  } else if (
                    (e.target as Element).id === "weatherIcon" &&
                    showWeather
                  ) {
                    setShowWeather((prev) => !prev)
                  }
                }}
              />
              <CurrencyIcon
                id="currencyIcon"
                onClick={(e) => {
                  if (
                    (e.target as Element).id === "currencyIcon" &&
                    !showExchange
                  ) {
                    getRatesData(setCurrenciesData)
                    setShowExchange((prev) => !prev)
                    setShowWeather(false)
                  } else if (
                    (e.target as Element).id === "currencyIcon" &&
                    showExchange
                  ) {
                    setShowExchange((prev) => !prev)
                    setConvertResult(0)
                  }
                }}
              />

              <TAIcon id="tripAdviIcon" />
            </>
          )}
        </DragWrapper>
      </ToolsWrapper>
      {showExchange && (
        <CurrencyWidget
          showExchange={showExchange}
          setShowExchange={setShowExchange}
          showFrom={showFrom}
          setShowFrom={setShowFrom}
          showTo={showTo}
          setShowTo={setShowTo}
          currenciesData={currenciesData}
        />
      )}
      {showWeather && <WeatherWidget showWeather={showWeather} />}
    </>
  )
}

export default ToolsRobot

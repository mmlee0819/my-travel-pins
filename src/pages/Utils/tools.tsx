import React from "react"
import { useRef, useEffect } from "react"
import { useDrag, useGesture } from "@use-gesture/react"
import { useSpring, animated, to } from "@react-spring/web"
import styled from "styled-components"
import robot from "../assets/robotic1.png"

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
  cursor: grab;
  touch-action: none;
`

const RobotIcon = styled.div`
  height: 64px;
  width: 64px;
  border-radius: 10%;
  background-image: url(${robot});

  cursor: grab;
`
function ToolsRobot() {
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
      <DragWrapper style={{ x, y }} {...bindDrag()}>
        <RobotIcon />
      </DragWrapper>
    </ToolsWrapper>
  )
}

export default ToolsRobot

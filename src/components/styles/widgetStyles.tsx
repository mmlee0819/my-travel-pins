import React from "react"
import styled from "styled-components"
import { Responsive, WidthProvider } from "react-grid-layout"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import xMark from "../../assets/buttons/x-mark.png"
const ResponsiveGridLayout = WidthProvider(Responsive)

export const GridContainer = styled(ResponsiveGridLayout)`
  position: absolute;
  height: auto;
  z-index: 180;
  .react-grid-item {
    box-shadow: 0 8px 6px #0000004c;
    border: none;
    cursor: grab;
  }
  .react-grid-item > .react-resizable-handle::after {
    border-right: 2px solid #034961;
    border-bottom: 2px solid #034961;
  }
  .react-grid-item.react-grid-placeholder {
    background: none;
    border-radius: 5px;
    border: none;
    transition-duration: 100ms;
    z-index: 2;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
`
export const GridItemWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  min-width: 300px;
  padding: 30px 43px 30px 40px;
  font-size: ${(props) => props.theme.title.md};
  color: #2d2d2d;
  background: #ffffff;
  border-radius: 5px;
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`
export const Xmark = styled.div`
  position: absolute;
  top: 18px;
  right: 20px;
  background-image: url(${xMark});
  background-size: 100% 100%;
  width: 15px;
  height: 15px;
  z-index: 188;
  cursor: pointer;
  @media screen and (max-width: 799px), (max-height: 600px) {
    width: 15px;
    height: 15px;
  }
`

export const FormTitle = styled.div`
  padding: 0;
  height: 30px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 700;
  margin-bottom: 20px;
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
export const Credits = styled.a`
  display: flex;
  flex: 1 1 auto;
  justify-content: start;
  font-size: 14px;
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

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
  @media screen and (max-width: 900px) {
    font-size: ${(props) => props.theme.title.sm};
    min-width: 200px;
    padding: 20px 33px 20px 30px;
  }
  @media screen and (max-width: 650px) {
    display: none;
  }
  /* @media screen and (max-width: 500px) {
    padding: 20px 13px 20px 10px;
    max-width: 300px;
    min-width: 200px;
  } */
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

export const Title = styled.div`
  padding: 0;
  height: 30px;
  font-size: ${(props) => props.theme.title.md};
  font-weight: 700;
  margin-bottom: 20px;
  @media screen and (max-width: 800px) {
    margin-bottom: 10px;
  }
  @media screen and (max-width: 650px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`

export const MobileContainer = styled.div`
  display: none;
  @media screen and (max-width: 650px) {
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    padding: 20px 23px 20px 20px;
    width: calc(100% - 60px);
    max-width: 400px;
    height: 380px;
    font-size: ${(props) => props.theme.title.md};
    color: #2d2d2d;
    background-color: #ffffff;
    border-radius: 5px;
    z-index: 199;
  }
`
export const MobileWrapper = styled(MobileContainer)`
  position: relative;
  padding: 0;
  width: 100%;
  height: 400px;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

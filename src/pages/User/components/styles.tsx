import React from "react"
import styled from "styled-components"
import { MapContainer } from "react-leaflet"

export const Attribution = styled.a`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  margin: 0;
  padding-right: 15px;
  font-family: "Poppins", "sans-serif";
  font-size: 12px;
  line-height: 1.5;
  color: #fff;
  background: none;
  border: none;
  text-decoration: none;
  z-index: 60;
  cursor: pointer;
  &:visited,
  &:hover,
  &:active {
    text-decoration: underline;
  }
`
export const StyleMapContainer = styled(MapContainer)`
  .leaflet-control-attribution a {
    display: none;
  }
  .leaflet-bottom .leaflet-control {
    margin-right: 15px;
    margin-bottom: 15px;
    opacity: 0.8;
  }
`

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 5px;
`

export const Wrapper = styled.div`
  position: absolute;
  margin: auto;
  width: 50%;
  padding: 20px 10px;
  top: 0;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  font-family: "Poppins";
  font-size: ${(props) => props.theme.title.md};
  background-color: rgb(255, 255, 255, 0.6);
  border-radius: 10px;
  box-shadow: 0 8px 6px #0000004c;
  gap: 15px;
  z-index: 100;
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`

import React from "react"
import styled from "styled-components"

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  color: #2d2d2d;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 5px;
`
export const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 0 auto;
  padding: 10px;
  width: 100%;
  height: 120px;
  min-width: 200px;
  background-color: #ffffffc2;
  border-radius: 5px;
  box-shadow: rgb(83, 132, 169, 0.2) 0px 0px 3px;
  &:hover {
    box-shadow: rgb(83, 132, 169, 0.5) 0px 0px 8px;
  }
`

export const ImgWrapper = styled.div`
  position: relative;
  display: block;
  margin-right: 20px;
  width: 100px;
  height: 100%;
  background-color: ${(props) => props.theme.btnColor.bgGreen};
  object-fit: cover;
  border: none;
  border-radius: 50%;
`
export const UserImg = styled.img`
  display: block;
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`
export const UserInfo = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-self: center;
  margin: 20px auto 20px 0;
  font-size: ${(props) => props.theme.title.md};
  border: none;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`

export const HomeTownText = styled.div`
  font-size: ${(props) => props.theme.title.sm};
`

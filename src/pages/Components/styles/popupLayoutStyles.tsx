import React from "react"
import styled from "styled-components"

export const BgOverlay = styled.div`
  position: absolute;
  top: 3px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.color.bgDark};
  border-radius: 5px;
  opacity: 0.9;
  z-index: 50;
`
export const ReminderArea = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  padding: 20px;
  color: ${(props) => props.theme.color.bgDark};
  background-color: #fff;
  border-radius: 5px;
  z-index: 52;
`
export const ReminderText = styled.div`
  margin: 20px auto 30px auto;
  text-align: center;
  font-size: ${(props) => props.theme.title.lg};
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
export const BtnWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  margin-right: 10px;
  margin-bottom: 20px;
  justify-content: center;
  align-self: center;
  gap: 10px;
`
export const BtnLight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 160px;
  padding: 5px;
  font-family: "Poppins";
  font-size: ${(props) => props.theme.title.md};
  color: #034961;
  background-color: #ffffff;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.btnColor.bgGray};
  cursor: pointer;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`
export const BtnBlue = styled(BtnLight)`
  color: #ffffff;
  background-color: ${(props) => props.theme.color.lightMain};
  border: none;
`

import React from "react"
import styled from "styled-components"

export const StepText = styled.div`
  display: flex;
  padding: 0px 10px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 700;
  color: ${(props) => props.theme.color.bgDark};
  border: none;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
    padding: 2px 10px;
  }
`
export const StepTitle = styled(StepText)`
  font-weight: 500;
`
export const Input = styled.input`
  width: 100%;
  height: 40px;
  min-height: 40px;
  padding-left: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: ${(props) => props.theme.title.lg};
  color: ${(props) => props.theme.color.bgDark};
  background-color: #ffffff;
  border: 3px solid #ffffff;
  border-radius: 5px;
  opacity: 1;
  &:focus {
    outline: #7ccbab;
    border: 3px solid #7ccbab;
  }
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`

export const BtnText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin: 30px auto;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 400;
  color: ${(props) => props.theme.color.bgLight};
  background-color: ${(props) => props.theme.btnColor.bgGreen};
  border-radius: 5px;
  border: none;
  gap: 5px;
  cursor: pointer;
  &:hover {
    color: #fff;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
    height: 30px;
    font-size: ${(props) => props.theme.title.md};
  }
`

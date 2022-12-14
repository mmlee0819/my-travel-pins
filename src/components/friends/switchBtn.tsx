import React, { SetStateAction, Dispatch } from "react"
import styled from "styled-components"

const BtnToggleWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 240px;
  height: 40px;
  line-height: 30px;
  background-color: #ffffff;
  border-radius: 5px;
  font-size: ${(props) => props.theme.title.lg};
  gap: 10px;
  @media screen and (max-width: 630px) {
    font-size: ${(props) => props.theme.title.md};
    min-width: 180px;
    height: 30px;
    line-height: 20px;
  }
  @media screen and (max-width: 575px) {
    min-width: 180px;
  }
`

const BtnSortLabel = styled.label`
  position: absolute;
  left: 0;
  width: 180px;
  height: 40px;
  padding-left: 60px;
  background: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  @media screen and (max-width: 630px) {
    height: 30px;
    line-height: 20px;
    padding-left: 40px;
  }
  &::after {
    content: "Friend requests";
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    width: 180px;
    height: 40px;
    text-align: center;
    color: #ffffff;
    background-color: ${(props) => props.theme.color.deepMain};
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
    @media screen and (max-width: 630px) {
      width: 150px;
      height: 30px;
      line-height: 20px;
    }
  }
`
const BtnSort = styled.input`
  opacity: 0;
  z-index: 1;
  min-width: 180px;
  height: 40px;
  padding-right: 50px;
  @media screen and (max-width: 630px) {
    padding-right: 40px;
    height: 30px;
    line-height: 20px;
  }
  &:checked + ${BtnSortLabel} {
    background-color: ${(props) => props.theme.color.deepMain};
    @media screen and (max-width: 630px) {
      width: 150px;
      height: 30px;
      line-height: 20px;
    }
    &::after {
      content: "Friends";
      display: flex;
      justify-content: center;
      align-items: center;
      left: 0;
      border-radius: 5px;
      min-width: 150px;
      height: 40px;
      text-align: center;
      transition: 0.2s;
      @media screen and (max-width: 630px) {
        width: 150px;
        height: 30px;
        line-height: 20px;
      }
    }
  }
`

function SwitchBtn({
  currentSort,
  setCurrentSort,
}: {
  currentSort: string
  setCurrentSort: Dispatch<SetStateAction<string>>
}) {
  const handleClickMiniBtn = () => {
    if (currentSort === "friends") {
      setCurrentSort("friendRequests")
    } else {
      setCurrentSort("friends")
    }
  }

  return (
    <BtnToggleWrapper>
      <BtnSort
        id="checkbox"
        type="checkbox"
        defaultChecked
        onClick={handleClickMiniBtn}
      />
      <BtnSortLabel htmlFor="checkbox" />
    </BtnToggleWrapper>
  )
}

export default SwitchBtn

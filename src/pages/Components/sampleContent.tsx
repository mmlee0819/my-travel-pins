import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  useContext,
} from "react"
import styled from "styled-components"
import xMark from "../assets/x-mark.png"

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100%;
  width: 100%;
  background-color: rgb(45, 45, 45, 0.8);
  z-index: 120;
`
const ContentArea = styled.div`
  position: relative;
  padding: 20px;
  width: 60%;
  height: 100vh;
  margin: 0 auto;
  font-size: 4rem;
  color: #2d2d2d;
  background-color: rgb(255, 255, 255, 0.9);
  overflow-y: scroll;
`
const SubTitle = styled.div`
  min-height: 60px;
  @media screen and (min-width: 1100px) {
    font-size: 4rem;
  }
  @media screen and (max-width: 1100px) and (min-width: 800px) {
    font-size: 3rem;
  }
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: 2.5rem;
  }
`
const Text = styled.div`
  font-family: "Poppins", "sans-serif";
  font-size: 25px;
  margin: 25px 0;

  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: 18px;
  }
`
const Xmark = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-image: url(${xMark});
  background-size: 100% 100%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  @media screen and (max-width: 799px), (max-height: 600px) {
    top: 30px;
    width: 40px;
    height: 40px;
  }
`
export function TipsContent({
  setShowTips,
}: {
  setShowTips: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Container>
      <ContentArea>
        <Xmark
          onClick={() => {
            setShowTips(false)
          }}
        />
        <SubTitle> Welcome to My Travel Pins !</SubTitle>
        <Text>
          Without login, <br />
          you can use Robot Widget on the right hand side to query useful
          information.
        </Text>
        <Text>
          After successful login, <br />
          you can do the followings :
          <br />
          1. Own your map to save your travel memories
          <br />
          2. Add a marker on your map <br />
          3. Post your travel memory related to this place <br />
          4. Visit your friend to see their memories
        </Text>
      </ContentArea>
    </Container>
  )
}

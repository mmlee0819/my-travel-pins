import styled from "styled-components"

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  font-family: "Poppins";
  color: #2d2d2d;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 20px;
`
export const ContentArea = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 15px;
  gap: 20px;
  border: none;
`
export const ArticleWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  min-width: 40%;
  margin: 10px 0;
  font-family: "Poppins";
  font-size: 20px;
  gap: 20px;
  border: none;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    gap: 10px;
    font-size: 16px;
  }
`
export const ContentWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  padding: 15px;
  background-color: #ffffff;
  opacity: 0.8;
  gap: 20px;
  border: none;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`
export const MemoryList = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 450px;
  padding: 10px 0;
  gap: 20px;
`

export const ImgWrapper = styled.div`
  position: relative;
  display: block;
  width: 40%;
`
export const MemoryImg = styled.img`
  display: block;
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

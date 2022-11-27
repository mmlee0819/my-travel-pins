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
  padding: 50px 50px;
  gap: 25px;
  border: none;
`
export const ArticleWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  flex: 1 1 auto;
  min-width: 40%;
  font-family: "Poppins";
  font-size: 20px;
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
  gap: 30px;
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
  height: 150px;
  gap: 20px;
`

export const ImgWrapper = styled.div`
  position: relative;
  display: block;
  width: 150px;
  height: 150px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.btnColor.bgGreen};
  cursor: pointer;
`
export const MemoryImg = styled.img`
  display: block;
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  object-fit: cover;
`

export const IconInList = styled.img`
  align-self: center;
  margin-right: 10px;
  width: 20px;
  height: 20px;
`

export const PhotoText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  text-align: center;
  width: 150px;
  height: 150px;
  color: ${(props) => props.theme.color.bgDark};
  border-radius: 5px;
`

export const Text = styled.div`
  vertical-align: text-bottom;
  height: 30px;
  margin: 5px 0;
  color: ${(props) => props.theme.color.bgDark};
  min-width: 30%;
`
export const Title = styled(Text)`
  flex: 1 1 auto;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: ${(props) => props.theme.title.lg};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`

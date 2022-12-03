import styled from "styled-components"

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 1440px;
  width: 100%;
  color: #2d2d2d;
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 20px;
`

export const ContentArea = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 50px 50px;
  gap: 25px;
  border: none;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

// export const ContentArea = styled.div`
//   display: flex;
//   flex-flow: row wrap;
//   width: 100%;
//   height: 100%;
//   margin: 0 auto;
//   padding: 50px 50px;
//   gap: 25px;
//   border: none;
// `
export const ArticleWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  flex: 1 1 auto;
  min-width: 40%;
  font-size: ${(props) => props.theme.title.md};
  border: none;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
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
  flex-flow: column nowrap;
  width: 100%;
  max-width: 250px;
  min-width: 200px;
`

export const ImgWrapper = styled.div`
  position: relative;
  display: block;
  width: 100%;
  height: 200px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.btnColor.bgGreen};
  object-fit: cover;
  border: 2px solid #fff;
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
`

export const IconInList = styled.img`
  align-self: center;
  margin-right: 10px;
  width: 15px;
  height: 15px;
  @media screen and (max-width: 600px), (max-height: 600px) {
    width: 10px;
    height: 10px;
  }
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
  display: flex;
  align-items: center;
  vertical-align: text-bottom;
  height: 30px;
  font-size: ${(props) => props.theme.title.sm};
  color: ${(props) => props.theme.color.bgDark};
  min-width: 30%;
`
export const Title = styled(Text)`
  justify-content: space-between;
  flex: 1 1 auto;
  font-weight: 700;
  font-size: ${(props) => props.theme.title.md};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`

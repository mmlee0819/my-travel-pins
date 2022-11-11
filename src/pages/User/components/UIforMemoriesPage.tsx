import styled from "styled-components"
import { Link } from "react-router-dom"

export const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin: 0 20px;
  font-size: 14px;
`
export const TabWrapper = styled(Container)`
  flex-flow: row nowrap;
  margin: 30px auto 0 30px;
  font-size: 20px;
  gap: 30px;
`
export const ContentArea = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  border: 1px solid #beb9b9;
  border-top: none;
`
export const ContentWrapper = styled(ContentArea)`
  margin: 0 auto;
  padding: 15px;
  gap: 20px;
  border: none;
`
export const TabLink = styled(Link)`
  padding: 5px 8px;
  text-align: center;
  color: #000000;
  text-decoration: none;
  cursor: pointer;
  &:visited {
    color: #000000;
  }
  &:hover {
    color: #2d65be;
  }
  &:active {
    color: #000000;
  }
`
export const TabTitle = styled.div`
  padding: 5px 8px;
  width: 130px;
  text-align: center;
  color: #2d65be;
  border: 1px solid #beb9b9;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: none;
`

export const DetailContentWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin: 0;
  padding: 10px;
  gap: 20px;
`
export const DetailArticleWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  margin: 0;
`
export const DetailImgsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`
export const DetailImg = styled.div<{
  bkImage: string
}>`
  display: flex;
  flex: 0 1 45%;
  height: 200px;
  background-image: ${(props) => `url(${props.bkImage})`};
  background-size: 100% 100%;
`
export const SplitWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 0;
  padding: 0;
`
export const DetailMapWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  text-align: center;
  justify-content: center;
  width: 100%;
  height: 400px;
  font-size: 14px;
`

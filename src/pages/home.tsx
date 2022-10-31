import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 80%;
  margin: 0 auto;
`

const Title = styled.div`
  color: #000000;
`
const BtnLink = styled(Link)`
  margin: 0 20px;
`

function Home() {
  return (
    <Wrapper>
      <Title>我是首頁</Title>
      <BtnLink to="/mika">點我去user的地圖頁</BtnLink>
      <BtnLink to="/mika/my-memories">點我去user的memories列表</BtnLink>
      <BtnLink to="/mika/my-friends">點我去user的friends列表</BtnLink>
    </Wrapper>
  )
}

export default Home

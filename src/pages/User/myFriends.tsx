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

function MyFriends() {
  return (
    <Wrapper>
      <Title>我是user的好友列表</Title>
      <BtnLink to="/">點我回首頁</BtnLink>
      <BtnLink to="/mika">點我回user的地圖頁</BtnLink>
      <BtnLink to="/mika/my-memories">點我去user的回憶列表</BtnLink>
    </Wrapper>
  )
}

export default MyFriends

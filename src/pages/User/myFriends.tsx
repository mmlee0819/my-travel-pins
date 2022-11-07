import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../Context/authContext"
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
  const { currentUser, isLogin } = useContext(AuthContext)

  return (
    <Wrapper>
      {isLogin && currentUser !== undefined ? (
        <>
          <Title>我是user的好友列表</Title>
          <BtnLink to="/">點我回首頁</BtnLink>
          <BtnLink to={`/${currentUser?.name}`}>點我回user的地圖頁</BtnLink>
          <BtnLink to={`/${currentUser?.name}/my-memories`}>
            點我去user的回憶列表
          </BtnLink>
        </>
      ) : (
        <Title>你沒有登入</Title>
      )}
    </Wrapper>
  )
}

export default MyFriends

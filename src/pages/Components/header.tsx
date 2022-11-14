import React, { useContext } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import defaultAvatar from "../assets/defaultProfile.png"
import { AuthContext } from "../Context/authContext"

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: end;
  width: 100%;
  height: 60px;
  padding-right: 60px;
  background-color: #2d2d2d;
`
const RowNoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: end;
`
const UserAvatar = styled.div`
  display: flex;
  align-self: center;
  margin: 10px 10px 0 0;
  width: 50px;
  height: 50px;
  background-image: url(${defaultAvatar});
  background-size: 100% 100%;
`

const Title = styled.div`
  color: #ffffff;
  font-size: 2rem;
`

const LoginArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 60px;
`
const BtnLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  margin: 0 20px;
  &:hover {
    text-decoration: underline;
  }
`
const Btn = styled.div`
  display: inline-block;
  color: #ffffff;
  padding: 10px;
  border: 2px solid #ffffff;
  border-radius: 10px;
  cursor: pointer;
`

function Header() {
  const { currentUser, isLogin, logOut } = useContext(AuthContext)

  return (
    <HeaderContainer>
      <RowNoWrapper>
        <UserAvatar />
        <Title>
          {isLogin && currentUser !== null
            ? `Hello ${currentUser?.name} !`
            : "Welcome"}
        </Title>
      </RowNoWrapper>
      {isLogin && currentUser !== undefined && (
        <LoginArea>
          <BtnLink to={`/${currentUser.name}`}>my-map</BtnLink>
          <BtnLink to={`/${currentUser.name}/my-memories`}>my-memories</BtnLink>
          <BtnLink to={`/${currentUser.name}/my-friends`}>my-friends</BtnLink>
          <Btn
            onClick={() => {
              logOut()
            }}
          >
            Sign out
          </Btn>
        </LoginArea>
      )}
    </HeaderContainer>
  )
}
export default Header

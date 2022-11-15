import React, { useContext } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import defaultAvatar from "../assets/defaultProfile.png"
import { AuthContext } from "../Context/authContext"

const HeaderContainer = styled.div`
  @media screen and (max-width: 1440px) {
    position: fixed;
    top: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: end;
    height: 60px;
    width: 100%;
    max-width: 1440px;
    padding-right: 60px;
    color: #2d2d2d;
    background-color: #fff;
    z-index: 180;
  }
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
  font-size: 2rem;
`

const LoginArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 60px;
`
const BtnLink = styled(Link)`
  text-decoration: none;
  margin: 0 20px;
  &:hover {
    text-decoration: underline;
  }
`
const Btn = styled.div`
  display: inline-block;
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

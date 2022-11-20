import React, { useContext } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import defaultAvatar from "../assets/defaultProfile.png"
import { AuthContext } from "../Context/authContext"
import logoutIcon from "../assets/buttons/logoutIcon.png"

const HeaderContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0 auto;
  padding-left: 20px;
  max-width: 1440px;
  width: 100%;
  height: 60px;
  font-family: "Jomhuria";
  opacity: 1;
  gap: 20px;
`
const BtnWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-self: end;
  margin: 10px 20px 5px 20px;
  max-width: 1440px;
  width: 100%;
  height: 40px;
  font-family: "Jomhuria";
  font-size: 40px;
  opacity: 1;
  gap: 20px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 28px;
    height: 30px;
  }
`

const BtnText = styled.div`
  display: flex;
  border: none;
  gap: 5px;
  cursor: pointer;
  &:hover {
    border-bottom: 3px solid #fff;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
  }
`
const BtnLogout = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  background-image: url(${logoutIcon});
  background-size: contain;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    width: 25px;
    height: 25px;
  }
`

const UserAvatar = styled.div`
  display: flex;
  align-self: center;
  width: 50px;
  height: 50px;
  background-image: url(${defaultAvatar});
  background-size: 100% 100%;
`

const Title = styled.div`
  position: absolute;
  top: 0;
  left: 80px;
  margin: 0 auto;
  max-width: 1440px;
  font-family: "Jomhuria";
  color: #fff;
  font-size: 90px;
  font-weight: 400;
  letter-spacing: 4px;
  line-height: 76px;
  z-index: 20;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 76px;
  }
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

  if (
    !isLogin ||
    currentUser === undefined ||
    currentUser === null ||
    typeof currentUser.name !== "string"
  )
    return null

  return (
    <HeaderContainer>
      <UserAvatar />
      <Title>{`Hello ${currentUser?.name} !`}</Title>
      <BtnWrapper>
        <BtnText
          onClick={() => {
            logOut()
          }}
        >
          <BtnLogout />
          Sign out
        </BtnText>
      </BtnWrapper>

      {/* {isLogin && currentUser !== undefined && (
        <LoginArea>
          <BtnLink to={`/${currentUser.name}`}>my-map</BtnLink>
          <BtnLink to={`/${currentUser.name}/my-memories`}>my-memories</BtnLink>
          <BtnLink to={`/${currentUser.name}/my-friends`}>my-friends</BtnLink>
        </LoginArea>
      )} */}
    </HeaderContainer>
  )
}

export default Header

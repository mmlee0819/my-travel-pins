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
const TabWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-self: end;
  margin: 10px 20px 3px 20px;
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
  background-size: 100% 100%;
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
    font-size: 60px;
  }
`

const Tab = styled.div`
  display: flex;
  padding: 0 15px;
  color: #fff;
  background-color: none;
  border: 1px solid #fff;
  border: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: #5594b7;
    background-color: #fff;
    box-shadow: 3px 3px #2d2d2d;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
  }
`
const CurrentTab = styled(Tab)`
  color: #034961;
  background-color: #fff;
  cursor: default;
  &:hover {
    color: #034961;
    background-color: #fff;
  }
`

function Header() {
  const {
    currentUser,
    isLogin,
    logOut,
    navigate,
    isMyMap,
    setIsMyMap,
    isMyMemory,
    setIsMyMemory,
    isMyFriend,
    setIsMyFriend,
    isFriendHome,
    setIsFriendHome,
    isFriendMemory,
    setIsFriendMemory,
  } = useContext(AuthContext)

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
      <TabWrapper>
        {isMyMap && (
          <>
            <CurrentTab>My Map</CurrentTab>
            <Tab
              to={`/${currentUser.name}/my-memories`}
              as={Link}
              onClick={() => {
                setIsMyMap(false)
                setIsMyFriend(false)
                setIsMyMemory(true)
              }}
            >
              My Memories
            </Tab>
            <Tab
              to={`/${currentUser.name}/my-friends`}
              as={Link}
              onClick={() => {
                setIsMyMap(false)
                setIsMyMemory(false)
                setIsMyFriend(true)
              }}
            >
              My Friends
            </Tab>
          </>
        )}
        {isMyMemory && (
          <>
            <Tab
              to={`/${currentUser.name}`}
              as={Link}
              onClick={() => {
                setIsMyMemory(false)
                setIsMyFriend(false)
                setIsMyMap(true)
              }}
            >
              My Map
            </Tab>
            <CurrentTab>My Memories</CurrentTab>
            <Tab
              to={`/${currentUser.name}/my-friends`}
              as={Link}
              onClick={() => {
                setIsMyMemory(false)
                setIsMyMap(false)
                setIsMyFriend(true)
              }}
            >
              My Friends
            </Tab>
          </>
        )}
        {isMyFriend && (
          <>
            <Tab
              to={`/${currentUser.name}`}
              as={Link}
              onClick={() => {
                setIsMyMemory(false)
                setIsMyFriend(false)
                setIsMyMap(true)
              }}
            >
              My Map
            </Tab>
            <Tab to={`/${currentUser.name}/my-memories`} as={Link}>
              My Memories
            </Tab>
            <CurrentTab
              onClick={() => {
                setIsMyMemory(false)
                setIsMyMap(false)
                setIsMyFriend(true)
              }}
            >
              My Friends
            </CurrentTab>
          </>
        )}
        <BtnText
          onClick={() => {
            logOut()
          }}
        >
          <BtnLogout />
          Sign out
        </BtnText>
      </TabWrapper>
    </HeaderContainer>
  )
}

export default Header

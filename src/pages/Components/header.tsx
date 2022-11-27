import React, { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import Profile from "./profile"
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
  font-size: ${(props) => props.theme.title.lg};
  opacity: 1;
  gap: 20px;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const TabWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-self: end;
  margin: 0 auto;
  padding-right: 20px;
  max-width: 1440px;
  width: 100%;
  height: 40px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 500;
  opacity: 1;
  gap: 20px;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`

const BtnText = styled.div`
  display: flex;
  margin-left: 10px;
  color: ${(props) => props.theme.color.bgDark};
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

const UserAvatar = styled.div<{ avatarURL: string }>`
  display: flex;
  align-self: center;
  width: 40px;
  height: 40px;
  background-image: ${(props) => `url(${props.avatarURL})`};
  background-size: 100% 100%;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
  &:hover {
    box-shadow: -3px -1px 1px #0000004c;
  }
`

const Title = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-self: end;
  justify-content: start;
  margin: 0 auto;
  width: 40%;
  color: ${(props) => props.theme.color.bgDark};
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 40px;
  gap: 10px;
  z-index: 20;
`

const Tab = styled.div`
  display: flex;
  padding: 0 15px;
  background-color: none;
  color: ${(props) => props.theme.color.bgDark};
  border: 1px solid #fff;
  border: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.color.deepMain};
    background-color: ${(props) => props.theme.color.bgLight};
    box-shadow: 3px 3px 1px #0000004c;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
  }
`
const CurrentTab = styled(Tab)`
  color: ${(props) => props.theme.color.bgLight};
  background-color: ${(props) => props.theme.color.lightMain};
  box-shadow: 3px 3px 1px #0000004c;
  cursor: default;
  &:hover {
    color: ${(props) => props.theme.color.bgLight};
    background-color: ${(props) => props.theme.color.lightMain};
    transition: background-color 0.3s;
  }
`

function Header() {
  const {
    currentUser,
    isLogin,
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
    currentFriendInfo,
    isProfile,
    setIsProfile,
    avatarURL,
  } = useContext(AuthContext)

  if (
    !isLogin ||
    currentUser === undefined ||
    currentUser === null ||
    typeof currentUser.name !== "string"
  )
    return null

  return (
    <>
      <HeaderContainer>
        <Title>
          <UserAvatar
            avatarURL={avatarURL}
            onClick={() => {
              setIsProfile(true)
            }}
          />
          {`Hello ${currentUser?.name} !`}
        </Title>
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
                  setIsFriendHome(false)
                  setIsFriendMemory(false)
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
                  setIsFriendHome(false)
                  setIsFriendMemory(false)
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
                  setIsFriendHome(false)
                  setIsFriendMemory(false)
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
                  setIsFriendHome(false)
                  setIsFriendMemory(false)
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
                  setIsFriendHome(false)
                  setIsFriendMemory(false)
                  setIsMyMap(true)
                }}
              >
                My Map
              </Tab>
              <Tab
                to={`/${currentUser.name}/my-memories`}
                as={Link}
                onClick={() => {
                  setIsMyMap(false)
                  setIsFriendHome(false)
                  setIsFriendMemory(false)
                  setIsMyFriend(false)
                  setIsMyMemory(true)
                }}
              >
                My Memories
              </Tab>
              <CurrentTab>My Friends</CurrentTab>
            </>
          )}
          {isFriendHome && (
            <>
              <Tab
                to={`/${currentUser.name}`}
                as={Link}
                onClick={() => {
                  setIsFriendHome(false)
                  setIsFriendMemory(false)
                  setIsFriendHome(false)
                  setIsFriendMemory(false)
                  setIsMyMap(true)
                }}
              >
                My Map
              </Tab>
              <CurrentTab>{`${currentFriendInfo?.name}'s Map`}</CurrentTab>
              <Tab
                to={`/${currentUser?.name}/my-friend/${currentFriendInfo?.name}/${currentFriendInfo?.id}/memories`}
                as={Link}
                onClick={() => {
                  setIsMyMap(false)
                  setIsMyMemory(false)
                  setIsMyFriend(false)
                  setIsFriendHome(false)
                  setIsFriendMemory(true)
                }}
              >
                {`${currentFriendInfo?.name}'s Memories`}
              </Tab>
            </>
          )}
          {isFriendMemory && (
            <>
              <Tab
                to={`/${currentUser.name}`}
                as={Link}
                onClick={() => {
                  setIsMyMemory(false)
                  setIsMyFriend(false)
                  setIsFriendHome(false)
                  setIsFriendMemory(false)
                  setIsMyMap(true)
                }}
              >
                My Map
              </Tab>
              <Tab
                to={`/${currentUser?.name}/my-friend/${currentFriendInfo?.name}/${currentFriendInfo?.id}`}
                as={Link}
                onClick={() => {
                  setIsMyMap(false)
                  setIsMyMemory(false)
                  setIsMyFriend(false)
                  setIsFriendMemory(false)
                  setIsFriendHome(true)
                }}
              >{`${currentFriendInfo?.name}'s Map`}</Tab>
              <CurrentTab>{`${currentFriendInfo?.name}'s Memories`}</CurrentTab>
            </>
          )}
        </TabWrapper>
      </HeaderContainer>
      {isProfile && typeof avatarURL === "string" && <Profile />}
    </>
  )
}

export default Header

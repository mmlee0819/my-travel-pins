import React, { useContext } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import Profile from "./profile"
import { AuthContext } from "../context/authContext"
import backFriend from "../assets/backToFriend.png"

const HeaderContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  margin: 0 auto;
  padding-top: 5px;
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
  height: 30px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 500;
  opacity: 1;
  gap: 20px;
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
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
    box-shadow: rgb(83, 132, 169) 0px 0px 3px;
    transform: box-shadow 1s;
  }
`

const BackToFriend = styled.div`
  display: flex;
  align-self: center;
  width: 40px;
  height: 40px;
  background-image: url(${backFriend});
  background-size: 100% 100%;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
  &:hover {
    box-shadow: rgb(83, 132, 169) 0px 0px 3px;
    transform: box-shadow 1s;
  }
`

const Title = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: start;
  align-items: center;
  margin: 0 auto;
  width: 40%;
  line-height: 40px;
  color: ${(props) => props.theme.color.bgDark};
  font-size: ${(props) => props.theme.title.md};
  font-weight: 500;
  letter-spacing: 2px;

  gap: 10px;
  z-index: 20;
`

const Tab = styled.div`
  display: flex;
  padding: 0 15px;
  font-size: ${(props) => props.theme.title.md};
  color: #7f7f7f;
  background-color: none;
  border: 1px solid #fff;
  border: none;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.color.deepMain};
    background-color: ${(props) => props.theme.color.bgLight};
    transition: background-color 0.3s;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
  }
`
const CurrentTab = styled(Tab)`
  color: ${(props) => props.theme.color.bgLight};
  background-color: ${(props) => props.theme.color.lightMain};
  cursor: default;
  &:hover {
    color: ${(props) => props.theme.color.bgLight};
    background-color: ${(props) => props.theme.color.lightMain};
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
        {(isFriendHome || isFriendMemory) && (
          <Title>
            <UserAvatar
              avatarURL={avatarURL}
              onClick={() => {
                setIsProfile(true)
              }}
            />
            <BackToFriend
              to={`/${currentUser.name}/my-friends`}
              as={Link}
              onClick={() => {
                setIsMyMap(false)
                setIsMyMemory(false)
                setIsFriendHome(false)
                setIsFriendMemory(false)
                setIsMyFriend(true)
              }}
            />
          </Title>
        )}
        {(isMyMap || isMyMemory || isMyFriend) && (
          <Title>
            <UserAvatar
              avatarURL={avatarURL}
              onClick={() => {
                setIsProfile(true)
              }}
            />
            {`Hello ${currentUser?.name} !`}
          </Title>
        )}
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
              {/* <Tab
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
              </Tab> */}
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

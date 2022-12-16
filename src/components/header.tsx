import React, { Dispatch, SetStateAction, useContext, useState } from "react"
import { Link, useParams, useLocation } from "react-router-dom"
import styled from "styled-components"
import Profile from "./profile"
import { AuthContext } from "../context/authContext"
import backFriend from "../assets/backToFriend.png"
import menu from "../assets/buttons/menu.png"
import whiteMenu from "../assets/buttons/whiteMenu.png"

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
  @media screen and (max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const TabWrapper = styled.div<{ currentPage: string }>`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-self: end;
  margin-right: 20px;
  height: 30px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 500;
  opacity: 1;
  gap: 20px;
  @media screen and (max-width: 800px) {
    margin-right: 10px;
    font-size: ${(props) => props.theme.title.md};
    gap: 10px;
  }
  @media screen and (max-width: 643px) {
    display: none;
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
  justify-content: start;
  align-items: center;
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
  @media screen and (max-width: 900px) {
    padding: 2px 10px;
    font-size: 16px;
  }
  @media screen and (max-width: 630px) {
    height: 40px;
    line-height: 40px;
    border-radius: 0;
    font-size: 14px;
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
const MiniCurrentTabInFriend = styled.div`
  display: none;
  @media screen and (max-width: 630px) {
    display: flex;
    align-self: end;
    height: 30px;
    margin-right: 20px;
    padding: 2px 10px;
    font-size: 16px;
    color: ${(props) => props.theme.color.bgLight};
    background-color: ${(props) => props.theme.color.lightMain};
    border: none;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    gap: 10px;
    cursor: pointer;
  }
`

const TabMenu = styled.div<{ showMiniTab: boolean }>`
  display: none;
  @media screen and (max-width: 643px) {
    display: flex;
    margin-bottom: 5px;
    width: 20px;
    height: 20px;
    background-image: ${(props) =>
      props.showMiniTab ? `url(${menu})` : `url(${whiteMenu})`};
    background-size: 100% 100%;
    cursor: pointer;
  }
`
const TabMenuInFriend = styled(TabMenu)`
  align-self: center;
  width: 15px;
  height: 15px;
`

const MiniTabWrapper = styled.div<{
  showMiniTab: boolean
  currentPage: string
}>`
  display: none;
  @media screen and (max-width: 630px) {
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    width: calc(100% - 100px);
    justify-content: center;
    align-self: end;
    overflow: hidden;
    padding: 0;
    margin: 0 auto 0 20px;
    min-width: 220px;
    max-height: 0px;
    font-size: ${(props) => props.theme.title.md};
    font-weight: 500;
    background-color: #ffffff;
    box-shadow: rgb(120, 120, 120) 0px 0px 3px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    opacity: 1;
    gap: 5px;
    z-index: 110;
    transition: max-height 0.5s ease-in-out;
    ${(props) =>
      props.showMiniTab &&
      `
    max-height: 150px; 
    padding-top: 0px;`}
  }
`
function TabsInMyMap({
  setShowMiniTab,
}: {
  setShowMiniTab: Dispatch<SetStateAction<boolean>>
}) {
  const { currentUser } = useContext(AuthContext)

  return (
    <>
      <CurrentTab>My Map</CurrentTab>
      <Tab
        to={`/${currentUser?.name}/my-memories`}
        as={Link}
        onClick={() => {
          setShowMiniTab(false)
        }}
      >
        My Memories
      </Tab>
      <Tab
        to={`/${currentUser?.name}/my-friends`}
        as={Link}
        onClick={() => {
          setShowMiniTab(false)
        }}
      >
        My Friends
      </Tab>
    </>
  )
}

function TabsInMyMemories({
  setShowMiniTab,
}: {
  setShowMiniTab: Dispatch<SetStateAction<boolean>>
}) {
  const { currentUser } = useContext(AuthContext)
  return (
    <>
      <Tab
        to={`/${currentUser?.name}`}
        as={Link}
        onClick={() => {
          setShowMiniTab(false)
        }}
      >
        My Map
      </Tab>
      <CurrentTab>My Memories</CurrentTab>
      <Tab
        to={`/${currentUser?.name}/my-friends`}
        as={Link}
        onClick={() => {
          setShowMiniTab(false)
        }}
      >
        My Friends
      </Tab>
    </>
  )
}

function TabsInMyFriends({
  setShowMiniTab,
}: {
  setShowMiniTab: Dispatch<SetStateAction<boolean>>
}) {
  const { currentUser } = useContext(AuthContext)
  return (
    <>
      <Tab
        to={`/${currentUser?.name}`}
        as={Link}
        onClick={() => {
          setShowMiniTab(false)
        }}
      >
        My Map
      </Tab>
      <Tab
        to={`/${currentUser?.name}/my-memories`}
        as={Link}
        onClick={() => {
          setShowMiniTab(false)
        }}
      >
        My Memories
      </Tab>
      <CurrentTab>My Friends</CurrentTab>
    </>
  )
}

function TabInFriendMap({
  setShowMiniTab,
}: {
  setShowMiniTab: Dispatch<SetStateAction<boolean>>
}) {
  const { currentUser, currentFriendInfo } = useContext(AuthContext)
  const { friendName, friendId } = useParams()
  return (
    <>
      <CurrentTab>{`${
        friendName || currentFriendInfo?.name
      }'s map`}</CurrentTab>
      <Tab
        to={`/${currentUser?.name}/my-friend/${
          friendName || currentFriendInfo?.name
        }/${friendId || currentFriendInfo?.id}/memories`}
        as={Link}
        onClick={() => {
          setShowMiniTab(false)
        }}
      >
        {`${friendName || currentFriendInfo?.name}'s Memories`}
      </Tab>
    </>
  )
}

function TabInFriendMemories({
  setShowMiniTab,
}: {
  setShowMiniTab: Dispatch<SetStateAction<boolean>>
}) {
  const { currentUser, currentFriendInfo } = useContext(AuthContext)
  const { friendName, friendId } = useParams()
  return (
    <>
      <Tab
        to={`/${currentUser?.name}/my-friend/${
          friendName || currentFriendInfo?.name
        }/${friendId || currentFriendInfo?.id}`}
        as={Link}
        onClick={() => {
          setShowMiniTab(false)
        }}
      >{`${friendName || currentFriendInfo?.name}'s Map`}</Tab>

      <CurrentTab>{`${
        friendName || currentFriendInfo?.name
      }'s Memories`}</CurrentTab>
    </>
  )
}

function TabsInAllCondition({
  setShowMiniTab,
}: {
  setShowMiniTab: Dispatch<SetStateAction<boolean>>
}) {
  const { currentPage } = useContext(AuthContext)

  return (
    <>
      {currentPage === "myMap" && (
        <TabsInMyMap setShowMiniTab={setShowMiniTab} />
      )}
      {currentPage === "myMemories" && (
        <TabsInMyMemories setShowMiniTab={setShowMiniTab} />
      )}
      {currentPage === "myFriends" && (
        <TabsInMyFriends setShowMiniTab={setShowMiniTab} />
      )}
      {currentPage === "friendMap" && (
        <TabInFriendMap setShowMiniTab={setShowMiniTab} />
      )}
      {currentPage === "friendMemories" && (
        <TabInFriendMemories setShowMiniTab={setShowMiniTab} />
      )}
    </>
  )
}

function Header() {
  const {
    currentUser,
    isLogin,
    isProfile,
    setIsProfile,
    avatarURL,
    currentPage,
    currentFriendInfo,
  } = useContext(AuthContext)
  const { user, friendName, friendId } = useParams()
  const [showMiniTab, setShowMiniTab] = useState(false)

  const currentURL = useLocation().pathname

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
          {(currentPage === "friendMemories" ||
            currentPage === "friendMap" ||
            currentURL === `/${user}/my-friend/${friendName}/${friendId}` ||
            currentURL ===
              `/${user}/my-friend/${friendName}/${friendId}/memories`) && (
            <BackToFriend to={`/${currentUser.name}/my-friends`} as={Link} />
          )}
          {(currentURL === `/${user}` ||
            currentURL === `/${user}/my-memories` ||
            currentURL === `/${user}/my-friends`) && (
            <>
              <div>{`Hello ${currentUser?.name} !`}</div>
              <TabMenu
                showMiniTab={showMiniTab}
                onClick={() => {
                  setShowMiniTab((isShown) => !isShown)
                }}
              />
            </>
          )}
        </Title>

        <TabWrapper currentPage={currentPage}>
          <TabsInAllCondition setShowMiniTab={setShowMiniTab} />
        </TabWrapper>
        {(currentPage === "friendMap" || currentPage === "friendMemories") && (
          <>
            <MiniCurrentTabInFriend
              onClick={() => {
                setShowMiniTab((isShown) => !isShown)
              }}
            >
              {friendName || currentFriendInfo?.name}
              <TabMenuInFriend showMiniTab={showMiniTab} />
            </MiniCurrentTabInFriend>
          </>
        )}
      </HeaderContainer>
      <MiniTabWrapper showMiniTab={showMiniTab} currentPage={currentPage}>
        <TabsInAllCondition setShowMiniTab={setShowMiniTab} />
      </MiniTabWrapper>
      <Profile isProfile={isProfile} />
    </>
  )
}

export default Header

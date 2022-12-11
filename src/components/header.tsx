import React, { Dispatch, SetStateAction, useContext, useState } from "react"
import { Link, useParams } from "react-router-dom"
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
  margin-right: 20px;
  height: 30px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 500;
  opacity: 1;
  gap: 20px;
  @media screen and (max-width: 800px) and (min-width: 630px) {
    margin-right: 10px;
    font-size: ${(props) => props.theme.title.md};
    gap: 10px;
  }
  @media screen and (max-width: 630px) {
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
  /* flex: 1 1 auto; */
  justify-content: start;
  align-items: center;
  /* margin: 0 auto; */
  /* width: 40%; */
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
  @media screen and (max-width: 900px) and (min-width: 630px) {
    padding: 2px 10px;
    font-size: 16px;
  }
  @media screen and (max-width: 630px) {
    height: 40px;
    line-height: 40px;
    border-radius: 0;
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

const TabMenu = styled.div<{ showMiniTab: boolean }>`
  display: none;
  @media screen and (max-width: 630px) {
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

const MiniTabWrapper = styled.div<{ showMiniTab: boolean }>`
  display: none;
  @media screen and (max-width: 630px) {
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    width: fit-content;
    justify-content: center;
    align-self: end;
    overflow: hidden;
    padding: 0;
    margin: 0 auto 0 20px;
    width: 220px;
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
  const { currentUser, setCurrentPage } = useContext(AuthContext)

  return (
    <>
      <CurrentTab>My Map</CurrentTab>
      <Tab
        to={`/${currentUser?.name}/my-memories`}
        as={Link}
        onClick={() => {
          setCurrentPage("myMemories")
          setShowMiniTab(false)
        }}
      >
        My Memories
      </Tab>
      <Tab
        to={`/${currentUser?.name}/my-friends`}
        as={Link}
        onClick={() => {
          setCurrentPage("myFriends")
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
  const { currentUser, setCurrentPage } = useContext(AuthContext)
  return (
    <>
      <Tab
        to={`/${currentUser?.name}`}
        as={Link}
        onClick={() => {
          setCurrentPage("myMap")
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
          setCurrentPage("myFriends")
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
  const { currentUser, setCurrentPage } = useContext(AuthContext)
  return (
    <>
      <Tab
        to={`/${currentUser?.name}`}
        as={Link}
        onClick={() => {
          setCurrentPage("myMap")
          setShowMiniTab(false)
        }}
      >
        My Map
      </Tab>
      <Tab
        to={`/${currentUser?.name}/my-memories`}
        as={Link}
        onClick={() => {
          setCurrentPage("myMemories")
          setShowMiniTab(false)
        }}
      >
        My Memories
      </Tab>
      <CurrentTab>My Friends</CurrentTab>
    </>
  )
}

function Header() {
  const {
    currentUser,
    isLogin,
    currentFriendInfo,
    isProfile,
    setIsProfile,
    avatarURL,
    currentPage,
    setCurrentPage,
  } = useContext(AuthContext)
  const { friendName, friendId } = useParams()
  const [showMiniTab, setShowMiniTab] = useState(false)
  console.log({ currentPage })
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
        {(currentPage === "friendMap" || currentPage === "friendMemories") && (
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
                setCurrentPage("myFriends")
              }}
            />
          </Title>
        )}
        {(currentPage === "myMap" ||
          currentPage === "myMemories" ||
          currentPage === "myFriends") && (
          <Title>
            <UserAvatar
              avatarURL={avatarURL}
              onClick={() => {
                setIsProfile(true)
              }}
            />
            {`Hello ${currentUser?.name} !`}
            <TabMenu
              showMiniTab={showMiniTab}
              onClick={() => {
                setShowMiniTab((isShown) => !isShown)
              }}
            />
          </Title>
        )}

        <TabWrapper>
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
            <>
              <CurrentTab>{`${
                friendName || currentFriendInfo?.name
              }'s Map`}</CurrentTab>
              <Tab
                to={`/${currentUser?.name}/my-friend/${
                  friendName || currentFriendInfo?.name
                }/${friendId || currentFriendInfo?.id}/memories`}
                as={Link}
                onClick={() => {
                  setCurrentPage("friendMemories")
                }}
              >
                {`${friendName || currentFriendInfo?.name}'s Memories`}
              </Tab>
            </>
          )}
          {currentPage === "friendMemories" && (
            <>
              <Tab
                to={`/${currentUser?.name}/my-friend/${
                  friendName || currentFriendInfo?.name
                }/${friendId || currentFriendInfo?.id}`}
                as={Link}
                onClick={() => {
                  setCurrentPage("friendMap")
                }}
              >{`${friendName || currentFriendInfo?.name}'s Map`}</Tab>

              <CurrentTab>{`${
                friendName || currentFriendInfo?.name
              }'s Memories`}</CurrentTab>
            </>
          )}
        </TabWrapper>
      </HeaderContainer>
      {isProfile && typeof avatarURL === "string" && <Profile />}
      {(currentPage === "myMap" ||
        currentPage === "myMemories" ||
        currentPage === "myFriends") && (
        <MiniTabWrapper showMiniTab={showMiniTab}>
          {currentPage === "myMap" && (
            <TabsInMyMap setShowMiniTab={setShowMiniTab} />
          )}
          {currentPage === "myMemories" && (
            <TabsInMyMemories setShowMiniTab={setShowMiniTab} />
          )}
          {currentPage === "myFriends" && (
            <TabsInMyFriends setShowMiniTab={setShowMiniTab} />
          )}
        </MiniTabWrapper>
      )}
    </>
  )
}

export default Header

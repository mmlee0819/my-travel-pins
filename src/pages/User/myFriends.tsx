import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { useState, useContext } from "react"
import { AuthContext } from "../Context/authContext"
import queryFriend from "../assets/magnifying-friends.png"
const NavWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 80%;
  margin: 0 auto;
`
const Title = styled.div`
  color: #000000;
`

const BtnLink = styled(Link)`
  margin: 0 20px;
`

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
  margin: 0 20px;
  font-size: 14px;
`
const TabWrapper = styled(Container)`
  flex-flow: row nowrap;
  margin: 30px auto 0 30px;
  font-size: 20px;
  gap: 30px;
`
const TabLink = styled(Link)`
  padding: 5px 8px;
  width: 100px;
  text-align: center;
  color: #000000;
  text-decoration: none;
  cursor: pointer;
  &:visited {
    color: #000000;
  }
  &:hover {
    color: #2d65be;
  }
  &:active {
    color: #000000;
  }
`
const TabTitle = styled.div`
  padding: 5px 8px;
  width: 100px;
  text-align: center;
  color: #2d65be;
  border: 1px solid #beb9b9;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: none;
`
const ContentArea = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  border: 1px solid #beb9b9;
  border-top: none;
`
const SplitWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin: 0;
  padding: 0;
`
const LeftSplit = styled.div`
  width: 160px;
  border-top: 1px solid #beb9b9;
`
const RightSplit = styled(LeftSplit)`
  flex: 1 1 auto;
  margin-left: 100px;
`
const ContentWrapper = styled(ContentArea)`
  margin: 0 auto;
  padding: 15px;
  gap: 20px;
  border: none;
`
const InviWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  padding: 5px 8px;
  width: 40%;
  border: 1px solid #beb9b9;
`
const FriendsWrapper = styled(InviWrapper)`
  width: 60%;
`
const ContentTitle = styled.div`
  font-size: 1rem;
`
const InputWrapper = styled(SplitWrapper)`
  align-items: center;
  gap: 8px;
  margin-bottom:15px;
`
const QueryFriendInput = styled.input`
  display: flex;
  flex: 1 1 auto;
  padding-left: 5px;
  width: 70%;
  font-size: 16px;
  line-height: 20px;
  height: 20px;
  &:focus {
    color: #034961;
    outline: 1px solid #fbcb63;
    border: none;
  }
`
const QueryIconWrapper = styled.div`
  position: relative;
  display: flex;
  width: 12%;
  min-width: 22px;
  background-color: #034961;
  line-height: 22px;
  height: 22px;
  border-radius: 5px;
`
const QueryIconImg = styled.img`
  position: absolute;
  top: 1px;
  right: 1px;
  width: 20px;
  height: 20px;
`


function MyFriends() {
  const { currentUser, isLogin } = useContext(AuthContext)

  return (
    <>
      <NavWrapper>
        {isLogin && currentUser !== undefined ? (
          <>
            <Title>我是user的好友列表</Title>
            <BtnLink to="/">HOME</BtnLink>
            <BtnLink to={`/${currentUser?.name}`}>My-map</BtnLink>
            <BtnLink to={`/${currentUser?.name}/my-memories`}>
              my-memories
            </BtnLink>
          </>
        ) : (
          <Title>你沒有登入</Title>
        )}
      </NavWrapper>
      <Container>
        <TabWrapper>
          <TabLink to={`/${currentUser?.name}`}>My Memories</TabLink>
          <TabTitle>My Friends</TabTitle>
        </TabWrapper>
        <SplitWrapper>
          <LeftSplit />
          <RightSplit />
        </SplitWrapper>
        <ContentArea>
          <ContentWrapper>
            <InviWrapper>
              <InputWrapper>
                <QueryFriendInput />
                <QueryIconWrapper>
                  <QueryIconImg src={queryFriend} />
                </QueryIconWrapper>
              </InputWrapper>
              <ContentTitle>They want to be your friend ...</ContentTitle>
            </InviWrapper>
            <FriendsWrapper></FriendsWrapper>
          </ContentWrapper>
        </ContentArea>
      </Container>
    </>
  )
}

export default MyFriends

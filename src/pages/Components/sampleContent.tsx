import React, { useContext, Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { StreetViewService } from "@react-google-maps/api"
import xMark from "../assets/x-mark.png"
import gala1 from "../assets/samplePhotos/gala1.jpg"
import gala2 from "../assets/samplePhotos/gala2.jpg"
import gala3 from "../assets/samplePhotos/gala3.jpg"
import gala4 from "../assets/samplePhotos/gala4.jpg"
import { AuthContext } from "../Context/authContext"
import mmAvatar from "../assets/samplePhotos/mmAvatar.jpg"
import pkcAvatar from "../assets/samplePhotos/pkcAvatar.jpg"
import cyuAvatar from "../assets/samplePhotos/cyuAvatar.jpg"
import laysAvatar from "../assets/samplePhotos/laysAvatar.jpg"
import moreIcon from "../assets/buttons/moreIcon.png"
import SwiperPhotos from "./swiperPhoto"

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-height: 100%;
  width: 100%;
  background-color: rgb(45, 45, 45, 0.8);
  z-index: 120;
`
const ContentArea = styled.div`
  position: relative;
  padding: 20px;
  width: 60%;
  height: 100vh;
  margin: 0 auto;
  font-size: 4rem;
  color: #2d2d2d;
  background-color: rgb(255, 255, 255, 0.9);
  box-shadow: 0px 0px 3px 10px #232323c2;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`
const SubTitle = styled.div`
  min-height: 60px;
  @media screen and (min-width: 1100px) {
    font-size: 4rem;
  }
  @media screen and (max-width: 1100px) and (min-width: 800px) {
    font-size: 3rem;
  }
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: 2.5rem;
  }
`
const Text = styled.div`
  font-family: "Poppins", "sans-serif";
  font-size: 25px;
  margin: 25px 0;
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: 18px;
  }
`
const ArticleTitle = styled(Text)`
  font-weight: 700;
`
const Reminder = styled(Text)`
  color: #034961;
`
const TextNoMargin = styled(Text)`
  margin: 0;
  text-align: justify;
`
const LinkText = styled(TextNoMargin)`
  display: inline-block;
  margin-left: 15px;
  color: #5594b7;
  cursor: pointer;
  &:hover {
    border-bottom: 3px solid #034961;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
  }
`
const XmarkTop = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-image: url(${xMark});
  background-size: 100% 100%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  @media screen and (max-width: 799px), (max-height: 600px) {
    top: 30px;
    width: 40px;
    height: 40px;
  }
`
const StreetModeContainer = styled.div`
  height: 40vh;
`
const PhotoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  min-width: 300px;
  margin-bottom: 20px;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`
const Photo = styled.div`
  width: 100%;
  height: 200px;
  margin-bottom: 15px;
  background-size: 100% 100%;
`
const Gala1 = styled(Photo)`
  background-image: url(${gala1});
`
const Gala2 = styled(Photo)`
  background-image: url(${gala2});
`
const Gala3 = styled(Photo)`
  background-image: url(${gala3});
`
const Gala4 = styled(Photo)`
  background-image: url(${gala4});
`
const MsgNumText = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  padding-right: 20px;
  border-bottom: 2px solid #d4d4d4;
`
const MsgContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-size: 16px;
  padding-left: 8px;
  background-color: #f6f6f6;
  border: none;
  border-radius: 10px;
`
const Placeholder = styled(MsgContent)`
  align-self: center;
  line-height: 30px;
  color: #8d8d8d;
  background-color: #cbcbcb;
`
const UserAvatar = styled.div<{ photoURL: string }>`
  display: flex;
  align-self: center;
  margin-right: 5px;
  width: 30px;
  height: 30px;
  background-image: ${(props) => `url(${props.photoURL})`};
  background-size: 100% 100%;
  border-radius: 50%;
`
const MsgColumnWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  height: 300px;
`
const MsgRowNoWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin: 5px 0;
`
const BtnMore = styled.div`
  position: absolute;
  right: 40px;
  display: inline-block;
  width: 30px;
  height: 25px;
  font-size: 16px;
  background-image: url(${moreIcon});
  background-size: cover;
`
const BtnMsgDelete = styled.div`
  position: absolute;
  top: 30px;
  right: 40px;
  display: inline-block;
  text-align: center;
  padding: 5px 10px;
  line-height: 16px;
  height: 30px;
  font-size: 16px;
  color: #fff;
  background-color: #5594b7;
  border-radius: 5px;
  z-index: 30;
`

const samplePhotos = [gala1, gala2, gala3, gala4]
export function TipsContent({
  setShowTips,
}: {
  setShowTips: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Container>
      <ContentArea>
        <XmarkTop
          onClick={() => {
            setShowTips(false)
          }}
        />
        <SubTitle> Welcome to My Travel Pins !</SubTitle>
        <Text>
          Without login, <br />
          you can use Robot Widget on the right hand side to query useful
          information.
        </Text>
        <Text>
          After successful login, <br />
          you can do the followings :
          <br />
          1. Own your map to save your travel memories
          <br />
          2. Add a marker on your map <br />
          3. Post your travel memory related to this place <br />
          4. Visit your friend to see their memories
        </Text>
      </ContentArea>
    </Container>
  )
}

export function SampleMemory({
  setShowSamplePost,
  setHasRead,
  setIsSignUp,
  setIsSignIn,
}: {
  setShowSamplePost: Dispatch<SetStateAction<boolean>>
  setHasRead: Dispatch<SetStateAction<boolean>>
  setIsSignUp: Dispatch<SetStateAction<boolean>>
  setIsSignIn: Dispatch<SetStateAction<boolean>>
}) {
  const { isLoaded } = useContext(AuthContext)
  const onStreetLoad = () => {
    new google.maps.StreetViewPanorama(
      document.getElementById("street-mode-container") as HTMLElement,
      {
        position: new google.maps.LatLng(36.9505502, 138.7990597),
        pov: {
          heading: 90,
          pitch: 10,
        },
        fullscreenControl: false,
        addressControl: false,
      }
    )
  }
  const users = [
    { name: "Henry Chen", avatar: pkcAvatar, msg: "攝影師拍得真好！" },
    { name: "ChengCheng", avatar: cyuAvatar, msg: "我想認識櫻花妹！" },
    { name: "Lays Wang", avatar: laysAvatar, msg: "爬不起來?" },
  ]
  return (
    <Container>
      <ContentArea>
        <XmarkTop
          onClick={() => {
            setShowSamplePost(false)
            setHasRead(true)
          }}
        />
        <ArticleTitle>My First Time Skiing </ArticleTitle>
        <TextNoMargin>Mar.2019</TextNoMargin>
        <SwiperPhotos photos={samplePhotos} />
        {/* <PhotoWrapper>
          <Gala3 />
          <Gala4 />
          <Gala1 />
          <Gala2 />
        </PhotoWrapper> */}
        <Text>
          As a member, you can...
          <br />
          - upload photos, post an article to save your travel memories here!
          <br />
          - leave messages with your friends!
          <br />
          <Reminder>
            Note: Only your friends have access to your memories.
          </Reminder>
          <br />
          <MsgNumText>4則留言</MsgNumText>
          <MsgColumnWrapper>
            <MsgRowNoWrapper>
              <UserAvatar photoURL={mmAvatar} />
              <Placeholder>Leave message...</Placeholder>
            </MsgRowNoWrapper>
            <MsgRowNoWrapper>
              <UserAvatar photoURL={mmAvatar} />
              <MsgContent>
                Mika
                <br />
                許願：2024冬天去滑雪！
              </MsgContent>
              <BtnMore />
              <BtnMsgDelete>Delete</BtnMsgDelete>
            </MsgRowNoWrapper>
            {users.map((user) => (
              <MsgRowNoWrapper key={user.name}>
                <UserAvatar photoURL={user.avatar} />
                <MsgContent>
                  {user.name}
                  <br />
                  {user.msg}
                </MsgContent>
              </MsgRowNoWrapper>
            ))}
          </MsgColumnWrapper>
          Also, visitors can see other details about the place you went from
          Google streetView service!
          <br />
          Maybe they will go there too in the future!
        </Text>

        <TextNoMargin> GALA湯沢スキー場</TextNoMargin>
        {isLoaded && (
          <StreetModeContainer id="street-mode-container">
            <StreetViewService onLoad={onStreetLoad} />
          </StreetModeContainer>
        )}
        <br />
        <TextNoMargin>
          Not a member yet?
          <LinkText
            onClick={() => {
              setShowSamplePost(false)
              setHasRead(true)
              setIsSignUp(true)
            }}
          >
            Sign up
          </LinkText>
        </TextNoMargin>
        <TextNoMargin>
          Already have an account?
          <LinkText
            onClick={() => {
              setShowSamplePost(false)
              setHasRead(true)
              setIsSignIn(true)
            }}
          >
            Sign in
          </LinkText>
        </TextNoMargin>
        <TextNoMargin>
          Not decided yet?
          <LinkText
            onClick={() => {
              setShowSamplePost(false)
              setHasRead(true)
            }}
          >
            Back to Home
          </LinkText>
        </TextNoMargin>
      </ContentArea>
    </Container>
  )
}

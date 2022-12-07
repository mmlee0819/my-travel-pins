import React, { useContext, Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { StreetViewService, GoogleMap, Marker } from "@react-google-maps/api"
import xMark from "../assets/buttons/x-mark.png"
import gala1 from "../assets/samplePhotos/gala1.jpg"
import gala2 from "../assets/samplePhotos/gala2.jpg"
import gala3 from "../assets/samplePhotos/gala3.jpg"
import gala4 from "../assets/samplePhotos/gala4.jpg"
import { AuthContext } from "../context/authContext"
import mmAvatar from "../assets/samplePhotos/mmAvatar.jpg"
import pkcAvatar from "../assets/samplePhotos/pkcAvatar.jpg"
import cyuAvatar from "../assets/samplePhotos/cyuAvatar.jpg"
import laysAvatar from "../assets/samplePhotos/laysAvatar.jpg"
import moreIcon from "../assets/buttons/moreIcon.png"
import SwiperPhotos from "./pinContent/swiperPhoto"
import calendar from "../assets/calendar.png"
import location from "../assets/location.png"

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(45, 45, 45, 0.8);
  border-radius: 5px;
  z-index: 120;
`
const ContentArea = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex: row nowrap;
  padding: 20px;
  width: 80%;
  height: 80%;
  margin: 0 auto;
  font-size: ${(props) => props.theme.title.lg};
  color: #2d2d2d;
  background-color: rgb(255, 255, 255, 0.9);
`
const LeftWrapper = styled.div`
  position: relative;
  align-self: center;
  width: 50%;
  height: 90%;
`
const RightWrapper = styled.div`
  position: relative;
  align-self: center;
  width: 45%;
  height: 90%;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`
const MiddleSplit = styled.div`
  margin: 0 20px 0 10px;
  border-left: 2px dashed #454545;
  height: 100%;
`
const IconInList = styled.img`
  align-self: center;
  margin-right: 10px;
  width: 20px;
  height: 20px;
`
const SubTitle = styled.div`
  min-height: 60px;
  @media screen and (min-width: 1100px) {
    font-size: ${(props) => props.theme.title.lg};
  }
  @media screen and (max-width: 1100px) and (min-width: 800px) {
    font-size: ${(props) => props.theme.title.md};
  }
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const Text = styled.div`
  font-size: ${(props) => props.theme.title.md};
  margin: 25px 0;
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.sm};
  }
`
const ArticleTitle = styled(Text)`
  margin: 0;
  font-weight: 700;
`
const Reminder = styled(Text)`
  color: ${(props) => props.theme.color.deepMain};
`
const TextNoMargin = styled(Text)`
  display: flex;
  margin: 10px 0;
  text-align: justify;
`
const LinkText = styled(TextNoMargin)`
  display: inline-block;
  margin: 0 0 0 15px;
  font-weight: 700;
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
const Xmark = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-image: url(${xMark});
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  @media screen and (max-width: 799px), (max-height: 600px) {
    top: 30px;
    width: 15px;
    height: 15px;
  }
`
const StreetModeContainer = styled.div`
  height: 40vh;
`

const MsgNumText = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
  border-bottom: 2px solid #d4d4d4;
`
const MsgContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  font-size: ${(props) => props.theme.title.md};
  padding-left: 8px;
  background-color: #f6f6f6;
  border: none;
  border-radius: 5px;
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
  right: 10px;
  display: inline-block;
  width: 30px;
  height: 25px;
  font-size: ${(props) => props.theme.title.md};
  background-image: url(${moreIcon});
  background-size: cover;
`
const BtnMsgDelete = styled.div`
  position: absolute;
  top: 30px;
  right: 0px;
  display: inline-block;
  text-align: center;
  padding: 5px 10px;
  line-height: 16px;
  height: 30px;
  font-size: ${(props) => props.theme.title.md};
  color: #fff;
  background-color: ${(props) => props.theme.btnColor.bgGreen};
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
        <Xmark
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
        fullscreenControl: true,
        addressControl: false,
        scrollwheel: false,
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
        <Xmark
          onClick={() => {
            setShowSamplePost(false)
            setHasRead(true)
          }}
        />
        <LeftWrapper>
          <SwiperPhotos photos={samplePhotos} />
        </LeftWrapper>
        <MiddleSplit />
        <RightWrapper>
          <ArticleTitle>My First Time Skiing </ArticleTitle>
          <TextNoMargin>
            <IconInList src={calendar} />
            2019-03-06
          </TextNoMargin>

          <Text>
            As a member, you can
            <br />
            - upload photos, post an article to save your travel memories here!
            <br />
            - leave messages with your friends!
            <br />
            <Reminder>
              Note: <br />
              Only your friends have access to your memories.
            </Reminder>
            <br />
            <MsgNumText>4則留言</MsgNumText>
            <br />
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
            <br />
            Also, visitors can see other details about the place you went from
            Google streetView service!
            <br />
            Maybe they will go there too in the future!
          </Text>

          <TextNoMargin>
            <IconInList src={location} />
            GALA湯沢スキー場
          </TextNoMargin>
          {isLoaded && (
            <>
              <StreetModeContainer id="street-mode-container">
                <StreetViewService onLoad={onStreetLoad} />
              </StreetModeContainer>
              <GoogleMap
                mapContainerStyle={{
                  height: "40vh",
                  width: "100%",
                  marginTop: "20px",
                }}
                center={{
                  lat: 36.9505502,
                  lng: 138.7990597,
                }}
                zoom={14}
                options={{
                  draggable: true,
                  mapTypeControl: false,
                  streetViewControl: false,
                  scaleControl: false,
                  fullscreenControl: false,
                  scrollwheel: false,
                }}
              >
                <Marker
                  position={{
                    lat: 36.9505502,
                    lng: 138.7990597,
                  }}
                />
              </GoogleMap>
            </>
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
        </RightWrapper>
      </ContentArea>
    </Container>
  )
}

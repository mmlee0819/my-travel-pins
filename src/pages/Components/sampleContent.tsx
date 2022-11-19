import React, { useContext, Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { StreetViewService } from "@react-google-maps/api"
import xMark from "../assets/x-mark.png"
import gala1 from "../assets/samplePhotos/gala1.jpg"
import gala2 from "../assets/samplePhotos/gala2.jpg"
import gala3 from "../assets/samplePhotos/gala3.jpg"
import gala4 from "../assets/samplePhotos/gala4.jpg"
import { AuthContext } from "../Context/authContext"

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
  overflow-y: scroll;
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
const TextNoMargin = styled(Text)`
  margin: 0;
  text-align: justify;
`
const LinkText = styled(TextNoMargin)`
  display: inline-block;
  padding-left: 15px;
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
        fullscreenControl: false,
        addressControl: false,
      }
    )
  }

  return (
    <Container>
      <ContentArea>
        <Xmark
          onClick={() => {
            setShowSamplePost(false)
            setHasRead(true)
          }}
        />
        <Text>My First Time Skiing </Text>
        <TextNoMargin>Mar.2019</TextNoMargin>
        <PhotoWrapper>
          <Gala3 />
          <Gala4 />
          <Gala1 />
          <Gala2 />
        </PhotoWrapper>
        <Text>
          As a member, <br />
          you can upload photos, post an article to save your travel memories
          here!
          <br />
          <br />
          Also, you can use Google streetView service below.
          <br />
          The location information is based on the marker you added.
        </Text>
        <Text>
          Not a member yet?{" "}
          <LinkText
            onClick={() => {
              setShowSamplePost(false)
              setHasRead(true)
              setIsSignUp(true)
            }}
          >
            Sign up
          </LinkText>
        </Text>
        <Text>
          Already have an account?{" "}
          <LinkText
            onClick={() => {
              setShowSamplePost(false)
              setHasRead(true)
              setIsSignIn(true)
            }}
          >
            Sign in
          </LinkText>
        </Text>
        <TextNoMargin> GALA湯沢スキー場</TextNoMargin>
        {isLoaded && (
          <StreetModeContainer id="street-mode-container">
            <StreetViewService onLoad={onStreetLoad} />
          </StreetModeContainer>
        )}
      </ContentArea>
    </Container>
  )
}

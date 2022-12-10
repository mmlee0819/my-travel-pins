import React, { useContext, Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { StreetViewService, GoogleMap, Marker } from "@react-google-maps/api"
import { FreeMode, Navigation, Thumbs } from "swiper"
import { AuthContext } from "../context/authContext"
import { MapContext } from "../context/mapContext"
import SwiperPhotos from "./pinContent/swiperPhoto"
import xMark from "../assets/buttons/x-mark.png"
import tip1 from "../assets/samplePhotos/1.png"
import tip2 from "../assets/samplePhotos/2.png"
import tip3 from "../assets/samplePhotos/3.png"
import tip4 from "../assets/samplePhotos/4.png"
import tip5 from "../assets/samplePhotos/5.png"
import tip6 from "../assets/samplePhotos/6.png"
import tip7 from "../assets/samplePhotos/7.png"

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 10px;
  max-width: 1440px;
  width: calc(100% - 120px);
  height: calc(100vh - 120px);
  background-color: rgb(45, 45, 45, 0.8);
  border-radius: 5px;
  z-index: 199;
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
const Title = styled.div`
  min-height: 60px;
  font-weight: 700;
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
  margin: 20px 0;
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
  font-size: ${(props) => props.theme.title.sm};
`

const Xmark = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-image: url(${xMark});
  background-size: 100% 100%;
  width: 15px;
  height: 15px;
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
interface Props {
  setShowTips?: Dispatch<SetStateAction<boolean>>
  setCurrentWidget?: Dispatch<SetStateAction<string>>
}
const samplePhotos = [tip1, tip2, tip3, tip4, tip5, tip6, tip7]
const sampleSwiperModule = [FreeMode, Navigation, Thumbs]

export default function TipsContent(props: Props) {
  const { isLogin } = useContext(AuthContext)
  const { isLoaded } = useContext(MapContext)
  const { setShowTips, setCurrentWidget } = props
  const onStreetLoad = () => {
    new google.maps.StreetViewPanorama(
      document.getElementById("street-mode-container") as HTMLElement,
      {
        position: new google.maps.LatLng(33.94653540000001, 130.9616792),
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

  const handleCloseTips = () => {
    if (setShowTips) {
      setShowTips(false)
    }
    if (setCurrentWidget) {
      setCurrentWidget("")
    }
  }

  return (
    <Container>
      <ContentArea>
        <Xmark onClick={handleCloseTips} />
        <LeftWrapper>
          <SwiperPhotos
            photos={samplePhotos}
            swiperModule={sampleSwiperModule}
          />
        </LeftWrapper>
        <MiddleSplit />
        <RightWrapper>
          <Title> Welcome to My Travel Pins !</Title>
          {!isLogin && (
            <>
              <ArticleTitle>Without login, you can </ArticleTitle>
              <Text>
                <li>Use weather widget and currency widget</li>
              </Text>
            </>
          )}
          <ArticleTitle>As a member, you can </ArticleTitle>
          <Text>
            <li> Own your map and Pin markers</li>
            <li>Post and Review your memories</li>
            <li> Visit and Interact with your friends</li>
            <br />
            Also, visitors can see other details about the place you went from
            Google streetView service!
            <br />
            Maybe they will go there too in the future!
          </Text>
          <Reminder>
            Note: Only your friends have access to your memories.
          </Reminder>
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
                  lat: 33.94653540000001,
                  lng: 130.9616792,
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
                    lat: 33.94653540000001,
                    lng: 130.9616792,
                  }}
                />
              </GoogleMap>
            </>
          )}
        </RightWrapper>
      </ContentArea>
    </Container>
  )
}

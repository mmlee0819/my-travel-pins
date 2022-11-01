import React from "react"
import styled from "styled-components"
import { useState, useRef, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "./Context/authContext"
import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api"
import { containerStyle, centerSchool, myGoogleApiKey } from "./Utils/gmap"
import { darkMap } from "./User/darkMap"

const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 80%;
  margin: 0 auto;
`

const Title = styled.div`
  color: #000000;
`
const BtnLink = styled(Link)`
  margin: 0 20px;
`

const FormWrapper = styled.form`
  position: absolute;
  top: 60px;
  display: flex;
  flex-flow: column wrap;
  width: 80%;
  margin: 0 auto;
  padding: 30px;
  gap: 20px;
  background-color: #ffffff;
  opacity: 0.6;
`
const Input = styled.input`
  height: 40px;
`
const BtnWrapper = styled.div`
  position: absolute;
  top: 350px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 50px;
  background-color: #ffffff;
  opacity: 0.6;
  gap: 20px;
`
const Btn = styled.div`
  color: #000000;
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 10px;
`

function Home() {
  const nameRef = useRef<HTMLInputElement>(null!)
  const emailRef = useRef<HTMLInputElement>(null!)
  const pwRef = useRef<HTMLInputElement>(null!)
  const [hometownBox, setHometownBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  const [result, setResult] = useState<google.maps.places.PlaceResult[]>()
  const onPlacesChanged = () => {
    if (hometownBox instanceof google.maps.places.SearchBox) {
      console.log(hometownBox.getPlaces())
      const searchResult = hometownBox.getPlaces()
      setResult(searchResult)
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setHometownBox(ref)

  const { isLogin, signUp, signIn, logOut } = useContext(AuthContext)
  console.log("isLogin", isLogin)
  return (
    <Wrapper>
      <Title>我是首頁</Title>

      {isLogin ? (
        ""
      ) : (
        <LoadScript googleMapsApiKey={myGoogleApiKey!} libraries={["places"]}>
          <GoogleMap
            id="my-map"
            mapTypeId="94ce067fe76ff36f"
            mapContainerStyle={containerStyle}
            center={centerSchool}
            zoom={2}
            options={{ draggable: true, styles: darkMap }}
          >
            <FormWrapper>
              <Input ref={nameRef} name="userName" placeholder="name" />
              <Input
                ref={emailRef}
                name="accountEmail"
                placeholder="xxx@xxxxx"
              />
              <Input
                ref={pwRef}
                name="password"
                placeholder="at least 6 letters"
              />
              <StandaloneSearchBox
                onLoad={onLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <Input placeholder="Your hometown"></Input>
              </StandaloneSearchBox>
            </FormWrapper>
          </GoogleMap>
        </LoadScript>
      )}
      <BtnWrapper>
        {isLogin ? (
          ""
        ) : (
          <>
            <Btn
              onClick={() => {
                signUp(
                  nameRef.current.value,
                  emailRef.current.value,
                  pwRef.current.value,
                  result!
                )
              }}
            >
              Sign up
            </Btn>
            <Btn
              onClick={() => {
                signIn(emailRef.current.value, pwRef.current.value)
              }}
            >
              Sign in
            </Btn>
          </>
        )}
        {isLogin ? (
          <Btn
            onClick={() => {
              logOut()
            }}
          >
            Sign out
          </Btn>
        ) : (
          ""
        )}
      </BtnWrapper>

      <BtnLink to="/mika">點我去user的地圖頁</BtnLink>
      <BtnLink to="/mika/my-memories">點我去user的memories列表</BtnLink>
      <BtnLink to="/mika/my-friends">點我去user的friends列表</BtnLink>
    </Wrapper>
  )
}

export default Home

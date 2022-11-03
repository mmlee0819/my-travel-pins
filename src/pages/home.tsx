import React from "react"
import styled from "styled-components"
import { useState, useRef, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "./Context/authContext"
import { GoogleMap, StandaloneSearchBox } from "@react-google-maps/api"
import { containerStyle, centerSchool } from "./Utils/gmap"
import { darkMap } from "./User/darkMap"

const Wrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  margin: 0;
`

const LoginArea = styled.div`
  position: relative;
  align-items: center;
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
  display: inline-block;
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

  const { isLoaded, currentUser, isLogin, signUp, signIn, logOut } =
    useContext(AuthContext)
  console.log("isLoaded", isLoaded)
  console.log("isLogin", isLogin)

  if (!isLoaded) return <Title>Please wait...</Title>
  return (
    <Wrapper>
      <Title>我是首頁</Title>
      {isLogin && currentUser !== undefined ? (
        <>
          <LoginArea>
            <BtnLink to={`/${currentUser.name}`}>my-map</BtnLink>
            <BtnLink to={`/${currentUser.name}/my-memories`}>
              my-memories
            </BtnLink>
            <BtnLink to={`/${currentUser.name}/my-friends`}>my-friends</BtnLink>
            <Btn
              onClick={() => {
                logOut()
              }}
            >
              Sign out
            </Btn>
          </LoginArea>
        </>
      ) : (
        ""
      )}
      <GoogleMap
        id="my-map"
        mapTypeId="94ce067fe76ff36f"
        mapContainerStyle={containerStyle}
        center={centerSchool}
        zoom={2}
        options={{ draggable: true, styles: darkMap }}
      >
        {isLogin && currentUser !== undefined ? (
          ""
        ) : (
          <>
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
            <BtnWrapper>
              <Btn
                onClick={() => {
                  if (result) {
                    signUp(
                      nameRef.current.value,
                      emailRef.current.value,
                      pwRef.current.value,
                      result
                    )
                  }
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
            </BtnWrapper>
          </>
        )}
      </GoogleMap>
    </Wrapper>
  )
}

export default Home

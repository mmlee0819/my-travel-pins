import React from "react"
import styled from "styled-components"
import { useRef, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "./Context/authContext"

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
  display: flex;
  flex-flow: column wrap;
  width: 80%;
  margin: 0 auto;
  gap: 20px;
`
const Input = styled.input`
  height: 40px;
`
const BtnWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 50px;
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
  const { signUp, signIn, logOut } = useContext(AuthContext)

  return (
    <Wrapper>
      <Title>我是首頁</Title>
      <FormWrapper>
        <Input ref={nameRef} name="userName" placeholder="name" />
        <Input ref={emailRef} name="accountEmail" placeholder="xxx@xxxxx" />
        <Input ref={pwRef} name="password" placeholder="at least 6 letters" />
      </FormWrapper>
      <BtnWrapper>
        <Btn
          onClick={() => {
            signUp(
              nameRef.current.value,
              emailRef.current.value,
              pwRef.current.value
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
        <Btn
          onClick={() => {
            logOut()
          }}
        >
          Sign out
        </Btn>
      </BtnWrapper>

      <BtnLink to="/mika">點我去user的地圖頁</BtnLink>
      <BtnLink to="/mika/my-memories">點我去user的memories列表</BtnLink>
      <BtnLink to="/mika/my-friends">點我去user的friends列表</BtnLink>
    </Wrapper>
  )
}

export default Home

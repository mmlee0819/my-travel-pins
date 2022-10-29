import React from "react"
import { createGlobalStyle } from "styled-components"
import { Outlet } from "react-router-dom"

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  }
  body {
     font-family: 'Noto Sans TC', sans-serif;
   }

  #root {
     min-height: 100vh;
  }
`
function App() {
  return (
    <>
      <GlobalStyle />
      <Outlet />
    </>
  )
}

export default App

import React from "react"
import { createGlobalStyle } from "styled-components"

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
    </>
  )
}

export default App

import React from "react"
import { createGlobalStyle } from "styled-components"
import { Outlet } from "react-router-dom"
import { AuthContextProvider } from "./pages/Context/authContext"
import ToolsRobot from "./pages/Utils/tools"

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  }
  body {
     font-family: 'Noto Sans TC', sans-serif;
   }

  #root {
    position: relative;
    min-height: 100vh;
  }
`
function App() {
  return (
    <>
      <AuthContextProvider>
        <GlobalStyle />
        <ToolsRobot />
        <Outlet />
      </AuthContextProvider>
    </>
  )
}

export default App

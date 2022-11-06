import React from "react"
import { createGlobalStyle } from "styled-components"
import { Outlet } from "react-router-dom"
import { AuthContextProvider } from "./pages/Context/authContext"
import { ToolContextProvider } from "./pages/Context/toolContext"
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
        <ToolContextProvider>
          <GlobalStyle />
          <ToolsRobot />
          <Outlet />
        </ToolContextProvider>
      </AuthContextProvider>
    </>
  )
}

export default App

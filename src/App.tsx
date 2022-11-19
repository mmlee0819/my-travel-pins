import React from "react"
import { createGlobalStyle } from "styled-components"
import { Outlet } from "react-router-dom"
import { AuthContextProvider } from "./pages/Context/authContext"
import { ToolContextProvider } from "./pages/Context/toolContext"
import ToolsRobot from "./pages/Utils/tools"
import Header from "./pages/Components/header"

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  }
  body {
    font-family: "Jomhuria","Poppins","sans-serif";
   }
  #root {
    position: relative;
    min-height: 100vh;
    padding:60px;
    color:#fff;
    background-color: #5594b7;
  }

 
`
function App() {
  return (
    <>
      <AuthContextProvider>
        <ToolContextProvider>
          <GlobalStyle />
          <ToolsRobot />
          <Header />
          <Outlet />
        </ToolContextProvider>
      </AuthContextProvider>
    </>
  )
}

export default App

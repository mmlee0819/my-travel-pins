import React from "react"
import {
  DefaultTheme,
  createGlobalStyle,
  ThemeProvider,
} from "styled-components"
import { Outlet } from "react-router-dom"

import { MapContextProvider } from "./context/mapContext"
import { AuthContextProvider } from "./context/authContext"
import { ToolContextProvider } from "./context/toolContext"
import { Reminder } from "./components/reminder"
import ToolsRobot from "./components/widgets/tools"
import Header from "./components/header"
import bg from "./assets/bg.jpg"

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  }
     
  body {
    font-family: "Poppins","sans-serif";
    overflow: hidden;
   }
  #root {
    position: relative;
    min-height: 100vh;
    padding: 10px 60px;
    color:#fff;
    background-image: url(${bg});
    background-size: 100% 100%;
    @media screen and (min-width: 300px) and (max-width: 700px){
      padding: 10px 30px;
    }
  }
`
const theme: DefaultTheme = {
  title: { sm: "14px", md: "18px", lg: "20px" },
  color: {
    deepMain: "#034961",
    lightMain: "#5384a9",
    bgDark: "#454545",
    bgLight: "#ffffff",
    lightGreen: "#7ccbab",
    orange: "#f99c62",
  },
  btnColor: {
    bgGreen: "#a5b7af",
    bgBlue: "#5397bd",
    bgGray: "#b4b1b1",
  },
  border: { commonRadius: "5px" },
}
function App() {
  return (
    <ToolContextProvider>
      <AuthContextProvider>
        <MapContextProvider>
          <GlobalStyle />
          <Reminder />
          <ThemeProvider theme={theme}>
            <Header />
            <ToolsRobot />
            <Outlet />
          </ThemeProvider>
        </MapContextProvider>
      </AuthContextProvider>
    </ToolContextProvider>
  )
}

export default App

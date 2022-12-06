import React from "react"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import { Outlet } from "react-router-dom"
import { AuthContextProvider } from "./context/authContext"
import { ToolContextProvider } from "./context/toolContext"
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
  }
`
const theme = {
  screens: {
    xs: "375px",
    sm: "600px",
    md: "900px",
    lg: "1200px",
    xl: "1440px",
  },
  title: { sm: "14px", md: "18px", lg: "20px" },
  color: {
    deepMain: "#034961",
    lightMain: "#5384a9",
    bgDark: "#454545",
    bgLight: "#ffffff",
  },
  btnColor: {
    bgGreen: "#a5b7af",
    bgRed: "#c56363",
    bgBlue: "#5397bd",
    bgGray: "#b4b1b1",
  },
  border: { commonRadius: "5px" },
}
function App() {
  return (
    <AuthContextProvider>
      <ToolContextProvider>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Header />
          <ToolsRobot />
          <Outlet />
        </ThemeProvider>
      </ToolContextProvider>
    </AuthContextProvider>
  )
}

export default App

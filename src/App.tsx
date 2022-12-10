import React, { useContext } from "react"
import { createGlobalStyle, ThemeProvider } from "styled-components"
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
    <MapContextProvider>
      <ToolContextProvider>
        <AuthContextProvider>
          <GlobalStyle />
          <Reminder />
          <ThemeProvider theme={theme}>
            <Header />
            <ToolsRobot />
            <Outlet />
          </ThemeProvider>
        </AuthContextProvider>
      </ToolContextProvider>
    </MapContextProvider>
  )
}

export default App

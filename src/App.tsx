import React from "react"
import { createGlobalStyle, ThemeProvider } from "styled-components"
import { Outlet } from "react-router-dom"
import { AuthContextProvider } from "./pages/Context/authContext"
import { ToolContextProvider } from "./pages/Context/toolContext"
import ToolsRobot from "./pages/Utils/tools"
import Header from "./pages/Components/header"
import bg from "../src/pages/assets/bg.jpg"

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
  }
     
 /* @font-face {
      font-family: "Jomhuria";
      src: url("Jomhuria-Regular.ttf") ;
      size-adjust: "60%";
      unicode-range: "U+4E00-9FFF";
  } */
  
  body {
    font-family: "Poppins","sans-serif";
   }
  #root {
    position: relative;
    min-height: 100vh;
    padding: 10px 60px 20px 60px;
    color:#fff;
    background-image: url(${bg});
    background-size: 100% 100%;
        /* background: linear-gradient(#0f3a49,#5594b7,#0f3a49); */
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
  title: { sm: "14px", md: "18px", lg: "24px" },
  subTitle: { sm: "14px", md: "1rem", lg: "29px", xl: "29px" },
  color: {
    deepMain: "#034961",
    lightMain: "#7ccbab",
    bgDark: "#454545",
    bgLight: "#ffffff",
  },
  btnColor: {
    bgGreen: "#a5b7af",
    bgRed: "#ca3434",
    bgBlue: "#5397bd",
  },
  border: { commonRadius: "5px" },
}
function App() {
  return (
    <AuthContextProvider>
      <ToolContextProvider>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <ToolsRobot />
          <Header />
          <Outlet />
        </ThemeProvider>
      </ToolContextProvider>
    </AuthContextProvider>
  )
}

export default App

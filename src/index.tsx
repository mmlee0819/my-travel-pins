import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import App from "./App"
import Home from "./pages/landing-leaflet"
// import Home from "./pages/home"
import User from "./pages/User/myMap"
import MyMemories from "./pages/User/myMemories"
import MyFriends from "./pages/User/myFriends"
import FriendsHome from "./pages/User/friendHome"
import FriendMemories from "./pages/User/friendMemories"

import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />}></Route>
          <Route path="/:user" element={<User />}></Route>
          <Route path="/:user/my-memories" element={<MyMemories />}></Route>
          <Route path="/:user/my-friends" element={<MyFriends />}></Route>
          <Route
            path="/:user/my-friend/:friendName/:friendId"
            element={<FriendsHome />}
          ></Route>
          <Route
            path="/:user/my-friend/:friendName/:friendId/memories"
            element={<FriendMemories />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

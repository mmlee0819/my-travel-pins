import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./index.css"
import App from "./App"
import Home from "./pages/landing"
import MyMap from "./pages/user/myMap"
import MyMemories from "./pages/user/myMemories"
import MyFriends from "./pages/user/myFriends"
import FriendsMap from "./pages/user/friendMap"
import FriendMemories from "./pages/user/friendMemories"

import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="/:user" element={<MyMap />} />
        <Route path="/:user/my-memories" element={<MyMemories />} />
        <Route path="/:user/my-friends" element={<MyFriends />} />
        <Route
          path="/:user/my-friend/:friendName/:friendId"
          element={<FriendsMap />}
        />
        <Route
          path="/:user/my-friend/:friendName/:friendId/memories"
          element={<FriendMemories />}
        />
      </Route>
    </Routes>
  </BrowserRouter>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

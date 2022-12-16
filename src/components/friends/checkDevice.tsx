import React from "react"

export function checkDevice() {
  const userAgentInfo = navigator.userAgent
  const Agents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ]
  let flag = "desktop"
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = "mobile"
      break
    }
  }
  return flag
}

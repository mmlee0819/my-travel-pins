import React from "react"
import styled from "styled-components"
import { Slide, toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import successIcon from "../assets/buttons/toastSuccessIcon.png"

const StyledContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {
    width: 30%;
  }
  .Toastify__toast-theme--dark {
    background-color: #454545c6;
  }
  .Toastify__progress-bar--success {
    background-color: #7ccbab;
  }
`
export const notify = (reminderText: string) => {
  toast.info(reminderText, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  })
}

export const notifySuccess = (reminderText: string) => {
  toast.success(reminderText, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    icon: () => <img src={successIcon} alt="successIcon" />,
  })
}

export const notifyWarn = (reminderText: string) => {
  toast.warn(reminderText, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  })
}

export const notifyError = (reminderText: string) => {
  toast.error(reminderText, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  })
}

export function Reminder() {
  return (
    <StyledContainer
      position="bottom-right"
      autoClose={5000}
      transition={Slide}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  )
}

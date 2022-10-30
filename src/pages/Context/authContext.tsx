import React from "react"
import { createContext, useState, ReactNode } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db, storage } from "../Utils/firebase"
import { ref, getDownloadURL } from "firebase/storage"
import { doc, setDoc, getDoc } from "firebase/firestore"

declare module "*.png"

interface AuthContextType {
  currentUser: {
    id: string
    name: string
    email: string
    photoURL: string
  }
  setCurrentUser: (currentUser: {
    id: string
    name: string
    email: string
    photoURL: string
  }) => void
  signUp: (name: string, email: string, password: string) => void
  isLogin: boolean
  setIsLogin: (isLogin: boolean) => void
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: {
    id: "",
    name: "",
    email: "",
    photoURL: "",
  },
  setCurrentUser: (currentUser: {
    id: string
    name: string
    email: string
    photoURL: string
  }) => Response,
  isLogin: false,
  setIsLogin: (isLogin: boolean) => Boolean,
  signUp: (name: string, email: string, password: string) => Response,
})

interface Props {
  children?: ReactNode
}

export const AuthContextProvider = ({ children }: Props) => {
  const [isLogin, setIsLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    email: "",
    photoURL: "",
  })
  // console.log("profileIcon", profileIcon)
  const signUp = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) return
    try {
      console.log("註冊中")
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      )
      const avatarPathRef = ref(storage, "defaultAvatar.png")
      const defaultAvatar = await getDownloadURL(avatarPathRef)
      const user = userCredential.user
      const userInfo = {
        id: user.uid!,
        name,
        email: user.email!,
        photoURL: defaultAvatar,
      }
      await setDoc(doc(db, "users", user.uid), userInfo)
      setCurrentUser(userInfo)
      setIsLogin(true)
      console.log("註冊完成，已登入")
    } catch (error: unknown) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ signUp, currentUser, setCurrentUser, isLogin, setIsLogin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

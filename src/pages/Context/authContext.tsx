import React from "react"
import { createContext, useState, ReactNode } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { auth, db, storage } from "../Utils/firebase"
import { ref, getDownloadURL } from "firebase/storage"
import { doc, setDoc } from "firebase/firestore"

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
  signIn: (email: string, password: string) => void
  logOut: () => void
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
  signIn: (email: string, password: string) => Response,
  logOut: () => Response,
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

  const signIn = async (email: string, password: string) => {
    if (!email || !password) return
    try {
      console.log("登入中")
      await signInWithEmailAndPassword(auth, email.trim(), password.trim())
      setIsLogin(true)
      console.log("已登入")
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const logOut = async () => {
    try {
      console.log("登出中")
      await signOut(auth)
      console.log("已登出")
      setIsLogin(false)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        logOut,
        currentUser,
        setCurrentUser,
        isLogin,
        setIsLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

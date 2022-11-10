import React from "react"
import { createContext, useState, useEffect, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { auth, db, storage } from "../Utils/firebase"
import { ref, getDownloadURL } from "firebase/storage"
import { doc, setDoc, getDoc } from "firebase/firestore"
import {
  useJsApiLoader,
  LoadScriptProps,
} from "@react-google-maps/api"

import { myGoogleApiKey } from "../Utils/gmap"
declare module "*.png"

interface AuthContextType {
  currentUser: UserInfoType | DocumentData | undefined
  setCurrentUser: (currentUser: UserInfoType | DocumentData | undefined) => void
  signUp: (
    name: string,
    email: string,
    password: string,
    searchResult: google.maps.places.PlaceResult[]
  ) => void
  signIn: (email: string, password: string) => void
  logOut: () => void
  isLogin: boolean
  setIsLogin: (isLogin: boolean) => void
  navigate: (path: string) => void
  isLoaded: boolean
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: {
    id: "",
    name: "",
    email: "",
    photoURL: "",
    hometownName: "Taipei",
    hometownLat: 25.061945,
    hometownLng: 121.5484174,
    friends: [],
  },
  setCurrentUser: (currentUser: UserInfoType | DocumentData | undefined) =>
    Response,
  isLogin: false,
  setIsLogin: (isLogin: boolean) => Boolean,
  signUp: (
    name: string,
    email: string,
    password: string,
    searchResult: google.maps.places.PlaceResult[]
  ) => Response,
  signIn: (email: string, password: string) => Response,
  logOut: () => Response,
  navigate: (path: string) => Response,
  isLoaded: true,
})

interface Props {
  children?: ReactNode
}

export interface UserInfoType {
  id: string | DocumentData
  name: string | DocumentData
  email: string | DocumentData
  photoURL: string | DocumentData
  hometownName: string
  hometownLat: number
  hometownLng: number
  friends: string[]
}
export interface DocumentData {
  [field: string]: string | number | null | undefined | string[]
}
const libraries: LoadScriptProps["libraries"] = ["places"]
export const AuthContextProvider = ({ children }: Props) => {
  const [isLogin, setIsLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState<
    UserInfoType | DocumentData | undefined
  >()

  const navigate = useNavigate()

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: myGoogleApiKey!,
    libraries,
  })

  useEffect(() => {
    const checkLoginStatus = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser !== null) {
        const docRef = doc(db, "users", currentUser.uid)
        const docSnap = await getDoc(docRef)
        const userInfo: DocumentData = docSnap.data()!
        setCurrentUser(userInfo)
        setIsLogin(true)
      } else {
        setIsLogin(false)
      }
    })
    return checkLoginStatus
  }, [])

  const signUp = async (
    name: string,
    email: string,
    password: string,
    searchResult: google.maps.places.PlaceResult[]
  ) => {
    if (!name || !email || !password) return
    try {
      console.log("註冊中")
      const engLetter = /^[a-zA-Z]*$/
      let UpdatedName = ""
      if (engLetter.test(name[0])) {
        const namesArr = name.split(" ")
        const newNameArr = namesArr.map((name) => {
          const newName = name.charAt(0).toUpperCase() + name.slice(1)
          return newName
        })
        UpdatedName = newNameArr.join(" ")
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      )
      const avatarPathRef = ref(storage, "defaultAvatar.png")
      const defaultAvatar = await getDownloadURL(avatarPathRef)
      const user = userCredential.user
      if (user) {
        const userInfo = {
          id: user.uid,
          name: UpdatedName || name,
          email: user.email,
          photoURL: defaultAvatar,
          hometownName: searchResult[0]?.name,
          hometownLat: searchResult[0]?.geometry?.location?.lat(),
          hometownLng: searchResult[0]?.geometry?.location?.lng(),
          friends: [],
        }
        await setDoc(doc(db, "users", user.uid), userInfo)
        setCurrentUser(userInfo)
        setIsLogin(true)
        console.log("註冊完成，已登入")
        navigate(`/${currentUser?.name}`)
      }
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!email || !password) return
    try {
      console.log("登入中")
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      )
      const docRef = doc(db, "users", userCredential.user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap) {
        const userInfo = docSnap.data()
        setCurrentUser(userInfo)
        setIsLogin(true)
        setIsLogin(true)
        console.log("已登入")
        navigate(`/${userInfo?.name}`)
      }
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
        navigate,
        isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

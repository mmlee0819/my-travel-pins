import React, { createContext, useState, useEffect, ReactNode } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"

import { ref, getDownloadURL } from "firebase/storage"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db, storage } from "../utils/firebase"

import { notifySuccess, notifyError } from "../components/reminder"

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
  currentFriendInfo: {
    name: string
    id: string
  }
  setCurrentFriendInfo: (currentFriendInfo: CurrentFriendInfoType) => void
  isProfile: boolean
  setIsProfile: (isProfile: boolean) => void
  avatarURL: string
  setAvatarURL: (avatarURL: string) => void
  isLoading: boolean
  setIsLoading: (isProfile: boolean) => void
  currentPage: string
  setCurrentPage: (currentPage: string) => void
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
  setCurrentUser: () => Response,
  isLogin: false,
  setIsLogin: () => Boolean,
  signUp: () => Response,
  signIn: () => Response,
  logOut: () => Response,
  navigate: () => Response,
  currentFriendInfo: {
    name: "",
    id: "",
  },
  setCurrentFriendInfo: () => Response,
  isProfile: false,
  setIsProfile: () => Response,
  avatarURL: "",
  setAvatarURL: () => Response,
  isLoading: false,
  setIsLoading: () => Response,
  currentPage: "",
  setCurrentPage: () => Response,
})

interface Props {
  children?: ReactNode
}

interface CurrentFriendInfoType {
  name: string
  id: string
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

export function AuthContextProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isProfile, setIsProfile] = useState(false)
  const [currentFriendInfo, setCurrentFriendInfo] = useState({
    name: "",
    id: "",
  })
  const [currentUser, setCurrentUser] = useState<
    UserInfoType | DocumentData | undefined
  >()
  const [avatarURL, setAvatarURL] = useState<string>("")
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState("")

  const currentPath = useLocation().pathname

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user || user === null) return
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      const userInfo: DocumentData | undefined = docSnap.data()
      if (!userInfo) {
        navigate("/")
        return
      }
      if (userInfo !== undefined && typeof userInfo?.photoURL === "string") {
        setCurrentUser(userInfo)
        setAvatarURL(userInfo?.photoURL)
        setIsLogin(true)
        setIsProfile(false)
      }
      if (userInfo && currentPath === "/") {
        navigate(`/${userInfo?.name}`)
        setIsLoading(false)
      }
    })
  }, [])

  const signUp = async (
    name: string,
    email: string,
    password: string,
    searchResult: google.maps.places.PlaceResult[]
  ) => {
    if (!name || !email || !password) return
    try {
      setIsLoading(true)
      const engLetter = /^[a-zA-Z]*$/
      let updatedName = ""
      if (engLetter.test(name[0])) {
        const namesArr = name.split(" ")
        const newNameArr = namesArr.map((word) => {
          const newName = word.charAt(0).toUpperCase() + word.slice(1)
          return newName
        })
        updatedName = newNameArr.join(" ")
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      )
      const avatarPathRef = ref(storage, "defaultProfile.png")
      const defaultAvatar = await getDownloadURL(avatarPathRef)
      const { user } = userCredential
      if (user) {
        const userInfo = {
          id: user.uid,
          name: updatedName || name,
          email: user.email,
          photoURL: defaultAvatar,
          hometownName: searchResult[0]?.name,
          hometownLat: searchResult[0]?.geometry?.location?.lat(),
          hometownLng: searchResult[0]?.geometry?.location?.lng(),
          friends: [],
        }
        await setDoc(doc(db, "users", user.uid), userInfo)
        setCurrentUser(userInfo)
        setAvatarURL(userInfo?.photoURL)
        setIsLogin(true)
        setIsProfile(false)
        setCurrentPage("myMap")
        navigate(`/${userInfo?.name}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMsg = error["message"].slice(9) as string
        notifyError(errorMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!email || !password) return
    try {
      setIsLoading(true)
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
        setAvatarURL(userInfo?.photoURL)
        setIsLogin(true)
        setIsProfile(false)
        setCurrentPage("myMap")
        navigate(`/${userInfo?.name}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMsg = error["message"].slice(9) as string
        notifyError(errorMsg)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logOut = async () => {
    setIsLoading(true)
    await signOut(auth)
    setIsLogin(false)
    setIsLoading(false)
    notifySuccess("You have successfully been logged out")
    navigate("/")
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
        currentFriendInfo,
        setCurrentFriendInfo,
        isProfile,
        setIsProfile,
        avatarURL,
        setAvatarURL,
        isLoading,
        setIsLoading,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

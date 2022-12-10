import React, { createContext, useState, useEffect, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useJsApiLoader, LoadScriptProps } from "@react-google-maps/api"
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
  isLoaded: boolean
  mapZoom: string
  setMapZoom: (mapZoom: string) => void
  isMyMap: boolean
  setIsMyMap: (isMyMap: boolean) => void
  isMyMemory: boolean
  setIsMyMemory: (isMyMemory: boolean) => void
  isMyFriend: boolean
  setIsMyFriend: (isMyFriend: boolean) => void
  isFriendHome: boolean
  setIsFriendHome: (isFriendHome: boolean) => void
  isFriendMemory: boolean
  setIsFriendMemory: (isFriendMemory: boolean) => void
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
  isLoaded: true,
  mapZoom: "lg",
  setMapZoom: () => Response,
  isMyMap: false,
  setIsMyMap: () => Response,
  isMyMemory: false,
  setIsMyMemory: () => Response,
  isMyFriend: false,
  setIsMyFriend: () => Response,
  isFriendHome: false,
  setIsFriendHome: () => Response,
  isFriendMemory: false,
  setIsFriendMemory: () => Response,
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

const libraries: LoadScriptProps["libraries"] = ["places"]
const myGoogleApiKey = process.env.REACT_APP_google_API_KEY!

export function AuthContextProvider({ children }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isProfile, setIsProfile] = useState(false)
  const [isMyMap, setIsMyMap] = useState(false)
  const [isMyMemory, setIsMyMemory] = useState(false)
  const [isMyFriend, setIsMyFriend] = useState(false)
  const [isFriendHome, setIsFriendHome] = useState(false)
  const [isFriendMemory, setIsFriendMemory] = useState(false)
  const [currentFriendInfo, setCurrentFriendInfo] = useState({
    name: "",
    id: "",
  })
  const [currentUser, setCurrentUser] = useState<
    UserInfoType | DocumentData | undefined
  >()
  const [avatarURL, setAvatarURL] = useState<string>("")
  const [mapZoom, setMapZoom] = useState<string>("lg")
  const navigate = useNavigate()
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: myGoogleApiKey,
    libraries,
  })

  const onZoomChange = () => {
    if (
      (window.innerWidth > window.innerHeight && window.innerWidth < 900) ||
      (window.innerWidth > window.innerHeight && window.innerHeight < 600)
    ) {
      setMapZoom("md")
    } else if (window.innerWidth > 900 && window.innerHeight > 600) {
      setMapZoom("lg")
    }
  }
  useEffect(() => {
    const handleResize = () => {
      // console.log("resize的window.innerWidth", window.innerWidth)
      // console.log("resize的window.innerHeight", window.innerHeight)
      if (
        (window.innerWidth > window.innerHeight && window.innerWidth < 900) ||
        (window.innerWidth > window.innerHeight && window.innerHeight < 600)
      ) {
        setMapZoom("md")
      } else if (
        window.innerWidth > window.innerHeight &&
        window.innerWidth > 900 &&
        window.innerHeight > 600
      ) {
        setMapZoom("lg")
      }
    }

    onZoomChange()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [mapZoom])

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user !== null) {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        const userInfo: DocumentData | undefined = docSnap.data()
        if (userInfo !== undefined && typeof userInfo?.photoURL === "string") {
          setCurrentUser(userInfo)
          setAvatarURL(userInfo?.photoURL)
          setIsLogin(true)
          setIsProfile(false)
          // setIsMyMap(true)
          // navigate(`/${userInfo?.name}`)
        }
      } else {
        setIsLogin(false)
        navigate("/")
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
      let UpdatedName = ""
      if (engLetter.test(name[0])) {
        const namesArr = name.split(" ")
        const newNameArr = namesArr.map((word) => {
          const newName = word.charAt(0).toUpperCase() + word.slice(1)
          return newName
        })
        UpdatedName = newNameArr.join(" ")
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
        setAvatarURL(userInfo?.photoURL)
        setIsLogin(true)
        setIsMyFriend(false)
        setIsMyMap(true)
        setIsProfile(false)
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
        setIsMyFriend(false)
        setIsMyMap(true)
        setIsProfile(false)
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
        isLoaded,
        mapZoom,
        setMapZoom,
        isMyMap,
        setIsMyMap,
        isMyMemory,
        setIsMyMemory,
        isMyFriend,
        setIsMyFriend,
        isFriendHome,
        setIsFriendHome,
        isFriendMemory,
        setIsFriendMemory,
        currentFriendInfo,
        setCurrentFriendInfo,
        isProfile,
        setIsProfile,
        avatarURL,
        setAvatarURL,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

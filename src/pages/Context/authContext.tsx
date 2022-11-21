import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
} from "react"
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
import { auth, db, storage } from "../Utils/firebase"
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
  mapZoom: "lg",
  setMapZoom: (mapZoom: string) => Response,
  isMyMap: false,
  setIsMyMap: (isMyMap: boolean) => Response,
  isMyMemory: false,
  setIsMyMemory: (isMyMemory: boolean) => Response,
  isMyFriend: false,
  setIsMyFriend: (isMyFriend: boolean) => Response,
  isFriendHome: false,
  setIsFriendHome: (isFriendHome: boolean) => Response,
  isFriendMemory: false,
  setIsFriendMemory: (isFriendMemory: boolean) => Response,
  currentFriendInfo: {
    name: "",
    id: "",
  },
  setCurrentFriendInfo: (currentFriendInfo: CurrentFriendInfoType) => Response,
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

export function AuthContextProvider({ children }: Props) {
  const [isLogin, setIsLogin] = useState(false)
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
  const [mapZoom, setMapZoom] = useState<string>("lg")
  console.log("mapZoom", mapZoom)
  const navigate = useNavigate()
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: myGoogleApiKey!,
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
        // console.log("條件1的window.innerWidth", window.innerWidth)
        // console.log("條件1的window.innerHeight", window.innerHeight)
        setMapZoom("md")
      } else if (
        window.innerWidth > window.innerHeight &&
        window.innerWidth > 900 &&
        window.innerHeight > 600
      ) {
        // console.log("條件2的window.innerWidth", window.innerWidth)
        // console.log("條件2的window.innerHeight", window.innerHeight)
        setMapZoom("lg")
      }
    }
    // console.log("初始window.innerWidth", window.innerWidth)
    // console.log("初始window.innerHeight", window.innerHeight)
    onZoomChange()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [mapZoom])

  useEffect(() => {
    const checkLoginStatus = onAuthStateChanged(auth, async (user) => {
      try {
        if (user !== null) {
          const docRef = doc(db, "users", user.uid)
          const docSnap = await getDoc(docRef)
          const userInfo: DocumentData | undefined = docSnap.data()
          setCurrentUser(userInfo)
          setIsLogin(true)
          setIsMyMap(true)
          navigate(`/${userInfo?.name}`)
        } else {
          setIsLogin(false)
        }
      } catch (error) {
        console.log(error)
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
        setIsLogin(true)
        setIsMyFriend(false)
        setIsMyMap(true)
        console.log("註冊完成，已登入")
        navigate(`/${userInfo?.name}`)
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
        setIsMyFriend(false)
        setIsMyMap(true)
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
      navigate("/")
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

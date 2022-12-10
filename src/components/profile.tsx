import React from "react"
import { useState, useRef, useContext, useEffect, Dispatch } from "react"
import styled from "styled-components"
import { db, storage } from "../utils/firebase"
import imageCompression from "browser-image-compression"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { doc, updateDoc } from "firebase/firestore"
import { AuthContext } from "../context/authContext"
import logoutIcon from "../assets/buttons/logoutIcon.png"
import editPencil from "../assets/buttons/edit.png"
import spinner from "../assets/dotsSpinner.svg"
import { notifyError } from "./reminder"

const BgOverlay = styled.div`
  position: absolute;
  top: 70px;
  left: 60px;
  margin: 0 auto;
  max-width: 1440px;
  width: calc(100% - 120px);
  height: calc(100vh - 120px);
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 5px;
  z-index: 120;
`
const ProfileArea = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 300px;
  padding: 30px;
  font-size: ${(props) => props.theme.title.lg};
  font-weight: 700;
  color: ${(props) => props.theme.color.bgLight};
  background-color: ${(props) => props.theme.color.bgDark};
  box-shadow: rgb(120 120 120) 0px 0px 5px;
  opacity: 0.97;
  border-radius: 5px;
  gap: 30px;
  z-index: 52;
  @media screen and(max-width: 600px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const Text = styled.div`
  display: flex;
  letter-spacing: 2px;
  border: none;
  gap: 5px;

  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
  }
`
const BtnText = styled(Text)`
  align-items: center;
  cursor: pointer;
`
const BtnLogout = styled.div`
  display: flex;
  width: 20px;
  height: 20px;
  background-image: url(${logoutIcon});
  background-size: 100% 100%;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    width: 15px;
    height: 15px;
  }
`
const BtnEdit = styled(BtnLogout)`
  position: absolute;
  top: 35px;
  right: 30px;
  background-image: url(${editPencil});
`
const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  width: 150px;
  height: 150px;
  margin: 30px auto 60px auto;
  cursor: pointer;
`
const UploadInput = styled.input`
  display: none;
`
const UserAvatar = styled.div<{ photoURL: string }>`
  display: flex;
  align-self: center;
  width: 150px;
  height: 150px;
  margin: 30px auto 60px auto;
  background-image: ${(props) => `url(${props.photoURL})`};
  background-size: 100% 100%;
  border-radius: 50%;
  border: 2px solid #fff;
  cursor: pointer;
`
const Spinner = styled.div`
  display: flex;
  align-self: center;
  width: 150px;
  height: 150px;
  margin: 30px auto 60px auto;
  background-image: url(${spinner});
  background-size: 100% 100%;
  background-color: rgb(255, 255, 255, 0);
  border: none;
`

function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  setIsProfile: Dispatch<React.SetStateAction<boolean>>
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) return
      setIsProfile(false)
    }

    window.addEventListener("mousedown", listener)
    window.addEventListener("touchstart", listener)
    return () => {
      window.removeEventListener("mousedown", listener)
      window.removeEventListener("touchstart", listener)
    }
  }, [ref])
}

export default function Profile() {
  const {
    isLogin,
    currentUser,
    logOut,
    avatarURL,
    setAvatarURL,
    setIsProfile,
    isLoading,
  } = useContext(AuthContext)

  const [uploadProgress, setUploadProgress] = useState(0)
  const [hasFile, setHasFile] = useState(false)
  const [hasCompressed, setHasCompressed] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(overlayRef, () => setIsProfile(false))

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      if (e.target.files !== null && typeof currentUser?.id === "string") {
        setHasFile(true)
        const docRef = doc(db, "users", currentUser.id)
        const file = e.target.files[0]
        const compressedFile = await imageCompression(file, options)
        setHasCompressed(true)
        const folderName = `${currentUser?.id?.slice(0, 4)}-avatar`
        const imgRef = ref(storage, `/${folderName}/${compressedFile.name}`)
        const uploadTask = uploadBytesResumable(imgRef, compressedFile)
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )
            setUploadProgress(progress)
          },
          (error) => {
            const errorMsg = error["message"] as string
            notifyError(
              `Failed to upload avatar, please take a note of ${errorMsg} and contact mika@test.com`
            )
          },
          async () => {
            const url = await getDownloadURL(
              ref(storage, `/${folderName}/${compressedFile.name}`)
            )

            await updateDoc(docRef, {
              photoURL: url,
            })
            setHasFile(false)
            setHasCompressed(false)
            setAvatarURL(url)
          }
        )
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMsg = error["message"] as string
        notifyError(
          `Failed to compress file ane upload, please take a note of ${errorMsg} and contact mika@test.com`
        )
      }
    }
  }

  if (!isLogin || currentUser === undefined || currentUser === null) return null
  return (
    <BgOverlay>
      <ProfileArea ref={overlayRef}>
        <BtnEdit />
        {typeof currentUser.name === "string" && (
          <Text>{currentUser?.name}</Text>
        )}
        {hasFile && <Spinner />}
        {!hasFile && typeof avatarURL === "string" && (
          <UploadLabel>
            <UserAvatar photoURL={avatarURL} />
            <UploadInput
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleChange(e)
              }}
            />
          </UploadLabel>
        )}
        <BtnText
          onClick={() => {
            logOut()
          }}
        >
          {isLoading ? (
            <Spinner
              style={{ width: "40px", height: "40px", margin: "0 auto" }}
            />
          ) : (
            <>
              <BtnLogout />
              Sign out
            </>
          )}
        </BtnText>
      </ProfileArea>
    </BgOverlay>
  )
}

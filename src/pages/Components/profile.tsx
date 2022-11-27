import React from "react"
import {
  useState,
  useRef,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import styled from "styled-components"
import { db, storage } from "../Utils/firebase"
import imageCompression from "browser-image-compression"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { AuthContext } from "../Context/authContext"
import { Container } from "../User/components/styles"
import logoutIcon from "../assets/buttons/logoutIcon.png"
import editPencil from "../assets/buttons/edit.png"

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
  margin-left: 10px;
  letter-spacing: 2px;
  border: none;
  gap: 5px;
  cursor: pointer;
  &:hover {
    border-bottom: 3px solid #fff;
  }
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    padding: 2px 10px;
  }
`
const BtnLogout = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  background-image: url(${logoutIcon});
  background-size: 100% 100%;
  cursor: pointer;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    width: 25px;
    height: 25px;
  }
`
const BtnEdit = styled(BtnLogout)`
  margin-left: 20px;
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

export default function Profile() {
  const { isLogin, currentUser, logOut, avatarURL, setAvatarURL } =
    useContext(AuthContext)

  const [uploadProgress, setUploadProgress] = useState(0)
  // const [avatarURL, setAvatarURL] = useState(currentUser?.photoURL || "")
  const [hasFile, setHasFile] = useState(false)
  const [hasCompressed, setHasCompressed] = useState(false)
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
        console.log({ file })
        const compressedFile = await imageCompression(file, options)
        setHasCompressed(true)
        console.log({ compressedFile })
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
            console.log(error)
          },
          async () => {
            const url = await getDownloadURL(
              ref(storage, `/${folderName}/${compressedFile.name}`)
            )
            console.log({ url })
            await updateDoc(docRef, {
              photoURL: url,
            })
            console.log("應已更新avatar url")
            setHasFile(false)
            setHasCompressed(false)
            setAvatarURL(url)
          }
        )
      }
    } catch (error) {
      console.log("Failed to compress files", error)
    }
  }

  if (!isLogin || currentUser === undefined || currentUser === null) return null
  return (
    <ProfileArea>
      {typeof currentUser.name === "string" && (
        <Text>
          {currentUser?.name}
          <BtnEdit />
        </Text>
      )}
      {typeof avatarURL === "string" && (
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
      <Text
        onClick={() => {
          logOut()
        }}
      >
        <BtnLogout />
        Sign out
      </Text>
    </ProfileArea>
  )
}

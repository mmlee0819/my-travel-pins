import React from "react"
import { useState, useContext, Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { storage } from "../../Utils/firebase"
import { AuthContext } from "../../Context/authContext"
import uploadIcon from "./uploadImgIcon.png"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import imageCompression from "browser-image-compression"
import spinner from "../../assets/dotsSpinner.svg"

const Spinner = styled.div`
  width: 100%;
  height: 64px;
  margin: 0 auto;
  background-image: url(${spinner});
  background-size: 100% 100%;
  background-color: rgb(255, 255, 255, 0);
  border: none;
`
const UploadPhotoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  font-size: 20px;
  height: 40px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    font-size: 18px;
  }
`
const UploadImgLabel = styled.label`
  display: flex;
  align-items: center;
  height: 64px;
  color: ${(props) => props.theme.color.bgDark};
  gap: 15px;
  cursor: pointer;
`
const UrlsImgWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: row wrap;
  padding-left: 5px;
  gap: 10px;
`
const UploadImgIcon = styled.img`
  width: 30px;
  height: 30px;
`
const UploadedPhoto = styled.img`
  margin-top: 15px;
  width: 100px;
  height: 100px;
  @media screen and (max-width: 900px) and (min-width: 600px),
    (max-height: 600px) {
    width: 80px;
    height: 80px;
  }
`

const UploadImgInput = styled.input`
  display: none;
`

interface UploadType {
  currentPin: {
    id: string
    userId: string
    location: {
      lat: number
      lng: number
      name: string
      placeId: string
    }
  }
  setFilesName: Dispatch<SetStateAction<string[]>>
  hasUpload: boolean
  setHasUpload: Dispatch<SetStateAction<boolean>>
  urls: string[]
  setUrls: Dispatch<SetStateAction<string[]>>
  setUploadProgress: Dispatch<SetStateAction<number>>
}

export default function Upload(props: UploadType) {
  const { currentUser } = useContext(AuthContext)
  const [hasFiles, setHasFiles] = useState(false)

  const {
    currentPin,
    setFilesName,
    hasUpload,
    setHasUpload,
    urls,
    setUrls,
    setUploadProgress,
  } = props

  console.log({ urls })

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      if (e.target.files !== null) {
        setHasFiles(true)
        const files = Array.from(e.target.files)
        files.map((file) => setFilesName((prev) => [...prev, file.name]))
        const newFiles = await Promise.all(
          files.map(async (imgFile: File) => {
            const compressedFile = await imageCompression(imgFile, options)
            return compressedFile
          })
        )
        handleUpload(newFiles)
      }
    } catch (error) {
      console.log("Failed to compress files", error)
    }
  }

  const handleUpload = (photos: File[]) => {
    photos.map((photo) => {
      if (typeof currentUser?.id === "string") {
        const folderName = `${currentUser?.id?.slice(
          0,
          4
        )}-${currentPin.location.placeId.slice(0, 4)}`
        const imgRef = ref(storage, `/${folderName}/${photo.name}`)
        const uploadTask = uploadBytesResumable(imgRef, photo)
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
              ref(storage, `/${folderName}/${photo.name}`)
            )

            setUrls((prev) => {
              return [...prev, url]
            })
            setHasUpload(true)
            setHasFiles(false)
          }
        )
      }
    })
  }

  return (
    <>
      {hasUpload && urls && (
        <UrlsImgWrapper>
          {urls.map((url) => {
            return <UploadedPhoto key={url} src={url} />
          })}
        </UrlsImgWrapper>
      )}
      <UploadPhotoWrapper>
        {!hasFiles ? (
          <UploadImgLabel>
            <UploadImgIcon src={uploadIcon} />
            Choose photos
            <UploadImgInput
              type="file"
              accept="image/*"
              multiple={true}
              onChange={(e) => {
                handleChange(e)
              }}
            />
          </UploadImgLabel>
        ) : (
          <Spinner />
        )}
      </UploadPhotoWrapper>
    </>
  )
}

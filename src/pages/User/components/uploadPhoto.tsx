import React from "react"
import { useState, useContext, Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { storage } from "../../Utils/firebase"
import { AuthContext } from "../../Context/authContext"
import uploadIcon from "./uploadImgIcon.png"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import imageCompression from "browser-image-compression"
import spinner from "../../assets/dotsSpinner.svg"

const UploadPhotoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  font-size: 20px;
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
  flex-flow: row nowrap;
  padding-left: 5px;
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

const BtnUpload = styled.button`
  display: flex;
  align-self: end;
  align-items: center;
  padding: 10px;
  height: 30px;
  color: #ffffff;
  background-color: ${(props) => props.theme.color.deepMain};
  border-radius: 5px;
  border: none;
  opacity: 1;

  cursor: pointer;
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
  filesName: string[]
  setFilesName: Dispatch<SetStateAction<string[]>>
  photos: File[]
  setPhotos: Dispatch<SetStateAction<File[]>>
  hasUpload: boolean
  setHasUpload: Dispatch<SetStateAction<boolean>>
  urls: string[]
  setUrls: Dispatch<SetStateAction<string[]>>
  setUploadProgress: Dispatch<SetStateAction<number>>
}

export default function Upload(props: UploadType) {
  const { currentUser } = useContext(AuthContext)
  const [hasFiles, setHasFiles] = useState(false)
  const [hasCompressed, setHasCompressed] = useState(false)
  const {
    currentPin,
    filesName,
    setFilesName,
    photos,
    setPhotos,
    hasUpload,
    setHasUpload,
    urls,
    setUrls,
    setUploadProgress,
  } = props

  console.log({ photos })
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

        const compressedFiles = await Promise.all(
          files.map(async (imgFile: File) => {
            const compressedFile = await imageCompression(imgFile, options)
            console.log(
              "compressedFile instanceof Blob",
              compressedFile instanceof Blob
            ) // true
            console.log(
              `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
            ) // smaller than maxSizeMB
            console.log("compressedFile", compressedFile)
            setPhotos((prev) => [...prev, compressedFile])
          })
        )
        setHasCompressed(true)

        // setPhotos(compressedFiles)
        console.log({ compressedFiles })
      }
    } catch (error) {
      console.log("Failed to compress files", error)
    }
  }

  const handleUpload = () => {
    if (!hasCompressed) return
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
            setHasCompressed(false)
          }
        )
      }
    })
  }

  return (
    <>
      {hasUpload && urls ? (
        <UrlsImgWrapper>
          {urls.map((url) => {
            console.log(url)
            return <UploadedPhoto key={url} src={url} />
          })}
        </UrlsImgWrapper>
      ) : (
        <UploadPhotoWrapper>
          <UploadImgLabel>
            <UploadImgIcon src={uploadIcon} />
            {filesName.length !== 0
              ? filesName.map((fileName) => {
                  return `\n${fileName}`
                })
              : "Choose photos"}
            <UploadImgInput
              type="file"
              accept="image/*"
              multiple={true}
              onChange={(e) => {
                handleChange(e)
              }}
            />
          </UploadImgLabel>
          {hasFiles && !hasCompressed && <img src={spinner} />}
        </UploadPhotoWrapper>
      )}
      {hasCompressed && (
        <BtnUpload onClick={handleUpload}>Upload Preview</BtnUpload>
      )}
    </>
  )
}

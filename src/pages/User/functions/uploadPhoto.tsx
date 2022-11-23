import React from "react"
import { useState, useContext, Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import { storage } from "../../Utils/firebase"
import { AuthContext } from "../../Context/authContext"
import uploadIcon from "../functions/uploadImgIcon.png"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

const UploadPhotoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`
const UploadImgLabel = styled.label`
  display: flex;
  align-items: center;
  height: 64px;
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
  align-self: center;
  align-items: center;
  padding: 10px;
  height: 30px;
  color: #ffffff;
  background-color: #5594b7;
  border: none;
  opacity: 1;
  border-radius: 10px;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilesName([])
    setPhotos([])
    if (e.target.files !== null) {
      for (const file of e.target.files) {
        setFilesName((prev: string[]) => {
          return [...prev, file.name]
        })
        setPhotos((prev: File[]) => {
          return [...prev, file]
        })
      }
    }
  }
  const handleUpload = () => {
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
            setHasUpload(true)
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
          <BtnUpload onClick={handleUpload}>Upload</BtnUpload>
        </UploadPhotoWrapper>
      )}
    </>
  )
}

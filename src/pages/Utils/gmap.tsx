import React, { Dispatch, SetStateAction } from "react"
import { StreetViewService } from "@react-google-maps/api"
import styled from "styled-components"
import { DocumentData } from "@firebase/firestore-types"
import { onStreetLoad } from "../User/ts_fn_commonUse"
import backIcon from "../assets/back.png"

const RowNoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`
const StreetModeContainer = styled(RowNoWrapper)`
  position: absolute;
  margin: 0 auto;
  width: 50vw;
  min-height: calc(100vh - 30px);
  z-index: 101;
`
const StreetModePinContentContainer = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-flow: column wrap;
  padding: 10px;
  width: 50vw;
  min-height: calc(100vh - 30px);
  font-family: "Poppins";
  background-color: #ffffff;
  z-index: 101;
`
const Title = styled.div`
  font-size: 1rem;
  color: #000000;
`
const BackIconImg = styled.img`
  margin-right: 20px;
  width: 10%;
  cursor: pointer;
`
export const DetailImgsWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  width: 80%;
  height: 30vh;
  gap: 20px;
`
export const DetailImg = styled.div<{
  bkImage: string
}>`
  display: flex;
  flex: 0 1 30%;
  background-image: ${(props) => `url(${props.bkImage})`};
  background-size: 100% 100%;
`
export const containerStyle = {
  minHeight: "100vh",
  width: "100vw",
}

export const centerSchool = {
  lat: 25.061945,
  lng: 121.5484174,
}

export const myGoogleApiKey = process.env.REACT_APP_google_API_KEY

interface Props {
  selectedMarker: DocumentData
  setShowMemory: Dispatch<React.SetStateAction<boolean>>
}

export default function StreetView(props: Props) {
  const { selectedMarker, setShowMemory } = props

  return (
    <>
      <StreetModeContainer id="street-mode-container">
        <StreetViewService
          onLoad={() => {
            onStreetLoad(selectedMarker)
          }}
        />
      </StreetModeContainer>
      <StreetModePinContentContainer>
        <RowNoWrapper>
          <Title>{selectedMarker?.location?.name}</Title>
          <BackIconImg
            src={backIcon}
            onClick={() => {
              setShowMemory(false)
            }}
          />
        </RowNoWrapper>

        <Title>{selectedMarker?.article?.title}</Title>
        <Title>{selectedMarker?.article?.travelDate}</Title>

        {selectedMarker?.albumURLs && selectedMarker?.albumURLs?.length !== 0 && (
          <DetailImgsWrapper>
            {selectedMarker.albumURLs.map((photoUrl: string) => {
              return <DetailImg key={photoUrl} bkImage={photoUrl} />
            })}
          </DetailImgsWrapper>
        )}
        <Title>{selectedMarker?.article?.content}</Title>
      </StreetModePinContentContainer>
    </>
  )
}

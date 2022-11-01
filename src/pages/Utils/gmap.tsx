import {
  useJsApiLoader,
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api"

export const containerStyle = {
  minHeight: "100vh",
  width: "100vw",
}

export const centerSchool = {
  lat: 25.061945,
  lng: 121.5484174,
}

export const myGoogleApiKey = process.env.REACT_APP_google_API_KEY

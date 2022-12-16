import React, { createContext, useState, useEffect, ReactNode } from "react"

import { useJsApiLoader, LoadScriptProps } from "@react-google-maps/api"

interface MapContextType {
  isLoaded: boolean
  mapZoom: string
  setMapZoom: (mapZoom: string) => void
}

export const MapContext = createContext<MapContextType>({
  isLoaded: true,
  mapZoom: "lg",
  setMapZoom: () => Response,
})

interface Props {
  children?: ReactNode
}

const libraries: LoadScriptProps["libraries"] = ["places"]
const myGoogleApiKey = process.env.REACT_APP_google_API_KEY!

export function MapContextProvider({ children }: Props) {
  const [mapZoom, setMapZoom] = useState<string>("lg")

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: myGoogleApiKey,
    libraries,
  })
  const initialCenter = {
    zoomLg: [39.9437334482122, 65.35942441225613],
    zoomMd: [39.9437334482122, 16],
  }

  const onZoomChange = () => {
    if (window.innerWidth > 1200 && window.innerHeight > 600) {
      setMapZoom("lg")
    } else if (
      (window.innerWidth > window.innerHeight &&
        window.innerWidth <= 1200 &&
        window.innerWidth > 900) ||
      (window.innerWidth > window.innerHeight && window.innerHeight < 600)
    ) {
      setMapZoom("md")
    } else if (
      window.innerWidth > window.innerHeight &&
      window.innerWidth <= 900
    ) {
      setMapZoom("sm")
    } else if (window.innerWidth >= 375) {
      setMapZoom("xxs")
    }
  }
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1200 && window.innerHeight > 500) {
        setMapZoom("lg")
      } else if (
        window.innerWidth <= 1200 &&
        window.innerWidth > 900 &&
        window.innerHeight > 500
      ) {
        setMapZoom("md")
      } else if (
        window.innerWidth <= 900 &&
        window.innerWidth > 800 &&
        window.innerHeight > 500
      ) {
        setMapZoom("sm")
      } else if (
        window.innerWidth <= 800 &&
        window.innerWidth > 540 &&
        window.innerHeight > 500
      ) {
        setMapZoom("xs")
      } else if (window.innerWidth <= 540) {
        setMapZoom("xxs")
      }
    }

    onZoomChange()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [mapZoom])

  return (
    <MapContext.Provider
      value={{
        isLoaded,
        mapZoom,
        setMapZoom,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

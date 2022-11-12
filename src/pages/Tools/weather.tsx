import React, { useState, useContext, useEffect } from "react"
import styled from "styled-components"
import { Responsive, WidthProvider } from "react-grid-layout"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import {
  GoogleMap,
  StandaloneSearchBox,
  InfoWindow,
} from "@react-google-maps/api"
import { AuthContext } from "../Context/authContext"
const GridArea = styled.div`
  font-family: "Poppins";
  position: absolute;
  display: flex;
  top: 0px;
  min-width: 50vw;
  min-height: 50vh;
  z-index: 99;
`
const GridItemWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  min-height: 50vh;
  font-size: 12px;
  color: #ffffff;
  background: #2d2d2d;
`

const Input = styled.input`
  padding-left: 8px;
  width: 100%;
  height: 30px;
  font-size: 15px;
  color: #ffffff;
  background-color: #000000;
  border: 1px solid #000000;
  opacity: 0.8;
  z-index: 100;
`
const CurrentWeatherInfoArea = styled.div`
  padding: 5px;
  background-color: #ffffff;
  border: 1px solid #f99c62;
  border-radius: 5px;
  /* width: 150px;
  height: 120px; */
`
const CurrentWeatherImg = styled.img`
  width: 50px;
  height: 50px;
`
const CurrentWeatherTitle = styled.div`
  text-align: start;
  color: #000000;
  font-size: 12px;
  font-weight: 500;
`
const CurrentWeatherText = styled.div`
  text-align: center;
  color: #000000;
  font-size: 12px;
  font-weight: 700;
`
const RowWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 5px;
`
const ColumnWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-self: center;
`
const ResponsiveGridLayout = WidthProvider(Responsive)

const layouts = {
  lg: [{ i: "exRate-1", x: 0, y: 0, w: 2, h: 1, maxW: 2, maxH: 1 }],
  md: [{ i: "exRate-2", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
  sm: [{ i: "exRate-3", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
  xs: [{ i: "exRate-4", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
  xxs: [{ i: "exRate-5", x: 0, y: 0, w: 2, h: 1, maxW: 1, maxH: 1 }],
}

interface Props {
  showWeather: boolean
}
interface LocationType {
  lat: number
  lng: number
  name: string | undefined
}

const myOpenweatherApiKey = process.env.REACT_APP_openweather_API_KEY

function WeatherWidget(props: Props) {
  const { showWeather } = props
  const { isLoaded, currentUser } = useContext(AuthContext)
  const [location, setLocation] = useState<LocationType>({
    lat: 0,
    lng: 0,
    name: "",
  })
  const [searchBox, setSearchBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  const [currWeatherStatus, setCurrWeatherStatus] = useState({
    description: "",
    icon: "",
    temp: 0,
    humidity: 0,
  })
  console.log("currWeatherStatus", currWeatherStatus)
  console.log("location", location)
  const onPlacesChanged = () => {
    if (searchBox instanceof google.maps.places.SearchBox) {
      console.log(searchBox.getPlaces())
      const searchResult = searchBox.getPlaces()
      if (searchResult !== undefined) {
        const newLat = searchResult[0]?.geometry?.location?.lat()
        const newLng = searchResult[0]?.geometry?.location?.lng()
        const placeName = searchResult[0]?.name
        if (newLat && newLng) {
          setLocation({
            lat: newLat,
            lng: newLng,
            name: placeName,
          })
        }
      }
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref)
  const onInfoWinLoad = (infoWindow: google.maps.InfoWindow) => {
    console.log("infoWindow: ", infoWindow)
  }

  useEffect(() => {
    if (!showWeather || !location) return
    const getWeatherData = async () => {
      try {
        console.log("有執行")
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&units=metric&appid=${myOpenweatherApiKey}`
        const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&units=metric&appid=${myOpenweatherApiKey}`
        const currWeatherResponse = await fetch(currentWeatherURL)
        const currWeatherData = await currWeatherResponse.json()
        const forecastResponse = await fetch(forecastURL)
        const forecastData = await forecastResponse.json()

        console.log("forecast", forecastData)
        console.log("currWeatherData", currWeatherData)
        setCurrWeatherStatus({
          description: currWeatherData?.weather[0]?.description,
          icon: currWeatherData?.weather[0]?.icon,
          temp: Math.round(currWeatherData?.main?.feels_like),
          humidity: currWeatherData?.main.humidity,
        })
      } catch (error) {
        console.log(error)
      }
    }
    getWeatherData()
  }, [location])

  return (
    <GridArea>
      <ResponsiveGridLayout
        layouts={layouts}
        key="tools"
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 3, md: 4, sm: 3, xs: 2, xxs: 1 }}
        width={1000}
        rowHeight={350}
        z-index={99}
      >
        <GridItemWrapper key="weather-query">
          {isLoaded &&
          typeof currentUser?.hometownLat === "number" &&
          typeof currentUser?.hometownLng === "number" ? (
            <>
              <GoogleMap
                mapTypeId="1742ed94a3f0f03"
                mapContainerStyle={{
                  height: "100%",
                  width: "100%",
                }}
                center={{
                  lat:
                    typeof location?.lat === "number"
                      ? location?.lat
                      : currentUser?.hometownLat,
                  lng:
                    typeof location?.lng === "number"
                      ? location?.lng
                      : currentUser?.hometownLng,
                }}
                zoom={1}
                options={{
                  draggable: true,
                  mapTypeControl: false,
                  streetViewControl: false,
                  scaleControl: false,
                  fullscreenControl: false,
                  mapId: "1742ed94a3f0f03",
                }}
              >
                {location.name !== "" &&
                typeof location?.lat === "number" &&
                typeof location?.lng === "number" ? (
                  <>
                    {/* <Marker
                      position={{
                        lat: location?.lat,
                        lng: location?.lng,
                      }}
                    /> */}
                    <InfoWindow
                      onLoad={onInfoWinLoad}
                      position={{
                        lat: location?.lat,
                        lng: location?.lng,
                      }}
                      options={{
                        pixelOffset: new window.google.maps.Size(0, 0),
                      }}
                      // onCloseClick={() => {}}
                    >
                      <CurrentWeatherInfoArea>
                        <CurrentWeatherTitle>
                          Current weather
                        </CurrentWeatherTitle>
                        <RowWrapper>
                          <CurrentWeatherImg
                            src={`http://openweathermap.org/img/wn/${currWeatherStatus.icon}@2x.png`}
                          />
                          <ColumnWrapper>
                            <CurrentWeatherText>
                              {currWeatherStatus?.temp}°C
                            </CurrentWeatherText>
                            <CurrentWeatherText>
                              {currWeatherStatus?.description}
                            </CurrentWeatherText>
                          </ColumnWrapper>
                        </RowWrapper>
                        <CurrentWeatherTitle>
                          {location?.name}
                        </CurrentWeatherTitle>
                      </CurrentWeatherInfoArea>
                    </InfoWindow>
                  </>
                ) : (
                  ""
                )}
              </GoogleMap>
              <StandaloneSearchBox
                onLoad={onLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <Input placeholder="Search a place"></Input>
              </StandaloneSearchBox>
            </>
          ) : (
            ""
          )}
          {/* <GridItemContent src={mapUrl}></GridItemContent> */}
        </GridItemWrapper>
      </ResponsiveGridLayout>
    </GridArea>
  )
}
export default WeatherWidget

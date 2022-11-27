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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { AuthContext } from "../Context/authContext"
import xMark from "../assets/buttons/x-mark.png"

const Xmark = styled.div`
  position: absolute;
  top: 10px;
  right: 30px;
  background-image: url(${xMark});
  background-size: 100% 100%;
  width: 40px;
  height: 40px;
  z-index: 188;
  cursor: pointer;

  @media screen and (max-width: 799px), (max-height: 600px) {
    width: 30px;
    height: 30px;
  }
`
const GridArea = styled.div`
  font-family: "Poppins";
  position: absolute;
  display: flex;
  top: 0px;
  left: 20px;
  height: 350px;
  min-width: 30vw;
  min-height: 30vh;

  z-index: 150;
`
const GridItemWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  width: 100%;
  min-height: 50vh;
  font-size: 16px;
  color: #ffffff;
  background-color: #ffffff;
  box-shadow: 3px 5px 3px #2d2d2d;
  background: #2d2d2d;
`

const Input = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 8px;
  width: 100%;
  line-height: 40px;
  height: 40px;
  font-size: 15px;
  color: #2d2d2d;
  background-color: #ffffff;
  border: 1px solid #000000;
  opacity: 1;
  z-index: 199;
  &:focus {
    outline: #f99c62;
    border: 3px solid #f99c62;
  }
  ::placeholder {
    font-size: 16px;
  }
`

const CurrentWeatherInfoArea = styled.div`
  height: auto;
  padding: 5px;
  background-color: #f99c62;
  border: 1px solid #f99c62;
  border-radius: 5px;
`
const CurrentWeatherImg = styled.img`
  width: 50px;
  height: 50px;
`
const CurrentWeatherTitle = styled.div`
  text-align: center;
  color: #2b2a2a;
  font-size: 18px;
  font-weight: 500;
`
const CurrentWeatherText = styled.div`
  padding-right: 5px;
  text-align: start;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
`
const ForecastWeatherImg = styled.img`
  width: 30px;
  height: 30px;
`

const ForecastWeatherText = styled.div`
  padding-right: 5px;
  text-align: start;
  color: #2b2a2a;
  font-size: 12px;
  font-weight: 700;
`
const RowNoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  gap: 5px;
`
const RowWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 5px;
`
const ForecastRowWrapper = styled(RowWrapper)`
  font-size: 24px;
  gap: 0;
  justify-content: space-around;
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: 18px;
  }
`
const ColumnWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-self: center;
`
const ForecastColumnArea = styled(ColumnWrapper)`
  margin: 10px 0;
  min-height: 50%;
`
const WeatherContentArea = styled.div`
  position: relative;
  min-width: 50vw;
  padding: 5px;
  background-color: #ffffff;
`
const TitleWrapper = styled(RowNoWrapper)`
  justify-content: end;
  font-size: 12px;
  font-weight: 500;
`
const MaxTempText = styled(ForecastWeatherText)`
  color: #f99c62;
`
const MinTempText = styled(ForecastWeatherText)`
  color: #229fdd;
`
const HumidityText = styled(ForecastWeatherText)`
  color: #b8b8b8;
`
const PopText = styled(ForecastWeatherText)`
  color: #2b2a2a;
`
const ResponsiveGridLayout = WidthProvider(Responsive)

const layouts = {
  lg: [{ i: "exRate-1", x: 0, y: 0, w: 2, h: 2, maxW: 3, maxH: 2 }],
  md: [{ i: "exRate-2", x: 0, y: 0, w: 1, h: 2, maxW: 3, maxH: 2 }],
  sm: [{ i: "exRate-3", x: 0, y: 0, w: 1, h: 1, maxW: 1, maxH: 1 }],
  xs: [{ i: "exRate-4", x: 0, y: 0, w: 1, h: 1, maxW: 1, maxH: 1 }],
  xxs: [{ i: "exRate-5", x: 0, y: 0, w: 1, h: 1, maxW: 1, maxH: 1 }],
}

interface Props {
  showWeather: boolean
}
interface LocationType {
  lat: number
  lng: number
  name: string | undefined
}

interface WeatherDataType {
  current: {
    dt: 0
    feels_like: 0
    humidity: 0
    temp: 0
    uvi: 0
    weather: [{ description: ""; icon: ""; id: 0; main: "" }]
  }
  daily: [
    {
      dt: 0
      feels_like: { day: 0; night: 0; eve: 0; morn: 0 }
      humidity: 0
      pop: 0
      temp: {
        day: 0
        eve: 0
        max: 0
        min: 0
        morn: 0
        night: 0
      }
      uvi: 0
      weather: [{ description: ""; icon: ""; id: 0; main: "" }]
      snow?: 0
    }
  ]
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)
const myOpenweatherApiKey = process.env.REACT_APP_openweather_API_KEY

function WeatherWidget(props: Props) {
  const { showWeather } = props
  const { isLoaded, currentUser } = useContext(AuthContext)
  const [showForecast, setShowForecast] = useState(false)
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
  const [forecastStatus, setForecastStatus] = useState([
    {
      date: "",
      maxTemp: 0,
      minTemp: 0,
      humidity: 0,
      pop: 0,
      description: "",
      icon: "",
    },
  ])
  const [dates, setDates] = useState<string[]>([])
  const [maxTemps, setMaxTemps] = useState<number[]>([])
  const [minTemps, setMinTemps] = useState<number[]>([])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${location.name} 8-day forecast`,
        size: "25px",
      },
    },
    scales: {
      y: {
        min: minTemps[0] - 5,
        max: maxTemps[0] + 5,
        stepSize: 10,
      },
    },
  }
  const labels = dates

  const data = {
    labels,
    datasets: [
      {
        label: "Max",
        data: maxTemps,
        borderColor: "#ffc59c",
        backgroundColor: "#f99c62",
      },
      {
        label: "Min",
        data: minTemps,
        borderColor: "#58d0ff",
        backgroundColor: "#229fdd",
        fill: {
          target: "0",
          below: "#ffffff",
        },
      },
    ],
    showLine: false,
  }
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
          setShowForecast(true)
        }
      }
    } else console.log("失敗啦")
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref)
  const onInfoWinLoad = (infoWindow: google.maps.InfoWindow) => {
    console.log("infoWindow: ", infoWindow)
  }

  useEffect(() => {
    if (!showWeather || location.name === "") return
    const getWeatherData = async () => {
      try {
        console.log("有執行")
        const weatherURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely,hourly,alerts&cnt=7&units=metric&appid=${myOpenweatherApiKey}`
        const weatherResponse = await fetch(weatherURL)
        const weatherData: WeatherDataType = await weatherResponse.json()

        console.log("forecast", weatherData)
        const forecastInfos = weatherData?.daily?.map((item) => {
          const date = new Date(item.dt * 1000).toDateString()
          const readableDate = date.split(" ").slice(1, 3).join(" ")
          const infos = {
            date: readableDate,
            maxTemp: Math.round(item.temp.max),
            minTemp: Math.round(item.temp.min),
            humidity: item.humidity,
            pop: Math.round(item.pop * 100),
            description: item.weather[0].description,
            icon: item.weather[0].icon,
          }
          return infos
        })
        const datesArr = weatherData?.daily?.map((item) => {
          const date = new Date(item.dt * 1000).toDateString()
          const readableDate = date.split(" ").slice(1, 3).join(" ")
          return readableDate
        })
        const maxTempArr = weatherData?.daily?.map((item) => {
          return item.temp.max
        })
        const minTempArr = weatherData?.daily?.map((item) => {
          return item.temp.min
        })

        setCurrWeatherStatus({
          description: weatherData?.current?.weather[0]?.description,
          icon: weatherData?.current?.weather[0]?.icon,
          temp: Math.round(weatherData?.current?.feels_like),
          humidity: weatherData?.current?.humidity,
        })
        setDates(datesArr)
        setMaxTemps(maxTempArr)
        setMinTemps(minTempArr)
        setForecastStatus(forecastInfos)
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
        width={150}
        rowHeight={300}
        z-index={180}
      >
        <GridItemWrapper key="weather-query">
          {isLoaded ? (
            <>
              <GoogleMap
                mapTypeId="1742ed94a3f0f03"
                mapContainerStyle={{
                  minHeight: "calc(100% - 20px)",
                  width: "100%",
                  marginTop: "40px",
                  top: "-5px",
                }}
                center={{
                  lat: location?.lat || 45,
                  lng: location?.lng || 130,
                }}
                zoom={location?.name === "" ? 1 : 6}
                options={{
                  draggable: true,
                  mapTypeControl: false,
                  streetViewControl: false,
                  scaleControl: false,
                  fullscreenControl: false,
                  zoomControl: false,
                  mapId: "1742ed94a3f0f03",
                  minZoom: 0.8,
                }}
              >
                {location.name !== "" &&
                typeof location?.lat === "number" &&
                typeof location?.lng === "number" &&
                currWeatherStatus.icon !== "" ? (
                  <>
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
                        <RowNoWrapper>
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
                        </RowNoWrapper>
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
                <Input placeholder="Search a place" />
              </StandaloneSearchBox>
              {location.name !== "" && showForecast ? (
                <WeatherContentArea>
                  <Xmark
                    onClick={() => {
                      setShowForecast(false)
                      setLocation({
                        lat: 0,
                        lng: 0,
                        name: "",
                      })
                    }}
                  />
                  <ForecastRowWrapper>
                    <Line options={options} data={data} />
                    {forecastStatus.map((item) => {
                      return (
                        <>
                          <ForecastColumnArea>
                            <RowNoWrapper
                              key={`${item.date}-icon-forecast-${item.icon}`}
                            >
                              <ForecastWeatherImg
                                src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
                              />
                            </RowNoWrapper>
                            <RowNoWrapper
                              key={`${item.date}-maxTemp-${item.maxTemp}`}
                            >
                              <MaxTempText>{item.maxTemp}°C</MaxTempText>
                            </RowNoWrapper>
                            <RowNoWrapper
                              key={`${item.date}-minTemp-${item.minTemp}`}
                            >
                              <MinTempText>{item.minTemp}°C</MinTempText>
                            </RowNoWrapper>
                            <RowNoWrapper
                              key={`${item.date}-humidity-${item.humidity}`}
                            >
                              <HumidityText>{item.humidity}%</HumidityText>
                            </RowNoWrapper>
                            <RowNoWrapper key={`${item.date}-pop-${item.pop}`}>
                              <PopText>{item.pop}%</PopText>
                            </RowNoWrapper>
                          </ForecastColumnArea>
                        </>
                      )
                    })}
                    <TitleWrapper>
                      <HumidityText>Humidity</HumidityText>
                      <PopText>Probability of Precipitation,POP</PopText>
                    </TitleWrapper>
                  </ForecastRowWrapper>
                </WeatherContentArea>
              ) : (
                ""
              )}
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

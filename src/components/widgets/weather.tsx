import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react"
import styled from "styled-components"
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
import { AuthContext } from "../../context/authContext"
import { MapContext } from "../../context/mapContext"
import { Input } from "../styles/formStyles"
import {
  GridContainer,
  GridItemWrapper,
  Xmark,
  FormTitle,
  Credits,
} from "../styles/widgetStyles"
import spinner from "../../assets/dotsSpinner.svg"
import { notifyError } from "../reminder"

const PlaceInput = styled(Input)`
  font-size: ${(props) => props.theme.title.md};
  border: 2px solid ${(props) => props.theme.btnColor.bgGreen};
  ::placeholder {
    font-size: ${(props) => props.theme.title.md};
    @media screen and(max-width: 600px), (max-height: 600px) {
      font-size: ${(props) => props.theme.title.sm};
    }
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
  font-size: ${(props) => props.theme.title.md};
  font-weight: 500;
`
const CurrentWeatherText = styled.div`
  padding-right: 5px;
  text-align: start;
  color: #ffffff;
  font-size: ${(props) => props.theme.title.md};
  font-weight: 700;
`
const ForecastWeatherImg = styled.img`
  width: 30px;
  height: 30px;
`

const ForecastWeatherText = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: end;
  text-align: start;
  color: #2d2d2d;
  font-size: ${(props) => props.theme.title.sm};
  font-weight: 700;
`
const RowNoWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  gap: 5px;
`

const ForecastRowWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  font-size: ${(props) => props.theme.title.lg};
  gap: 0;
  justify-content: space-between;
  @media screen and (max-width: 799px), (max-height: 600px) {
    font-size: ${(props) => props.theme.title.md};
  }
`
const ColumnWrapper = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-self: center;
`
const ForecastColumnArea = styled(ColumnWrapper)`
  margin: 20px auto;
  min-height: 50%;
`
const WeatherContentArea = styled.div`
  background-color: #ffffff;
  border-radius: 5px;
  overflow-y: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`
const ForecastWrapper = styled(RowNoWrapper)`
  justify-content: end;
`
const TitleWrapper = styled(RowNoWrapper)`
  display: flex;
  flex-flow: column wrap;
  align-items: end;
  font-size: ${(props) => props.theme.title.sm};
  font-weight: 400;
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

const HumidInfoText = styled(HumidityText)`
  font-weight: 500;
`
const PopInfoText = styled(PopText)`
  font-weight: 500;
`
const Spinner = styled.div`
  width: 100%;
  height: 60px;
  margin: 0 auto;
  background-image: url(${spinner});
  background-size: 100% 100%;
  background-color: rgb(255, 255, 255, 0);
  border: none;
`

const layouts = {
  xl: [
    {
      i: "weather-1",
      x: 0,
      y: 0,
      w: 1.2,
      h: 1,
      minW: 1.2,
      maxW: 1.5,
      minH: 1.2,
      maxH: 1.5,
    },
  ],
  lg: [
    {
      i: "weather-2",
      x: 0,
      y: 0,
      w: 1.2,
      h: 2,
      minW: 1.2,
      maxW: 1.5,
      maxH: 1.2,
    },
  ],
  md: [{ i: "weather-3", x: 0, y: 0, w: 1, h: 1, maxW: 1, maxH: 2 }],
  sm: [{ i: "weather-4", x: 0, y: 0, w: 1, h: 1, maxW: 1, maxH: 1 }],
  xs: [{ i: "weather-5", x: 0, y: 0, w: 1, h: 1, maxW: 1, maxH: 1 }],
}

interface Props {
  currentWidget: string
  setCurrentWidget: Dispatch<SetStateAction<string>>
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
  const { currentWidget, setCurrentWidget } = props
  const { isLoaded } = useContext(MapContext)
  const [showForecast, setShowForecast] = useState(false)
  const [location, setLocation] = useState<LocationType>({
    lat: 0,
    lng: 0,
    name: "",
  })
  const [searchBox, setSearchBox] = useState<
    google.maps.places.SearchBox | StandaloneSearchBox
  >()
  const locationRef = useRef<HTMLInputElement>(null)
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
  const [theMin, setTheMin] = useState<number>(0)
  const [theMax, setTheMax] = useState<number>(0)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${location.name} 8-day forecast`,
        font: { size: 18, weight: "bold" },
        color: "#2d2d2d",
      },
    },
    scales: {
      y: {
        min: theMin - 3,
        max: theMax + 3,
        stepSize: 5,
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
    if (!searchBox || searchBox instanceof StandaloneSearchBox) return
    const searchResult = searchBox.getPlaces()
    if (!searchResult) return
    const newLat = searchResult[0]?.geometry?.location?.lat()
    const newLng = searchResult[0]?.geometry?.location?.lng()
    const placeName = searchResult[0]?.name
    if (newLat && newLng && placeName) {
      setLocation({
        lat: newLat,
        lng: newLng,
        name: placeName,
      })
      setShowForecast(true)
    }
  }
  const onLoad = (ref: google.maps.places.SearchBox) => setSearchBox(ref)

  useEffect(() => {
    locationRef?.current?.focus()
    if (currentWidget !== "weather" || location.name === "") return
    const getWeatherData = async () => {
      try {
        const weatherURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely,hourly,alerts&cnt=7&units=metric&appid=${myOpenweatherApiKey}`
        const weatherResponse = await fetch(weatherURL)
        const weatherData: WeatherDataType = await weatherResponse.json()

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
        const maximum = Math.max(...maxTempArr)
        const minimum = Math.min(...minTempArr)
        setCurrWeatherStatus({
          description: weatherData?.current?.weather[0]?.description,
          icon: weatherData?.current?.weather[0]?.icon,
          temp: Math.round(weatherData?.current?.feels_like),
          humidity: weatherData?.current?.humidity,
        })
        setDates(datesArr)
        setMaxTemps(maxTempArr)
        setMinTemps(minTempArr)
        setTheMin(minimum)
        setTheMax(maximum)
        setForecastStatus(forecastInfos)
      } catch (error) {
        if (error instanceof Error) {
          const errorMsg = error["message"] as string
          notifyError(
            `Sorry, we failed to get weather forecast data, please take a note of ${errorMsg} and contact mika@test.com`
          )
        }
      }
    }
    getWeatherData()
  }, [location.name])

  return (
    <GridContainer
      layouts={layouts}
      key="weather-widget"
      breakpoints={{ xl: 1440, lg: 1200, md: 900, sm: 600, xs: 375 }}
      cols={{ xl: 4, lg: 3, md: 3, sm: 3, xs: 1 }}
      rowHeight={450}
      z-index={160}
      maxRows={1.2}
    >
      {isLoaded && (
        <GridItemWrapper key="weather-map">
          <Xmark
            onClick={() => {
              setShowForecast(false)
              setSearchBox(undefined)
              setLocation({
                lat: 0,
                lng: 0,
                name: "",
              })
              setCurrentWidget("")
              if (locationRef.current !== null) {
                locationRef.current.value = ""
              }
            }}
          />
          <FormTitle>Weather</FormTitle>
          <StandaloneSearchBox
            onLoad={onLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <PlaceInput ref={locationRef} placeholder="Search a place" />
          </StandaloneSearchBox>
          <GoogleMap
            mapTypeId="c85f6cd031fe4756"
            mapContainerStyle={{
              top: "0px",
              height: "100%",
              width: "100%",
              borderRadius: "5px",
            }}
            center={{
              lat: location?.lat || 45,
              lng: location?.lng || 60,
            }}
            zoom={location?.name === "" ? 1 : 8}
            options={{
              draggable: false,
              mapTypeControl: false,
              streetViewControl: false,
              scaleControl: false,
              fullscreenControl: false,
              zoomControl: false,
              mapId: "c85f6cd031fe4756",
              minZoom: 0.8,
            }}
          >
            {location.name !== "" &&
              typeof location?.lat === "number" &&
              typeof location?.lng === "number" &&
              currWeatherStatus.icon !== "" && (
                <InfoWindow
                  position={{
                    lat: location?.lat,
                    lng: location?.lng,
                  }}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, 50),
                  }}
                >
                  <CurrentWeatherInfoArea>
                    <CurrentWeatherTitle>Current weather</CurrentWeatherTitle>
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
                    <CurrentWeatherTitle>{location?.name}</CurrentWeatherTitle>
                  </CurrentWeatherInfoArea>
                </InfoWindow>
              )}
          </GoogleMap>
        </GridItemWrapper>
      )}

      {location.name !== "" && (
        <GridItemWrapper
          key="weather-result"
          data-grid={{
            x: 1,
            y: 0,
            w: 1.2,
            h: 1.1,
            minW: 1.2,
            minH: 1.1,
            maxW: 1.5,
            maxH: 1.5,
          }}
        >
          {showForecast && (
            <WeatherContentArea key="weather-query">
              {maxTemps.length > 0 && minTemps.length > 0 ? (
                <Line options={options} data={data} />
              ) : (
                <Spinner />
              )}
              <ForecastRowWrapper>
                {forecastStatus.map((item) => {
                  return (
                    <ForecastColumnArea key={item.date}>
                      <ForecastWrapper
                        key={`${item.date}-icon-forecast-${item.icon}`}
                      >
                        <ForecastWeatherImg
                          src={`http://openweathermap.org/img/wn/${item.icon}@2x.png`}
                        />
                      </ForecastWrapper>
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
                  )
                })}
              </ForecastRowWrapper>
              <TitleWrapper>
                <HumidInfoText>Humidity</HumidInfoText>
                <PopInfoText>Probability of Precipitation,POP</PopInfoText>
                <Credits href="https://openweathermap.org/">
                  Credits: OpenWeather®
                </Credits>
              </TitleWrapper>
            </WeatherContentArea>
          )}
        </GridItemWrapper>
      )}
    </GridContainer>
  )
}
export default WeatherWidget

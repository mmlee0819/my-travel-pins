import React, { Dispatch, SetStateAction } from "react"
import { LatLngBounds } from "leaflet"
import { Polyline, Rectangle, ImageOverlay } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import mongoDesert from "../assets/photoWall/desert.png"
import galaSki from "../assets/photoWall/galaSki.png"
import ramen from "../assets/photoWall/ramen.png"
import euroRight from "../assets/photoWall/euro1.png"
import greenland from "../assets/photoWall/greenland.png"
import ny from "../assets/photoWall/NY.png"
import westUS from "../assets/photoWall/westUS.png"
import peru from "../assets/photoWall/peru.png"
import peruLeft from "../assets/photoWall/peru2.png"
import egypt from "../assets/photoWall/egypt.png"
import au from "../assets/photoWall/au.png"
import newZe from "../assets/photoWall/newZe.jpg"

const polylineColor = { color: "#3c3c3c", weight: 0.8 }
const rectangleColor = { color: "#fff", weight: 3 }
const samplePinColor = { color: "#fff", weight: 6 }
function MongoImg() {
  return (
    <>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [60.08194834149987, 110],
          [80.67959375707717, 172.29303247795994],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={
          new LatLngBounds(
            [77, 172.29303247795994],
            [82.67218175020257, 213.76369108858657]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          url={mongoDesert}
          bounds={
            new LatLngBounds(
              [77, 172.29303247795994],
              [82.67218175020257, 213.76369108858657]
            )
          }
        />
      </Rectangle>
    </>
  )
}
function JapanImg({
  setShowSamplePost,
}: {
  setShowSamplePost: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [35, 138.19727864639543],
          [44.119522447002225, 238.84090939374232],
        ]}
      />
      <Rectangle
        pathOptions={samplePinColor}
        bounds={
          new LatLngBounds(
            [12.793553091440867, 240.88104007774922],
            [60.22150512596082, 290.4898699038423]
          )
        }
        eventHandlers={{
          click() {
            setShowSamplePost(true)
          },
        }}
      >
        <ImageOverlay
          zIndex={200}
          url={galaSki}
          bounds={
            new LatLngBounds(
              [12.793553091440867, 240.88104007774922],
              [60.22150512596082, 290.4898699038423]
            )
          }
        />
      </Rectangle>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [26.008390680425993, 296.5188740463553],
          [41.1417597127094, 330.2580939304174],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={
          new LatLngBounds(
            [55.08931726566487, 330.258093930417],
            [27.264181034367702, 371.02631795699233]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          opacity={0.95}
          url={ramen}
          bounds={
            new LatLngBounds(
              [55.08931726566487, 330.258093930417],
              [27.264181034367702, 371.02631795699233]
            )
          }
        />
      </Rectangle>
    </>
  )
}

function EuroImg() {
  return (
    <>
      {/* <Rectangle
        pathOptions={rectangleColor}
        bounds={
          new LatLngBounds(
            [75.98482299549886, 50.78115084640598],
            [82.17828153342957, 7.764509174340645]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          url={euroLeft}
          bounds={
            new LatLngBounds(
              [75.98482299549886, 50.78115084640598],
              [82.17828153342957, 7.764509174340645]
            )
          }
        />
      </Rectangle> */}
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [45.08194834149987, 10.78115084640598],
          [75, 55.78115084640598],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={
          new LatLngBounds(
            [75.98482299549886, 60.17341894104317],
            [82.17828153342957, 103.7532446246233]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          url={euroRight}
          bounds={
            new LatLngBounds(
              [75.98482299549886, 60.17341894104317],
              [82.17828153342957, 103.7532446246233]
            )
          }
        />
      </Rectangle>
    </>
  )
}

function GreenlandImg() {
  return (
    <>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [70.24430678699626, -40.906371480254975],
          [86.03638597001625, -26.725577122836423],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={
          new LatLngBounds(
            [80.03638597001625, -26.725577122836423],
            [90.51313366420334, 40.772]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          opacity={0.95}
          url={greenland}
          bounds={
            new LatLngBounds(
              [80.03638597001625, -26.725577122836423],
              [90.51313366420334, 40.772]
            )
          }
        />
      </Rectangle>
    </>
  )
}

function NYImg() {
  return (
    <>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [50, -90],
          [83, -150],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={new LatLngBounds([85, -190], [73, -150])}
      >
        <ImageOverlay
          zIndex={200}
          opacity={0.95}
          url={ny}
          bounds={new LatLngBounds([85, -190], [73, -150])}
        />
      </Rectangle>
    </>
  )
}

function WestUSImg() {
  return (
    <>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [45, -110],
          [60, -210],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={new LatLngBounds([48, -260], [65, -213])}
      >
        <ImageOverlay
          zIndex={200}
          opacity={0.95}
          url={westUS}
          bounds={new LatLngBounds([48, -260], [65, -213])}
        />
      </Rectangle>
    </>
  )
}

function PeruImg() {
  return (
    <>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [-10, -70],
          [-12.470980658060448, -109.73282674472917],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={
          new LatLngBounds(
            [-10.404225790358948, -116.05789397984469],
            [-42.02064852555764, -160.3333646256533]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          opacity={0.95}
          url={peru}
          bounds={
            new LatLngBounds(
              [-10.404225790358948, -116.05789397984469],
              [-42.02064852555764, -160.3333646256533]
            )
          }
        />
      </Rectangle>
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={
          new LatLngBounds(
            [-10.404225790358948, -165.95564661242264],
            [-42.02064852555764, -209.52539428785474]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          opacity={0.95}
          url={peruLeft}
          bounds={
            new LatLngBounds(
              [-10.404225790358948, -165.95564661242264],
              [-42.02064852555764, -209.52539428785474]
            )
          }
        />
      </Rectangle>
    </>
  )
}

function EgyptImg() {
  return (
    <>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [26.787147861291388, 28.006112750731493],
          [-47.78325990761666, -25.706500889314807],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={
          new LatLngBounds(
            [-47.78325990761666, 28.010915802361357],
            [-65.53541281431404, -53.52553225078862]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          opacity={0.95}
          url={egypt}
          bounds={
            new LatLngBounds(
              [-47.78325990761666, 28.010915802361357],
              [-65.53541281431404, -53.52553225078862]
            )
          }
        />
      </Rectangle>
    </>
  )
}

function AustraliaImg() {
  return (
    <>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [-25, 135],
          [-49.63711020835702, 115.17056716952166],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={
          new LatLngBounds(
            [-53.976185641487625, 81.43134728545967],
            [-71.41231375681114, 143.28658373957344]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          opacity={0.95}
          url={au}
          bounds={
            new LatLngBounds(
              [-53.976185641487625, 81.43134728545967],
              [-71.41231375681114, 143.28658373957344]
            )
          }
        />
      </Rectangle>
    </>
  )
}

function NewzealandImg() {
  return (
    <>
      <Polyline
        pathOptions={polylineColor}
        positions={[
          [-40, 175],
          [-44.87384753412976, 216.38822682170786],
        ]}
      />
      <Rectangle
        pathOptions={rectangleColor}
        interactive={false}
        bounds={
          new LatLngBounds(
            [-26.806685731042855, 220.0114301357182],
            [-61.448805195878116, 278.05506493282684]
          )
        }
      >
        <ImageOverlay
          zIndex={200}
          opacity={0.95}
          url={newZe}
          bounds={
            new LatLngBounds(
              [-26.806685731042855, 220.0114301357182],
              [-61.448805195878116, 278.05506493282684]
            )
          }
        />
      </Rectangle>
    </>
  )
}
export default function PhotoWall({
  setShowSamplePost,
}: {
  setShowSamplePost: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <>
      <JapanImg setShowSamplePost={setShowSamplePost} />
      <MongoImg />
      <EuroImg />
      <GreenlandImg />
      <NYImg />
      <WestUSImg />
      <PeruImg />
      <EgyptImg />
      <AustraliaImg />
      <NewzealandImg />
    </>
  )
}

import React, { useState } from "react"
import styled from "styled-components"

import { Swiper, SwiperSlide } from "swiper/react"
import { type Swiper as SwiperRef } from "swiper"
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper"

import "swiper/css/bundle"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"

const MainSwiper = styled(Swiper)`
  .swiper {
    height: 300px;
  }

  .mySwiper2.swiper-backface-hidden {
    height: 300px;
  }
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .swiper-button-prev,
  .swiper-button-next {
    &:after {
      color: #fff;
    }
  }
  --swiper-theme-color: #fff;
  --swiper-navigation-color: #fff;
  --swiper-pagination-color: "#fff";
`

const ButtomSwiper = styled(Swiper)`
  .swiper {
    height: 150px;
  }

  .swiper-slide {
    background-size: cover;
    background-position: center;
  }
  .mySwiper .swiper-slide {
    width: 25%;
    height: 100%;
  }
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.4;
  }
  .swiper-slide.swiper-slide-visible.swiper-slide-thumb-active img {
    opacity: 1;
  }
  .swiper-slide.swiper-slide-visible.swiper-slide-next.swiper-slide-thumb-active
    img {
    opacity: 1;
  }
  .swiper-slide.swiper-slide-duplicate.swiper-slide-duplicate-active img {
    opacity: 1;
  }
  .swiper-slide.swiper-slide-duplicate.swiper-slide-visible.swiper-slide-thumb-active
    img {
    opacity: 1;
  }
`

export default function SwiperPhotos({ photos }: { photos: string[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperRef | null>(null)

  return (
    <>
      <MainSwiper
        style={{ height: "300px" }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Autoplay, FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
      >
        {photos.map((item: string) => {
          return (
            <SwiperSlide key={`${item}-main`}>
              <img src={item} />
            </SwiperSlide>
          )
        })}
      </MainSwiper>
      <ButtomSwiper
        style={{ height: "150px" }}
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {photos.map((item: string) => {
          return (
            <SwiperSlide key={`${item}-bottom`}>
              <img src={item} />
            </SwiperSlide>
          )
        })}
      </ButtomSwiper>
    </>
  )
}

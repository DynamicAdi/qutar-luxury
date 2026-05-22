"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay, FreeMode, Mousewheel } from "swiper/modules";

export default function CustomSwiper({ children }: React.PropsWithChildren) {
  return (
      <Swiper
        modules={[Navigation, FreeMode]}
        navigation
        freeMode={true}
        grabCursor={true}
        loop
        allowTouchMove
        spaceBetween={24}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1280: {
            slidesPerView: 3,
          },
        }}
        className="w-full grid p-2!"
      >
        {Array.isArray(children) ? (
          children.map((child, idx) => (
            <SwiperSlide key={idx}>{child}</SwiperSlide>
          ))
        ) : (
          <SwiperSlide className="h-full">{children}</SwiperSlide>
        )}
      </Swiper>
  );
}

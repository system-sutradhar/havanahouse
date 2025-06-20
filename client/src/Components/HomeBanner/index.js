// HomeBanner.jsx (Optimized for SEO, Web Vitals, Responsive Design)
"use client";
import React, { useContext } from "react";

function sanitize(html) {
  return html.replace(/<script.*?>.*?<\/script>/gi, "");
}
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { MyContext } from "@/context/ThemeContext";
import Link from "next/link";
import styles from "../../app/banners.css";

const HomeBanner = ({ data = [] }) => {
  const context = useContext(MyContext);

  return (
    <section className="bannerWrapper" aria-label="Homepage promotions">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        navigation={context.windowWidth > 992}
        loop={data?.length > 1}
        speed={600}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        modules={[Navigation, Autoplay]}
        className="bannerSwiper"
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="banner-slide">
              {item.type === "video" ? (
                <video
                  src={item.images[0]}
                  className="banner-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <Image
                  src={item.images[0]}
                  alt={item.alt || `Banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="banner-img"
                />
              )}
              {item?.cta && (
                <div
                  className={`banner-cta ${item.position || ""}`.trim()}
                  dangerouslySetInnerHTML={{ __html: sanitize(item.cta) }}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HomeBanner;


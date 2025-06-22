"use client";
import { useState, useRef } from "react";
import { FaMagnifyingGlassPlus } from "react-icons/fa6";
import Skeleton from "@mui/material/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";

const fallbackImg = "http://localhost:3000/_next/static/media/pdp_default.56352841.png";

const ImageWithSkeleton = ({ src, alt, onClick, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ bgcolor: "#eee" }}
        />
      )}
      <img
        src={error ? fallbackImg : src}
        alt={alt}
        className={className}
        style={{ display: loaded ? "block" : "none" }}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        onClick={onClick}
      />
    </>
  );
};

const ProductImageGallery = ({ images = [], name = "" }) => {
  const [active, setActive] = useState(0);
  const thumbs = useRef();
  const big = useRef();

  const onThumbClick = (idx) => {
    setActive(idx);
    if (thumbs.current?.swiper) thumbs.current.swiper.slideTo(idx);
    if (big.current?.swiper) big.current.swiper.slideTo(idx);
  };

  return (
    <div className="product-gallery d-flex">
      <div className="thumbnail-column me-3 d-none d-md-block">
        <Swiper
          direction="vertical"
          slidesPerView={5}
          spaceBetween={10}
          className="thumb-swiper"
          modules={[Navigation]}
          navigation
          ref={thumbs}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className={`thumb-item ${idx === active ? "selected" : ""}`}
                aria-selected={idx === active}
              >
                <ImageWithSkeleton
                  src={img}
                  alt={`${name} thumbnail ${idx + 1}`}
                  onClick={() => onThumbClick(idx)}
                  className="w-100 h-100"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="main-image flex-fill position-relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          className="main-swiper"
          modules={[Navigation]}
          navigation
          ref={big}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="zoom-wrap">
                <InnerImageZoom
                  src={img}
                  zoomSrc={img}
                  alt={`${name} image ${idx + 1}`}
                  zoomType="hover"
                  zoomScale={1}
                  zoomPreload={true}
                />
                <span className="zoom-icon">
                  <FaMagnifyingGlassPlus />
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductImageGallery;

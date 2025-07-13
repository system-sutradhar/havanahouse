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

// Import the default image correctly
import defaultProductImg from "@/assets/images/pdp_default.png";

// Helper component for thumbnails with skeleton loading and error handling
const ImageWithSkeleton = ({ src, alt, onClick, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Determine the final image source. If an error occurs or if the src is the placeholder, use the default image.
  const imageSrc = error || src === 'https://via.placeholder.com/150' ? defaultProductImg.src : src;

  return (
    <>
      {/* Show skeleton only if the image hasn't loaded and there isn't an error */}
      {!loaded && !error && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%" // Thumbnails should take the height of their container
          sx={{ bgcolor: "#eee" }}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        style={{ display: loaded || error ? "block" : "none" }} // Show image if loaded or if there's an error (to show fallback)
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
  
  // Create a clean array of images to display, handling an empty or non-existent array.
  const displayImages = images && images.length > 0 ? images : [defaultProductImg.src];

  return (
    <div className="product-gallery d-flex">
      {/* Thumbnail Column */}
      <div className="thumbnail-column d-none d-md-block">
        <Swiper
          direction="vertical"
          slidesPerView={5}
          spaceBetween={10}
          className="thumb-swiper"
          modules={[Navigation]}
          navigation
          ref={thumbs}
        >
          {displayImages.map((img, idx) => (
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

      {/* Main Image Column */}
      <div className="main-image flex-fill position-relative">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          className="main-swiper"
          modules={[Navigation]}
          navigation
          ref={big}
          onSlideChange={(swiper) => setActive(swiper.activeIndex)} // Sync active state on slide change
        >
          {displayImages.map((img, idx) => {
            // --- THIS IS THE FIX ---
            // The same fallback logic is now applied to the main image viewer.
            const finalImageSrc = img === 'https://via.placeholder.com/150' ? defaultProductImg.src : img;

            return (
              <SwiperSlide key={idx}>
                <div className="zoom-wrap">
                  <InnerImageZoom
                    src={finalImageSrc}
                    zoomSrc={finalImageSrc}
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
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductImageGallery;
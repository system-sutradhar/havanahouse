// src/utils/imageFallback.js

import defaultProductImg from "@/assets/images/pdp_default.png";
import defaultBannerImg from "@/assets/images/homeBannerPlaceholder.jpg";

// Product image fallback
export const getProductImage = (imageUrl) => {
  if (!imageUrl || imageUrl.includes("placeholder") || imageUrl.includes("null")) {
    return defaultProductImg.src;
  }
  return imageUrl;
};

// Banner image fallback
export const getBannerImage = (imageUrl) => {
    if (!imageUrl || imageUrl.includes("placeholder") || imageUrl.includes("null")) {
      return defaultBannerImg.src;
    }
    return imageUrl;
  };
'use client';
import React, { useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import './ImageGallery.css';

// Define the default image path
import defaultImage from "@/assets/images/pdp_default.png";
const placeholderUrl = 'https://via.placeholder.com/150';

const ImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(defaultImage.src);
  const [isOpen, setIsOpen] = useState(false);
  
  // Create a memoized list of valid images to display
  const validImages = React.useMemo(() => {
    const filtered = images?.filter(img => img && img !== placeholderUrl) || [];
    return filtered.length > 0 ? filtered : [defaultImage.src];
  }, [images]);

  // Set the first valid image as the selected one when the component loads
  useEffect(() => {
    setSelectedImage(validImages[0]);
  }, [validImages]);

  // Create an array of slides for the lightbox from valid images
  const slides = validImages.map(src => ({ src }));
  const selectedIndex = validImages.indexOf(selectedImage);

  return (
    <>
      <div className="vertical-image-gallery">
        {/* Thumbnails Column (Left) */}
        <div className="thumbnails-column">
          {validImages.map((image, index) => (
            <div 
              key={index}
              className={`thumbnail-item-vertical ${selectedImage === image ? 'active' : ''}`}
              onMouseOver={() => setSelectedImage(image)}
            >
              <img src={image} alt={`Product thumbnail ${index + 1}`} />
            </div>
          ))}
        </div>
        
        {/* Main Image Column (Right) */}
        <div className="main-image-column" onClick={() => setIsOpen(true)}>
          <img src={selectedImage} alt="Main product view" />
          <div className="zoom-hint">Click to enlarge</div>
        </div>
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={selectedIndex}
        plugins={[Zoom]}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .8)" } }}
      />
    </>
  );
};

export default ImageGallery;
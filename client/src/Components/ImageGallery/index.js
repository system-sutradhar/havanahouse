'use client';
import React, { useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    const defaultImage = '/images/default-cigar-placeholder.png'; // Your fallback image
    return (
      <div className="vertical-image-gallery">
        <div className="main-image-column">
          <img src={defaultImage} alt="Default Product" />
        </div>
      </div>
    );
  }

  const slides = images.map(src => ({ src }));
  const selectedIndex = images.indexOf(selectedImage);

  return (
    <>
      <div className="vertical-image-gallery">
        {/* Thumbnails Column (Left) */}
        <div className="thumbnails-column">
          {images.map((image, index) => (
            <div 
              key={index}
              className={`thumbnail-item-vertical ${selectedImage === image ? 'active' : ''}`}
              onMouseOver={() => setSelectedImage(image)} // Change image on hover for a smoother experience
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
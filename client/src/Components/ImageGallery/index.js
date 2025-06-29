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
    const defaultImage = '/images/default-cigar-placeholder.png';
    return (
      <div className="image-gallery-container">
        <div className="main-image-wrapper">
          <img src={defaultImage} alt="Default Product Image" />
        </div>
      </div>
    );
  }

  // Create an array of slides for the lightbox
  const slides = images.map(src => ({ src }));

  return (
    <div className="image-gallery-container">
      <div className="main-image-wrapper" onClick={() => setIsOpen(true)}>
        <img src={selectedImage} alt="Main product view" />
        <div className="zoom-hint">Click to zoom</div>
      </div>
      
      <div className="thumbnail-wrapper">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`thumbnail-item ${selectedImage === image ? 'active' : ''}`}
            onClick={() => setSelectedImage(image)}
          >
            <img src={image} alt={`Product thumbnail ${index + 1}`} />
          </div>
        ))}
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        plugins={[Zoom]}
      />
    </div>
  );
};

export default ImageGallery;
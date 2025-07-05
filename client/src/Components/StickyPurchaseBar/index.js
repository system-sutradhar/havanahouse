'use client';
import React from 'react';
import './StickyPurchaseBar.css';
import ProductPageNav from '../ProductPageNav';

const StickyPurchaseBar = ({ product, isVisible }) => {
  // If the bar isn't supposed to be visible, render nothing.
  if (!isVisible) {
    return null;
  }

  // Helper function to smoothly scroll to a section on the page.
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      // We calculate the correct scroll position by accounting for the height of the sticky bar itself.
      const yOffset = -90; // 80px for the bar + 10px margin
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  
  const isInStock = product.stock > 0;
  const buttonText = isInStock ? "ADD TO BASKET" : "OUT OF STOCK";
  const buttonClass = isInStock ? "sticky-add-to-basket" : "sticky-add-to-basket disabled";

  return (
    <div className="sticky-purchase-bar-wrapper">
      <div className="sticky-purchase-bar-container">
        {/* --- Left Side: Product Info & Navigation --- */}
        <div className="sticky-left-content">
          <img 
            src={product.images[0] || '/images/default-cigar-placeholder.png'} 
            alt={product.name} 
            className="sticky-product-image" 
          />
          <div className="sticky-title-and-nav">
            <span className="sticky-product-name">{product.name}</span>
            <ProductPageNav isSticky={true}/>
          </div>
        </div>

        {/* --- Right Side: Price & Purchase Button --- */}
        <div className="sticky-right-actions">
          <span className="sticky-product-price">£{product.price.toFixed(2)}</span>
          <button className={buttonClass} disabled={!isInStock}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyPurchaseBar;
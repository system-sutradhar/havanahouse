'use client';
import React from 'react';
import './ProductPageNav.css';

const ProductPageNav = ({ isSticky = false }) => {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      // Offset to account for the sticky header
      const yOffset = -90; 
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Use a different class for the sticky version for styling
  const navClass = isSticky ? "product-page-nav sticky" : "product-page-nav";
  return (
    <nav className="product-page-nav">
      <div className="product-page-nav-container">
        {/* Using onClick to trigger smooth scrolling */}
        <a href="#about-product" onClick={(e) => scrollToSection(e, 'about-product')}>About the product</a>
        <a href="#characteristics" onClick={(e) => scrollToSection(e, 'characteristics')}>Characteristics</a>
        <a href="#reviews" onClick={(e) => scrollToSection(e, 'reviews')}>Reviews and questions</a>
        {/* Static links for now, as requested */}
        <a href="#accessories" onClick={(e) => scrollToSection(e, 'accessories')}>Accessories</a>
      </div>
    </nav>
  );
};

export default ProductPageNav;
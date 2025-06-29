'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { LuLeaf, LuBarChart, LuGlobe } from "react-icons/lu";
import './ProductInfo.css';

// Star Rating Component (for displaying reviews)
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(<FaStarHalfAlt key={i} />);
    } else {
      stars.push(<FaRegStar key={i} />);
    }
  }
  return <div className="star-rating">{stars}</div>;
};

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="product-info-container">
      {/* Brand and Name */}
      <Link href={`/brand/${product.brand}`} className="pdp-brand">{product.brand}</Link>
      <h1 className="pdp-name">{product.name}</h1>

      {/* Reviews (Static Data) */}
      <div className="pdp-reviews">
        <StarRating rating={4.5} />
        <a href="#reviews" className="reviews-link">(12 Customer Reviews)</a>
      </div>

      {/* Price */}
      <div className="pdp-price">
        {product.price ? `£${product.price.toFixed(2)}` : 'Price not available'}
      </div>

      {/* Quantity and Add to Basket */}
      <div className="pdp-actions">
        <div className="quantity-selector">
          <button onClick={() => handleQuantityChange(-1)}>-</button>
          <input type="text" value={quantity} readOnly />
          <button onClick={() => handleQuantityChange(1)}>+</button>
        </div>
        <button className="add-to-basket-btn-pdp">ADD TO BASKET</button>
      </div>

      {/* At a Glance Details (Static Data) */}
      <div className="at-a-glance">
        <div className="glance-item">
          <LuGlobe className="glance-icon" />
          <div>
            <span className="glance-label">Country</span>
            <span className="glance-value">Cuba</span>
          </div>
        </div>
        <div className="glance-item">
          <LuBarChart className="glance-icon" />
          <div>
            <span className="glance-label">Strength</span>
            <span className="glance-value">Medium to Full</span>
          </div>
        </div>
        <div className="glance-item">
          <LuLeaf className="glance-icon" />
          <div>
            <span className="glance-label">Wrapper</span>
            <span className="glance-value">Corojo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
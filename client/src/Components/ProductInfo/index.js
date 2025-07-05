'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import PriceBlock from '../PriceBlock';
import DeliveryInfo from '../DeliveryInfo';
import './ProductInfo.css';

const StarRating = ({ rating }) => { /* ... star logic ... */ };

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  // Logic for dynamic button
  const isInStock = product.stock > 0;
  const buttonText = isInStock ? "ADD TO BASKET" : "OUT OF STOCK";
  const buttonClass = isInStock ? "add-to-basket-btn-pdp" : "add-to-basket-btn-pdp disabled";

  return (
    <div className="product-info-container">
      <Link href={`/brand/${product.brand}`} className="pdp-brand">{product.brand}</Link>
      <div className="pdp-reviews">
        <StarRating rating={4.5} />
        <a href="#reviews" className="reviews-link">(12 Reviews)</a>
      </div>

      <PriceBlock price={product.price} oldPrice={product.oldPrice || null} />
      
      <div className="pdp-actions">
        <div className="quantity-selector">
          <button onClick={() => handleQuantityChange(-1)}>-</button>
          <input type="text" value={quantity} readOnly />
          <button onClick={() => handleQuantityChange(1)}>+</button>
        </div>
        {/* --- UPDATED DYNAMIC BUTTON --- */}
        <button className={buttonClass} disabled={!isInStock}>
          {buttonText}
        </button>
      </div>

      <DeliveryInfo />
      {/* Key Characteristics */}
      <div className="key-characteristics">
        <h4>Key Characteristics:</h4>
        <ul>
          <li><strong>Country:</strong> Cuba</li>
          <li><strong>Strength:</strong> Medium</li>
          <li><strong>Length:</strong> 4 7/8"</li>
          <li><strong>Ring Gauge:</strong> 50</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductInfo;
import React from 'react';
import Link from 'next/link';
import { FaShoppingBag } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} className="product-image-link">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="product-image"
        />
      </Link>
      <div className="product-info">
        <span className="product-brand">{product.brand || 'Havana House'}</span>
        <h4 className="product-name">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h4>
        <div className="product-price-action">
          {product.price && typeof product.price === 'number' ? (
            <span className="product-price">£{product.price.toFixed(2)}</span>
          ) : (
            <span className="product-price">Price not available</span>
          )}
          <button className="add-to-cart-btn" aria-label="Add to cart">
            <FaShoppingBag />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
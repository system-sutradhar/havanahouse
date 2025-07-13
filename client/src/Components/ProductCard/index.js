import React from 'react';
import Link from 'next/link';
import { FaShoppingBag } from 'react-icons/fa';
import './ProductCard.css';
import defaultProductImg from "@/assets/images/pdp_default.png";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} className="product-image-link">
        <img 
          src={(product.images && product.images.length > 0 && product.images[0] !== 'https://via.placeholder.com/150') ? product.images[0] : defaultProductImg.src}
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
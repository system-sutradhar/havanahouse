'use client';

import { useState, useContext } from 'react';
import Rating from '@mui/material/Rating';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { MdOutlineCompareArrows } from 'react-icons/md';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import QuantityBox from '@/Components/QuantityBox';
import { MyContext } from '@/context/ThemeContext';
import styles from './productInfo.module.css';

const ProductInfo = ({ product, isAddedToMyList, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const context = useContext(MyContext);

  const {
    name,
    brand,
    price,
    mrp,
    discount,
    rating,
    reviewCount,
  } = product || {};

  return (
    <div className={styles.productInfo}>
      <h1 className={styles.productTitle}>{name}</h1>
      {brand && <p className={styles.productBrand}>by {brand}</p>}

      <div className={`d-flex align-items-center gap-2 mb-3 ${styles.productRating ?? ''}`}>
        <Rating name="read-only" value={rating || 4} readOnly precision={0.5} />
        <span className={styles.reviewCount}>({reviewCount || 0} reviews)</span>
      </div>

      <div className={styles.productPrice + ' mb-3'}>
        <span className={styles.priceCurrent}>₹{price}</span>
        {mrp && <span className={styles.priceMrp}>₹{mrp}</span>}
        {discount && (
          <span className={styles.priceDiscount}>({discount}% OFF)</span>
        )}
      </div>

      <div className={styles.productQuantity + ' mb-3'}>
        <QuantityBox value={quantity} onChange={setQuantity} />
      </div>

      <div className={`d-flex gap-2 mb-3 ${styles.productActions}`}>
        <Button
          variant="contained"
          aria-label="Add to cart"
          onClick={() => onAddToCart(quantity)}
        >
          Add to Cart
        </Button>
        <Tooltip title={isAddedToMyList ? 'Added to My List' : 'Add to Wishlist'}>
          <button
            className="icon-button"
            aria-label="Add to wishlist"
            onClick={() => context.addToList(product.id)}
          >
            {isAddedToMyList ? <FaHeart color="red" /> : <FaRegHeart />}
          </button>
        </Tooltip>
        <Tooltip title="Compare">
          <button className="icon-button" aria-label="Compare product">
            <MdOutlineCompareArrows />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProductInfo;

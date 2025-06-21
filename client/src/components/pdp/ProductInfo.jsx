'use client';

import { useState, useContext } from 'react';
import Rating from '@mui/material/Rating';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { MdOutlineCompareArrows } from 'react-icons/md';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import QuantityBox from '@/Components/QuantityBox';
import { MyContext } from '@/context/ThemeContext';
import styles from './productInfo.module.css';

const ProductInfo = ({ product, isAddedToMyList, onAddToCart, themeColors }) => {
  const [quantity, setQuantity] = useState(1);
  const context = useContext(MyContext);

  const {
    name,
    brand,
    price,
    oldPrice,
    discount,
    rating,
    reviewCount,
    origin,
    wrapperType,
    strength,
    boxType,
    ringGauge,
    lengthInInches,
    binder,
    filler,
    badgeIcons = [],
    trustLabels = [],
    complianceNotes,
  } = product || {};

  const saveAmount = oldPrice && price ? oldPrice - price : 0;

  return (
    <div className={styles.productInfo}>
      <h1 className={styles.productTitle} style={{ color: themeColors?.primary }}>
        {name}
      </h1>
      {badgeIcons.length > 0 && (
        <Stack direction="row" spacing={1} className="mb-2" flexWrap="wrap">
          {badgeIcons.map((b) => (
            <Chip key={b} label={b} color="secondary" size="small" />
          ))}
        </Stack>
      )}
      {brand && <p className={styles.productBrand}>by {brand}</p>}

      <div className={`d-flex align-items-center gap-2 mb-3 ${styles.productRating ?? ''}`}>
        <Rating name="read-only" value={rating || 4} readOnly precision={0.5} />
        <span className={styles.reviewCount}>({reviewCount || 0} reviews)</span>
      </div>

      <div className={styles.productPrice + ' mb-3'}>
        <span className={styles.priceCurrent}>₹{price}</span>
        {oldPrice && <span className={styles.priceMrp}>₹{oldPrice}</span>}
        {discount && (
          <span className={styles.priceDiscount}>({discount}% OFF)</span>
        )}
        {saveAmount > 0 && (
          <span className={styles.saveAmount}>You Save ₹{saveAmount}</span>
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
          sx={{
            bgcolor: themeColors?.button || 'primary.main',
            color: themeColors?.text || '#fff',
            '&:hover': {
              bgcolor: themeColors?.primary || 'primary.dark',
            },
          }}
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

      <div className="mb-2">
        <table className={styles.specTable} aria-label="Cigar specifications">
          <tbody>
            {origin && (
              <tr>
                <th scope="row">Origin</th>
                <td>{origin}</td>
              </tr>
            )}
            {wrapperType && (
              <tr>
                <th scope="row">Wrapper</th>
                <td>{wrapperType}</td>
              </tr>
            )}
            {strength && (
              <tr>
                <th scope="row">Strength</th>
                <td>{strength}</td>
              </tr>
            )}
            {ringGauge && (
              <tr>
                <th scope="row">Ring Gauge</th>
                <td>{ringGauge}</td>
              </tr>
            )}
            {lengthInInches && (
              <tr>
                <th scope="row">Length (in)</th>
                <td>{lengthInInches}</td>
              </tr>
            )}
            {binder && (
              <tr>
                <th scope="row">Binder</th>
                <td>{binder}</td>
              </tr>
            )}
            {filler && (
              <tr>
                <th scope="row">Filler</th>
                <td>{filler}</td>
              </tr>
            )}
            {boxType && (
              <tr>
                <th scope="row">Box Type</th>
                <td>{boxType}</td>
              </tr>
            )}
          </tbody>
        </table>
        {complianceNotes && (
          <p className="text-danger small">{complianceNotes}</p>
        )}
        {trustLabels.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {trustLabels.map((t) => (
              <Chip key={t} label={t} variant="outlined" size="small" />
            ))}
          </Stack>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;

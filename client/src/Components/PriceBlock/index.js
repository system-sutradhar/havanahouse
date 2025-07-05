import React from 'react';
import './PriceBlock.css';

const PriceBlock = ({ price, oldPrice }) => {
  const savings = oldPrice ? oldPrice - price : 0;

  return (
    <div className="price-block">
      <div className="price-main">
        <span className="current-price">£{price.toFixed(2)}</span>
        {oldPrice && (
          <span className="old-price">£{oldPrice.toFixed(2)}</span>
        )}
      </div>
      {savings > 0 && (
        <div className="savings-badge">
          Save £{savings.toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default PriceBlock;
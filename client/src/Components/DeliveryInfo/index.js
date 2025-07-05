import React from 'react';
import { FaTruck, FaStore } from 'react-icons/fa';
import './DeliveryInfo.css';

const DeliveryInfo = () => {
  return (
    <div className="delivery-info-block">
      <div className="delivery-option">
        <FaTruck className="delivery-icon" />
        <div>
          <span className="delivery-title">UK Delivery</span>
          <span className="delivery-detail">Tomorrow, from £4.50</span>
        </div>
      </div>
      <div className="delivery-option">
        <FaStore className="delivery-icon" />
        <div>
          <span className="delivery-title">Click & Collect</span>
          <span className="delivery-detail">Available at our Windsor Store</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
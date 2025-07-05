import React from 'react';
import './PDPSkeleton.css';

const PDPSkeleton = () => {
  return (
    <div className="pdp-page">
      <div className="pdp-layout-container skeleton-container">
        {/* Left Column: Image Gallery Skeleton */}
        <div className="pdp-left-column">
          <div className="skeleton-box main-image"></div>
          <div className="thumbnail-wrapper">
            <div className="skeleton-box thumbnail"></div>
            <div className="skeleton-box thumbnail"></div>
            <div className="skeleton-box thumbnail"></div>
            <div className="skeleton-box thumbnail"></div>
          </div>
        </div>

        {/* Right Column: Product Info Skeleton */}
        <div className="pdp-right-column">
          <div className="skeleton-box text short"></div>
          <div className="skeleton-box text long"></div>
          <div className="skeleton-box text medium"></div>
          <div className="skeleton-box price"></div>
          <div className="pdp-actions">
            <div className="skeleton-box quantity"></div>
            <div className="skeleton-box button"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDPSkeleton;
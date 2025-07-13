import React from 'react';
import './PLPSkeleton.css';

const SkeletonProductCard = () => (
  <div className="skeleton-product-card">
    <div className="skeleton-box skeleton-image"></div>
    <div className="skeleton-box skeleton-text small"></div>
    <div className="skeleton-box skeleton-text medium"></div>
    <div className="skeleton-box skeleton-text price"></div>
  </div>
);

const PLPSkeleton = () => {
  return (
    <div className="search-page-wrapper skeleton-mode">
      <div className="search-page-container">
        {/* Skeleton for Header */}
        <div className="results-header">
          <div className="skeleton-box skeleton-title"></div>
          <div className="skeleton-box skeleton-subtitle"></div>
        </div>
        
        <div className="controls-bar">
            <div className="skeleton-box skeleton-text medium"></div>
            <div className="skeleton-box skeleton-text medium"></div>
        </div>

        <div className="plp-layout-grid">
          {/* Main Product Grid Skeleton */}
          <div className="product-grid-container">
            <div className="product-grid-skeleton">
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
              <SkeletonProductCard />
            </div>
          </div>

          {/* Filter Sidebar Skeleton */}
          <aside className="filter-sidebar-skeleton">
            <div className="skeleton-box skeleton-text medium"></div>
            <div className="skeleton-box skeleton-text long"></div>
            <div className="skeleton-box skeleton-text long"></div>
            <div className="skeleton-box skeleton-text long"></div>
            <br/>
            <div className="skeleton-box skeleton-text medium"></div>
            <div className="skeleton-box skeleton-text long"></div>
            <div className="skeleton-box skeleton-text long"></div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PLPSkeleton;
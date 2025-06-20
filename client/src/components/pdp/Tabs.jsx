'use client';
import { useState } from 'react';

const Tabs = ({ description, reviews }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="product-tabs">
      <div className="tab-header" role="tablist">
        <button
          onClick={() => setActiveTab('description')}
          className={activeTab === 'description' ? 'active' : ''}
          role="tab"
          aria-selected={activeTab === 'description'}
          aria-controls="tab-desc"
          id="tab-desc-btn"
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={activeTab === 'reviews' ? 'active' : ''}
          role="tab"
          aria-selected={activeTab === 'reviews'}
          aria-controls="tab-rev"
          id="tab-rev-btn"
        >
          Reviews
        </button>
      </div>
      <div className="tab-body">
        {activeTab === 'description' && (
          <div id="tab-desc" role="tabpanel" aria-labelledby="tab-desc-btn" className="tab-content">
            {description || 'No description available.'}
          </div>
        )}
        {activeTab === 'reviews' && (
          <div id="tab-rev" role="tabpanel" aria-labelledby="tab-rev-btn" className="tab-content">
            {reviews?.length > 0 ? (
              reviews.map((r, i) => (
                <div key={i} className="review">
                  <strong>{r.customerName}</strong> - <em>{r.customerRating}★</em>
                  <p>{r.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;

'use client';
import { useState } from 'react';

const Tabs = ({ description, reviews, specs = {} }) => {
  const [activeTab, setActiveTab] = useState('description');
  const entries = Object.entries(specs || {});
  const hasSpecs = entries.length > 0;

  const formatKey = (k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

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
            {hasSpecs && (
              <div className="mt-3">
                <h3>Cigar Specifications</h3>
                <ul>
                  {entries.map(([k, v]) => (
                    <li key={k}>
                      <strong>{formatKey(k)}:</strong>{' '}
                      {Array.isArray(v) ? v.join(', ') : v}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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

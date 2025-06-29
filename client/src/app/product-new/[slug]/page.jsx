'use client';
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import ImageGallery from '@/Components/ImageGallery';
import './pdp.css';

const ProductPageContent = ({ params }) => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Correctly get the slug from the params array.
    const slug = params.slug;

    // 2. If there's no slug, stop and show an error.
    if (!slug) {
      setLoading(false);
      setError("Product ID not found in the URL.");
      return;
    }
    
    // 3. Fetch the data using the correct API endpoint structure.
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/products/${slug}`)
      .then(response => {
        // The API returns the product directly, not nested under a 'product' key.
        setProductData(response.data);
      })
      .catch(err => {
        console.error('Error fetching product data:', err);
        setError('Failed to load product. It may not exist or there was a server error.');
      })
      .finally(() => {
        setLoading(false);
      });
      
  }, [params.slug]);

  if (loading) {
    return <div className="pdp-message">Loading Product...</div>;
  }

  if (error) {
    return <div className="pdp-message pdp-error">{error}</div>;
  }
  
  if (!productData) {
    return <div className="pdp-message pdp-error">Product could not be found.</div>;
  }

  return (
    <div className="pdp-page">
      <div className="pdp-layout-container">
        <div className="pdp-left-column">
          <ImageGallery images={productData.images} />
        </div>
        <div className="pdp-right-column">
          <h1 className="pdp-product-name">{productData.name}</h1>
          {productData.price && (
            <p className="pdp-product-price">£{productData.price.toFixed(2)}</p>
          )}
          <div 
            className="pdp-product-description" 
            dangerouslySetInnerHTML={{ __html: productData.description }} 
          />
          {/* We will build out the rest of this column next */}
        </div>
      </div>
    </div>
  );
};

// Next.js Suspense wrapper for pages using dynamic params
const Page = ({ params }) => {
    return (
        <Suspense fallback={<div className="pdp-loading">Loading Page...</div>}>
            <ProductPageContent params={params} />
        </Suspense>
    );
};

export default Page;
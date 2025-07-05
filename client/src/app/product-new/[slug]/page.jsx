'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import ImageGallery from '@/Components/ImageGallery';
import ProductInfo from '@/Components/ProductInfo';
import Breadcrumbs from '@/Components/Breadcrumbs';
import StickyPurchaseBar from '@/Components/StickyPurchaseBar';
import PDPSkeleton from '@/Components/PDPSkeleton';
import ProductPageNav from '@/Components/ProductPageNav';
import './pdp.css';

const ProductPageContent = ({ params }) => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  
  // This ref is now attached to the wrapper around the static nav
  const navObserverRef = useRef(null);

  useEffect(() => {
    const slug = params.slug;
    if (!slug) {
      setLoading(false);
      setError("Product ID not found.");
      return;
    }
    setLoading(true);
    axios.get(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/products/${slug}`)
      .then(res => setProductData(res.data))
      .catch(err => setError("Failed to load product."))
      .finally(() => setLoading(false));
  }, [params.slug]);

  // This effect correctly toggles the sticky bar's visibility
  useEffect(() => {
    if (!productData) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStickyVisible(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" } // Offset for main header
    );
    
    const navEl = navObserverRef.current;
    if (navEl) observer.observe(navEl);
    return () => {
      if (navEl) observer.unobserve(navEl);
    };
  }, [productData]);

  if (loading) return <PDPSkeleton />;
  if (error || !productData) return <div className="pdp-message pdp-error">{error || "Product not found."}</div>;

  return (
    <div className="pdp-page-wrapper">
      <StickyPurchaseBar product={productData} isVisible={isStickyVisible} />
      
      <div className="pdp-main-container">
        <Breadcrumbs product={productData} />
        <h1 className="pdp-main-title">{productData.name}</h1>
      </div>

      {/* --- THIS IS THE FIX --- */}
      {/* This wrapper is observed, and is hidden when the sticky bar is visible */}
      <div 
        ref={navObserverRef} 
        className={`static-nav-wrapper ${isStickyVisible ? 'hidden' : ''}`}
      >
        <ProductPageNav />
      </div>

      <div className="pdp-main-container">
        <div className="pdp-layout-grid">
          <div className="pdp-left-column">
            <ImageGallery images={productData.images} />
          </div>
          <div className="pdp-right-column">
            <ProductInfo product={productData} />
          </div>
        </div>
        
        {/* Content Sections */}
        <section id="about-product" className="pdp-section">
          <h2>About The Product</h2>
          <div className="pdp-section-content" dangerouslySetInnerHTML={{ __html: productData.description }} />
        </section>
        <section id="characteristics" className="pdp-section">
          <h2>Characteristics</h2>
          <p className="pdp-section-content">Placeholder for product specifications.</p>
        </section>
        <section id="reviews" className="pdp-section">
          <h2>Reviews and Questions</h2>
          <p className="pdp-section-content">Placeholder for customer reviews.</p>
        </section>
      </div>
    </div>
  );
};

const Page = ({ params }) => (
    <Suspense fallback={<PDPSkeleton />}>
        <ProductPageContent params={params} />
    </Suspense>
);

export default Page;
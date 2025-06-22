"use client";
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import BreadcrumbNav from '@/Components/pdp/Breadcrumbs';
import ProductHeaderInfo from '@/Components/pdp/ProductHeaderInfo';
import ProductTabNav from '@/Components/pdp/ProductTabNav';
import ProductImageGallery from '@/Components/pdp/ProductImageGallery';
import ProductInfoSection from '@/Components/pdp/ProductInfoSection';
import StickyAddToCart from '@/Components/pdp/StickyAddToCart';
import Skeleton from '@mui/material/Skeleton';
import { fetchDataFromApi } from '@/utils/api';

export default function ProductNewPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [tab, setTab] = useState(0);
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    if (!slug) return;
    fetchDataFromApi(`/api/products/slug/${slug}`).then((res) => setProduct(res));
  }, [slug]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 992) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyTabs(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!product) {
    return (
      <div className="container py-5">
        <Skeleton width="40%" height={30} />
        <Skeleton width="60%" height={20} className="mt-2" />
        <Skeleton width="100%" height={40} className="mt-3" />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    product.catName ? { label: product.catName, href: `/category/${product.catId}` } : null,
    product.subCatName ? { label: product.subCatName, href: `/subcategory/${product.subCatId}` } : null,
    { label: product.name }
  ].filter(Boolean);

  return (
    <div className="container py-3">
      <BreadcrumbNav items={breadcrumbItems} />
      <div ref={headerRef} className="product-title-section">
        <ProductHeaderInfo
          title={product.name}
          rating={product.rating}
          reviews={product.reviews?.length || 0}
          code={product.id}
        />
      </div>
      <ProductTabNav
        value={tab}
        onChange={setTab}
        tabs={[
          'About the product',
          'Characteristics',
          'Reviews',
          'Delivery Info',
        ]}
        sticky={showStickyTabs}
      />

      {tab === 0 && (
        <div className="row mt-4 tab-panel">
          <div className="col-md-6">
            <ProductImageGallery images={product.images} name={product.name} />
          </div>
          <div className="col-md-6">
            <ProductInfoSection product={product} />
          </div>
        </div>
      )}
      <StickyAddToCart product={product} />
    </div>
  );
}

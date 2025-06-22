"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BreadcrumbNav from '@/Components/pdp/Breadcrumbs';
import ProductHeaderInfo from '@/Components/pdp/ProductHeaderInfo';
import ProductTabNav from '@/Components/pdp/ProductTabNav';
import { fetchDataFromApi } from '@/utils/api';

export default function ProductNewPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [tab, setTab] = useState(0);
  const [showStickyTabs, setShowStickyTabs] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchDataFromApi(`/api/products/slug/${slug}`).then((res) => setProduct(res));
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 767) {
        setShowStickyTabs(window.scrollY > 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return <div className="container py-5">Loading...</div>;
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    product.catName ? { label: product.catName, href: `/category/${product.catId}` } : null,
    { label: product.name }
  ].filter(Boolean);

  return (
    <div className="container py-3">
      <BreadcrumbNav items={breadcrumbItems} />
      <ProductHeaderInfo
        title={product.name}
        rating={product.rating}
        reviews={product.reviews?.length || 0}
      />
      <ProductTabNav
        value={tab}
        onChange={setTab}
        tabs={['About the product', 'Characteristics', 'Reviews', 'Delivery Info']}
        sticky={showStickyTabs}
      />
      {/* Additional PDP content can go here */}
    </div>
  );
}

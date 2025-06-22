"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BreadcrumbNav from '@/Components/pdp/Breadcrumbs';
import ProductHeaderInfo from '@/Components/pdp/ProductHeaderInfo';
import ProductTabNav from '@/Components/pdp/ProductTabNav';
import Skeleton from '@mui/material/Skeleton';
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
      <ProductHeaderInfo
        title={product.name}
        rating={product.rating}
        reviews={product.reviews?.length || 0}
        code={product.id}
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

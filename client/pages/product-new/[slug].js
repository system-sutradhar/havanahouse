"use client";
import { useRouter } from "next/router";
import Link from 'next/link';
import { useEffect, useState, useContext } from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { styled } from 'styled-components';
import ProductZoom from '@/Components/ProductZoom';
import ProductInfo from '@/components/pdp/ProductInfo';
import Tabs from '@/components/pdp/Tabs';
import StickyAddToCart from '@/components/pdp/StickyAddToCart';
import DeliveryChecker from '@/components/pdp/DeliveryChecker';
import RelatedProducts from '@/components/pdp/RelatedProducts';
import TrustBadges from '@/components/pdp/TrustBadges';
import SkeletonLoader from '@/components/pdp/SkeletonLoader';
import SeoHead from '@/components/pdp/SeoHead';
import StructuredData from '@/components/pdp/StructuredData';
import GoogleTagManager from '@/components/pdp/GoogleTagManager';
import { MyContext } from '@/context/ThemeContext';
import { fetchDataFromApi } from '@/utils/api';

const PdpContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 32px;
  }
`;

const BreadcrumbWrapper = styled.div`
  margin-bottom: 1rem;
`;

const ProductNewPage = () => {
  const router = useRouter();
  const { slug } = router.query || {};
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [found, setFound] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const context = useContext(MyContext);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const prod = await fetchDataFromApi(`/api/products/${slug}`);
        if (!prod || prod.status === false) {
          setFound(false);
          return;
        }
        setProduct(prod);
        const rel = await fetchDataFromApi(`/api/products?subCatId=${prod.subCatId}`);
        setRelated(rel?.products?.filter((p) => p.id !== prod.id) || []);
        const rev = await fetchDataFromApi(`/api/productReviews?productId=${prod.id}`);
        setReviews(rev || []);
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          const wl = await fetchDataFromApi(`/api/my-list?productId=${prod.id}&userId=${user.userId}`);
          if (wl.length) setIsInWishlist(true);
        }
      } catch (err) {
        console.error('Failed loading product', err);
        setFound(false);
      }
    };
    load();
  }, [slug]);

  const handleAddToCart = (quantity = 1) => {
    if (!product) return;
    context.addToCart({ ...product, quantity });
  };

  if (!found) {
    return (
      <div className="container py-5 text-center">
        <SeoHead title="Product Not Found" description="" />
        <p>Product not found.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <>
        <SeoHead title="Loading..." description="" />
        <SkeletonLoader />
      </>
    );
  }

  return (
    <>
      <SeoHead
        title={product.name}
        description={product.description}
        image={product.images?.[0]}
      />
      <StructuredData product={product} />
      <GoogleTagManager />
      <BreadcrumbWrapper>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <span aria-current="page">{product.name}</span>
        </Breadcrumbs>
      </BreadcrumbWrapper>
      <PdpContainer>
        <div className="flex-grow-1">
          <ProductZoom images={product.images} discount={product.discount} />
        </div>
        <div className="flex-grow-1">
          <ProductInfo
            product={product}
            isAddedToMyList={isInWishlist}
            onAddToCart={handleAddToCart}
          />
          <DeliveryChecker />
          <TrustBadges />
        </div>
      </PdpContainer>
      <Tabs description={product.description} reviews={reviews} />
      <RelatedProducts currentProductId={product.id} data={related} />
      <StickyAddToCart onAddToCart={handleAddToCart} />
    </>
  );
};

export default ProductNewPage;

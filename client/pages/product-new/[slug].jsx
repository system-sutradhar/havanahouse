import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BreadcrumbNav from '@/Components/pdp/Breadcrumbs';
import ProductHeaderInfo from '@/Components/pdp/ProductHeaderInfo';
import ProductTabNav from '@/Components/pdp/ProductTabNav';
import { fetchDataFromApi } from '@/utils/api';

const ProductNewPage = () => {
  const router = useRouter();
  const { slug } = router.query || {};
  const [product, setProduct] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetchDataFromApi(`/api/products/slug/${slug}`).then((res) => {
      setProduct(res);
    });
  }, [slug]);

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
        code={product.id}
        rating={product.rating}
        reviews={product.reviews?.length || 0}
      />
      <ProductTabNav
        value={tab}
        onChange={setTab}
        tabs={['About the product', 'Characteristics', 'Reviews', 'Delivery Info']}
      />
      {/* Additional PDP content can go here */}
    </div>
  );
};

export default ProductNewPage;

'use client';
import Head from 'next/head';

const StructuredData = ({ product }) => {
  const data = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product?.name,
    image: product?.images,
    description: product?.description,
    brand: { '@type': 'Brand', name: product?.brand || 'Generic' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product?.price,
      availability: 'https://schema.org/InStock'
    }
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Head>
  );
};

export default StructuredData;

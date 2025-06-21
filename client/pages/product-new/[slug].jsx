"use client";
import { useRouter } from "next/router";
import Link from 'next/link';
import { useEffect, useState, useContext } from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { styled } from 'styled-components';
import ProductZoom from '@/Components/ProductZoom';
import ProductInfo from '@/components/pdp/ProductInfo';
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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DefaultLayout from '@/Components/DefaultLayout';

function TabPanel({ value, index, children }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const ImageGallery = ({ images, discount }) => (
  <ProductZoom images={images} discount={discount} />
);

const PriceDisplay = ({ price, mrp, discount }) => (
  <Typography variant="h5" sx={{ mb: 1 }}>
    {mrp && (
      <Typography component="span" sx={{ textDecoration: 'line-through', mr: 1 }}>
        ₹{mrp}
      </Typography>
    )}
    ₹{price}
    {discount && (
      <Typography component="span" color="error" sx={{ ml: 1 }}>
        ({discount}% OFF)
      </Typography>
    )}
  </Typography>
);

const AddToCartSection = ({ product, isAddedToMyList, onAddToCart }) => (
  <>
    <PriceDisplay price={product.price} mrp={product.mrp} discount={product.discount} />
    <ProductInfo
      product={product}
      isAddedToMyList={isAddedToMyList}
      onAddToCart={onAddToCart}
    />
  </>
);


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
  const [tab, setTab] = useState(0);
  const context = useContext(MyContext);
  const isMobile = useMediaQuery('(max-width:600px)');
  const theme = createTheme();

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const prod = await fetchDataFromApi(`/api/products/slug/${slug}`);
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
  }, [id]);

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DefaultLayout>
        <SeoHead
          title={product.name}
          description={product.description}
          image={product.images?.[0]}
        />
        <StructuredData product={product} />
        <GoogleTagManager />
        <BreadcrumbWrapper>
          <Breadcrumbs aria-label="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
            <Link href="/" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <span itemProp="name">Home</span>
              <meta itemProp="position" content="1" />
            </Link>
          {product.catName && (
            <Link
              href="/#"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <span itemProp="name">{product.catName}</span>
              <meta itemProp="position" content="2" />
            </Link>
          )}
          <span aria-current="page" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">{product.name}</span>
            <meta itemProp="position" content="3" />
          </span>
        </Breadcrumbs>
        </BreadcrumbWrapper>

      {isMobile ? (
        <div>
          <Accordion expanded={tab === 0} onChange={() => setTab(tab === 0 ? -1 : 0)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="desc-header">
              <Typography>Description</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <ImageGallery images={product.images} discount={product.discount} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <AddToCartSection
                    product={product}
                    isAddedToMyList={isInWishlist}
                    onAddToCart={handleAddToCart}
                  />
                  <DeliveryChecker />
                  <TrustBadges />
                </Grid>
              </Grid>
              {product.description && <Typography sx={{ mt: 2 }}>{product.description}</Typography>}
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={tab === 1} onChange={() => setTab(tab === 1 ? -1 : 1)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="rev-header">
              <Typography>Reviews</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {reviews.length ? (
                reviews.map((r, i) => (
                  <div key={i} className="mb-2">
                    <strong>{r.customerName}</strong> - <em>{r.customerRating}★</em>
                    <p>{r.review}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={tab === 2} onChange={() => setTab(tab === 2 ? -1 : 2)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} id="del-header">
              <Typography>Delivery Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <p>Standard delivery in 3-5 business days.</p>
            </AccordionDetails>
          </Accordion>
        </div>
      ) : (
        <>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} aria-label="product tabs" sx={{ mb: 2 }}>
            <Tab label="Description" id="tab-0" />
            <Tab label="Reviews" id="tab-1" />
            <Tab label="Delivery Info" id="tab-2" />
          </Tabs>
          <TabPanel value={tab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <ImageGallery images={product.images} discount={product.discount} />
              </Grid>
              <Grid item xs={12} md={6}>
                <AddToCartSection
                  product={product}
                  isAddedToMyList={isInWishlist}
                  onAddToCart={handleAddToCart}
                />
                <DeliveryChecker />
                <TrustBadges />
              </Grid>
            </Grid>
            {product.description && <Typography sx={{ mt: 2 }}>{product.description}</Typography>}
          </TabPanel>
          <TabPanel value={tab} index={1}>
            {reviews.length ? (
              reviews.map((r, i) => (
                <div key={i} className="mb-2">
                  <strong>{r.customerName}</strong> - <em>{r.customerRating}★</em>
                  <p>{r.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <p>Standard delivery in 3-5 business days.</p>
          </TabPanel>
        </>
      )}

        <RelatedProducts currentProductId={product.id} data={related} />
        <StickyAddToCart onAddToCart={handleAddToCart} />
      </DefaultLayout>
    </ThemeProvider>
  );
};

export default ProductNewPage;

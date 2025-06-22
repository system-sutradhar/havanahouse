"use client";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const ProductHeaderInfo = ({ title, code, rating = 0, reviews = 0 }) => {
  return (
    <div className="pdp-header-info d-flex justify-content-between align-items-start">
      <div>
        <Typography component="h1" variant="h5" className="product-title">
          {title}
        </Typography>
        {code && (
          <Typography variant="body2" className="product-code mt-1">
            Code: {code}
          </Typography>
        )}
      </div>
      <div className="d-flex align-items-center rating-block">
        <Rating value={Number(rating)} precision={0.5} readOnly size="small" />
        <Typography variant="body2" className="ms-1">({reviews})</Typography>
      </div>
    </div>
  );
};

export default ProductHeaderInfo;

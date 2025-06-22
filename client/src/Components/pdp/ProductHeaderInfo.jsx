"use client";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const ProductHeaderInfo = ({ title, code, rating = 0, reviews = 0 }) => {
  return (
    <div className="pdp-header-info">
      <Typography component="h1" variant="h5" className="product-title">
        {title}
      </Typography>
      <div className="d-flex align-items-center mt-1">
        {code && (
          <Typography variant="body2" className="product-code me-3">
            Code: {code}
          </Typography>
        )}
        <div className="d-flex align-items-center rating-block">
          <Rating value={Number(rating)} precision={0.5} readOnly size="small" />
          <Typography variant="body2" className="ms-1">({reviews})</Typography>
        </div>
      </div>
    </div>
  );
};

export default ProductHeaderInfo;

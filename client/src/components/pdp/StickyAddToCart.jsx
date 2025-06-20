'use client';
import Button from '@mui/material/Button';
import { styled } from 'styled-components';

const Bar = styled.div`
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 0.5rem;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
`;

const StickyAddToCart = ({ onAddToCart }) => {
  return (
    <Bar>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => onAddToCart(1)}
        aria-label="Add to cart"
      >
        Add to Cart
      </Button>
    </Bar>
  );
};

export default StickyAddToCart;

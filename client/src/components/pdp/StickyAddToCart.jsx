'use client';
import Button from '@mui/material/Button';
import { styled } from 'styled-components';

const Bar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${(p) => p.bg || '#fff'};
  padding: 0.5rem;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1200;
`;
const StickyAddToCart = ({ onAddToCart, show = false, themeColors }) => {
  if (!show) return null;
  return (
    <Bar bg={themeColors?.primary}>
      <Button
        fullWidth
        variant="contained"
        onClick={() => onAddToCart(1)}
        sx={{
          bgcolor: themeColors?.button || 'primary.main',
          color: themeColors?.text || '#fff',
          '&:hover': {
            bgcolor: themeColors?.primary || 'primary.dark',
          },
        }}
        aria-label="Add to cart"
      >
        Add to Cart
      </Button>
    </Bar>
  );
};

export default StickyAddToCart;

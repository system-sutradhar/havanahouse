import React from 'react';
import { Box, Skeleton } from '@mui/material';

export default function LoadingSkeleton({ rows = 5, height = 40 }) {
  const items = Array.from({ length: rows });
  return (
    <Box>
      {items.map((_, idx) => (
        <Skeleton key={idx} variant="rectangular" height={height} sx={{ mb: 1 }} />
      ))}
    </Box>
  );
}

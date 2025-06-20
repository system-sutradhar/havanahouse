import React from 'react';
import { Box, Typography } from '@mui/material';
import AppBreadcrumbs from './AppBreadcrumbs';

export default function AdminPageHeader({ title, breadcrumbs = [], actions }) {
  return (
    <Box
      className="card shadow border-0 w-100 p-4"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
    >
      <Typography variant="h5" component="h1" sx={{ mb: { xs: 2, md: 0 } }}>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" sx={{ '& > *:not(:first-of-type)': { ml: 1 } }}>
        {breadcrumbs.length > 0 && <AppBreadcrumbs title={title} path={breadcrumbs} />}
        {actions}
      </Box>
    </Box>
  );
}

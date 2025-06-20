import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import AppBreadcrumbs from './AppBreadcrumbs';

export default function AdminPageLayout({ title, breadcrumbPath = [], actions, children }) {
  return (
    <Container className="right-content" maxWidth={false}>
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
          {breadcrumbPath.length > 0 && <AppBreadcrumbs title={title} path={breadcrumbPath} />}
          {actions}
        </Box>
      </Box>
      {children}
    </Container>
  );
}

import React from 'react';
import { Box, Typography } from '@mui/material';
import AppBreadcrumbs from './AppBreadcrumbs';

export default function AdminPageHeader({ title, breadcrumbs = [], actions }) {
  return (
    <Box className="card shadow border-0 w-100 p-4" mb={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold">
            {title}
          </Typography>
          {breadcrumbs.length > 0 && (
            <Box mt={1}>
              <AppBreadcrumbs title={title} path={breadcrumbs} />
            </Box>
          )}
        </Box>
        {actions && <Box mt={{ xs: 2, md: 0 }}>{actions}</Box>}
      </Box>
    </Box>
  );
}

import React from 'react';
import { Container } from '@mui/material';
import AdminPageHeader from './AdminPageHeader';

export default function AdminPageLayout({ title, breadcrumbPath = [], actions, children }) {
  return (
    <Container className="right-content" maxWidth={false}>
      <AdminPageHeader title={title} breadcrumbs={breadcrumbPath} actions={actions} />
      {children}
    </Container>
  );
}

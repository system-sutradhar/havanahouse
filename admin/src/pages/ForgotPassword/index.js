import React, { useState } from 'react';
import { TextField, Grid, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const submit = (e) => {
    e.preventDefault();
    // TODO: integrate API call
  };

  return (
    <AdminPageLayout
      title="Forgot Password"
      breadcrumbPath={[
        { label: 'Dashboard', icon: <HomeIcon />, href: '/' },
        { label: 'Forgot Password' }
      ]}
    >
      <AdminFormLayout onSubmit={submit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" gap={1} mt={3}>
          <CancelButton onClick={() => navigate('/login')} />
          <SaveButton type="submit" />
        </Box>
      </AdminFormLayout>
    </AdminPageLayout>
  );
}

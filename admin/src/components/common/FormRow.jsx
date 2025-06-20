import React from 'react';
import Box from '@mui/material/Box';

const FormRow = ({ label, children }) => (
  <Box mb={2} display="flex" flexDirection="column">
    <label className="mb-1 fw-semibold">{label}</label>
    {children}
  </Box>
);

export default FormRow;

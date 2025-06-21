import React from 'react';
import Button from '@mui/material/Button';

export const SaveButton = (props) => (
  <Button variant="contained" color="primary" sx={{ ml: 1 }} {...props}>
    Save
  </Button>
);

export const CancelButton = (props) => (
  <Button variant="outlined" color="secondary" sx={{ ml: 1 }} {...props}>
    Cancel
  </Button>
);

export const DeleteButton = (props) => (
  <Button variant="contained" color="error" sx={{ ml: 1 }} {...props}>
    Delete
  </Button>
);

export const AddButton = ({ label = 'Add', ...props }) => (
  <Button variant="contained" color="success" sx={{ ml: 1 }} {...props}>
    {label}
  </Button>
);

export default {
  SaveButton,
  CancelButton,
  DeleteButton,
  AddButton,
};

import React from 'react';
import Typography from '@mui/material/Typography';
import BaseModal from './BaseModal';
import { CancelButton, DeleteButton } from './ActionButtons';

export default function DeleteConfirmDialog({ open, onCancel, onConfirm, message = 'Are you sure you want to delete this item?' }) {
  return (
    <BaseModal
      open={open}
      onClose={onCancel}
      title="Confirm Delete"
      actions={
        <>
          <CancelButton onClick={onCancel} />
          <DeleteButton onClick={onConfirm} />
        </>
      }
    >
      <Typography>{message}</Typography>
    </BaseModal>
  );
}

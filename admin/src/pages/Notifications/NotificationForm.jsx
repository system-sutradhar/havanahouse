import { useState } from 'react';
import { Box, Grid, TextField } from '@mui/material';
import { CancelButton, SaveButton } from '../../components/common/ActionButtons';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import { uploadMedia } from '../../utils/cloudinaryService';
import SingleImageUpload from '../../components/common/SingleImageUpload';
import { postData } from '../../utils/api';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import logger from '../../utils/logger';

export default function NotificationForm({ onCancel, onSuccess }) {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadMedia(file);
      setImage(res.url);
      setPreview(res.url);
    } catch (err) {
      logger.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSaving(true);
    postData('/api/notifications', { message, image })
      .then(() => { if (onSuccess) onSuccess(); })
      .catch((err) => logger.error(err))
      .finally(() => setSaving(false));
  };

  return (
    <AdminPageLayout
      title='Add Notification'
      breadcrumbPath={[
        { icon: <HomeIcon fontSize='inherit' />, label: 'Dashboard', href: '/' },
        { icon: <NotificationsIcon fontSize='inherit' />, label: 'Notifications', href: '/notifications' },
        { label: 'Add' }
      ]}
      actions={<CancelButton onClick={onCancel} />}
    >
      <AdminFormLayout onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label='Notification Message'
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <SingleImageUpload
              preview={preview}
              onChange={handleFile}
              onRemove={() => {
                setPreview(null);
                setImage('');
              }}
            />
          </Grid>
        </Grid>
        <Box display='flex' justifyContent='flex-end' mt={3} gap={2}>
          <CancelButton onClick={onCancel} disabled={saving} />
          <SaveButton type='submit' disabled={saving} />
        </Box>
      </AdminFormLayout>
    </AdminPageLayout>
  );
}

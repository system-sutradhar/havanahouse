import { useState } from 'react';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { uploadMedia, deleteMedia } from '../../utils/cloudinaryService';
import { postData } from '../../utils/api';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';

export default function AddHomeSlide({ onSuccess, onClose, formId = 'add-slide-form' }) {
  const theme = useTheme();
  const [form, setForm] = useState({ overlayText: '', ctaUrl: '', position: 'center' });
  const [image, setImage] = useState(null);
  const [publicId, setPublicId] = useState('');
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    const res = await uploadMedia(file).catch(() => null);
    setSaving(false);
    if (res) {
      setImage(res.url);
      setPublicId(res.public_id);
      setPreview(res.url);
    }
  };

  const removeImage = () => {
    if (publicId) deleteMedia(publicId);
    setImage(null);
    setPublicId('');
    setPreview('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return;
    setSaving(true);
    postData('/api/homeBanner/create', {
      images: [image],
      overlayText: form.overlayText,
      ctaUrl: form.ctaUrl,
      position: form.position,
    })
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .finally(() => setSaving(false));
  };

  return (
    <AdminFormLayout id={formId} onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Overlay Text"
            name="overlayText"
            value={form.overlayText}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              },
            }}
            inputProps={{ tabIndex: 1, 'aria-label': 'Overlay Text' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
        <TextField
            label="CTA URL"
            name="ctaUrl"
            value={form.ctaUrl}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              },
            }}
            inputProps={{ tabIndex: 2, 'aria-label': 'CTA URL' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Position</InputLabel>
            <Select
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              inputProps={{ tabIndex: 3, 'aria-label': 'Position' }}
            >
              <MenuItem value="top-left">Top Left</MenuItem>
              <MenuItem value="top-center">Top Center</MenuItem>
              <MenuItem value="top-right">Top Right</MenuItem>
              <MenuItem value="center-left">Center Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="center-right">Center Right</MenuItem>
              <MenuItem value="bottom-left">Bottom Left</MenuItem>
              <MenuItem value="bottom-center">Bottom Center</MenuItem>
              <MenuItem value="bottom-right">Bottom Right</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              border: '1px dashed',
              borderColor: theme.palette.divider,
              p: 2,
              textAlign: 'center',
              bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
              '&:hover': { borderColor: '#888' },
            }}
          >
            {preview ? (
              <Box position="relative" display="inline-block">
                <img src={preview} alt="preview" width={150} />
                <CancelButton
                  onClick={removeImage}
                  sx={{ position: 'absolute', top: 4, right: 4 }}
                />
              </Box>
            ) : (
              <Box>
                <input
                  type="file"
                  onChange={handleImage}
                  aria-label="Upload Image"
                  tabIndex={4}
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
        <CancelButton onClick={onClose} />
        <SaveButton type="submit" />
      </Box>
    </AdminFormLayout>
  );
}

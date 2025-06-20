import { useState, useContext } from 'react';
import { Grid, TextField, Box } from '@mui/material';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import { MyContext } from '../../App';
import { postData, uploadImage } from '../../utils/api';

export default function CategoryForm({ onCancel, onSuccess }) {
  const context = useContext(MyContext);
  const [form, setForm] = useState({ name: '', color: '', image: null });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    const data = new FormData();
    data.append('images', file);
    const res = await uploadImage('/api/category/upload', data);
    setForm((f) => ({ ...f, image: res?.[0] || '' }));
    setPreview(res?.[0] || '');
    setSaving(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.color || !form.image) return;
    setSaving(true);
    await postData('/api/category/create', {
      name: form.name,
      color: form.color,
      images: [form.image],
      slug: form.name,
    });
    setSaving(false);
    if (onSuccess) onSuccess();
  };

  return (
    <AdminFormLayout onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Category Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Color"
            name="color"
            value={form.color}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <input type="file" onChange={handleFile} />
          {preview && (
            <Box mt={2}>
              <img src={preview} alt="preview" style={{ maxWidth: '150px' }} />
            </Box>
          )}
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
        {onCancel && <CancelButton onClick={onCancel} />}
        <SaveButton type="submit" disabled={saving} />
      </Box>
    </AdminFormLayout>
  );
}

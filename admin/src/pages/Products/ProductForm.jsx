import { useState, useContext } from 'react';
import { Box, Grid, TextField, MenuItem, Rating } from '@mui/material';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { MyContext } from '../../App';
import { uploadMedia } from '../../utils/cloudinaryService';
import { postData } from '../../utils/api';

export default function ProductForm({ onSuccess, onCancel }) {
  const context = useContext(MyContext);
  const [form, setForm] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    oldPrice: '',
    countInStock: '',
    category: '',
    rating: 0,
    image: null,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const res = await uploadMedia(file).catch(() => null);
    if (res) {
      setForm((prev) => ({ ...prev, image: res.url }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    postData('/api/products/create', form)
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .finally(() => setSaving(false));
  };

  return (
    <AdminPageLayout
      title="Product Upload"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <StorefrontIcon fontSize="inherit" />, label: 'Products', href: '/products' },
        { label: 'Add Product' },
      ]}
      actions={<CancelButton onClick={onCancel} />}
    >
      <AdminFormLayout onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField name="name" value={form.name} onChange={handleChange} label="Name" fullWidth required />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="brand" value={form.brand} onChange={handleChange} label="Brand" fullWidth required />
          </Grid>
          <Grid item xs={12}>
            <TextField name="description" value={form.description} onChange={handleChange} label="Description" fullWidth multiline rows={4} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select name="category" value={form.category} onChange={handleChange} label="Category" fullWidth>
              <MenuItem value="">None</MenuItem>
              {context.catData?.categoryList?.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="price" value={form.price} onChange={handleChange} label="Price" fullWidth type="number" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="oldPrice" value={form.oldPrice} onChange={handleChange} label="Old Price" fullWidth type="number" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="countInStock" value={form.countInStock} onChange={handleChange} label="Stock" fullWidth type="number" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Rating name="rating" value={form.rating} onChange={(e, val) => setForm((p)=>({...p, rating: val}))} />
          </Grid>
          <Grid item xs={12} md={6}>
            <input type="file" onChange={handleImage} />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
          <CancelButton onClick={onCancel} />
          <SaveButton type="submit" disabled={saving} />
        </Box>
      </AdminFormLayout>
    </AdminPageLayout>
  );
}

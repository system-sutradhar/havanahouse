import { useState, useContext, useEffect } from 'react';
import { Box, Grid, TextField, MenuItem, Rating, Select } from '@mui/material';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { MyContext } from '../../App';
import { postData, fetchDataFromApi } from '../../utils/api';
import MultiMediaUpload from '../../components/common/MultiMediaUpload';

export default function ProductForm({ onSuccess, onCancel }) {
  const context = useContext(MyContext);
  const [subCats, setSubCats] = useState([]);
  const [ramsList, setRamsList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [weightList, setWeightList] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    oldPrice: '',
    discount: '',
    countInStock: '',
    category: '',
    subCategory: '',
    isFeatured: '',
    productRam: [],
    productSize: [],
    productWeight: [],
    location: '',
    rating: 0,
    media: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const arr = [];
    context.catData?.categoryList?.forEach((cat) => {
      if (Array.isArray(cat.children)) arr.push(...cat.children);
    });
    setSubCats(arr);
  }, [context.catData]);

  useEffect(() => {
    fetchDataFromApi('/api/productRAMS').then((res) =>
      setRamsList(Array.isArray(res) ? res : [])
    );
    fetchDataFromApi('/api/productSIZE').then((res) =>
      setSizeList(Array.isArray(res) ? res : [])
    );
    fetchDataFromApi('/api/productWeight').then((res) =>
      setWeightList(Array.isArray(res) ? res : [])
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value,
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, images: form.media.map((m) => m.url) };
    delete payload.media;
    postData('/api/products/create', payload)
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
            <TextField select name="subCategory" value={form.subCategory} onChange={handleChange} label="Sub Category" fullWidth>
              <MenuItem value="">None</MenuItem>
              {subCats.map((sub) => (
                <MenuItem key={sub._id || sub.id} value={sub._id || sub.id}>{sub.name}</MenuItem>
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
            <TextField name="discount" value={form.discount} onChange={handleChange} label="Discount" fullWidth type="number" />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField select name="isFeatured" value={form.isFeatured} onChange={handleChange} label="Is Featured" fullWidth>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="countInStock" value={form.countInStock} onChange={handleChange} label="Stock" fullWidth type="number" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              multiple
              name="productRam"
              value={form.productRam}
              onChange={handleMultiChange}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                Product RAMS
              </MenuItem>
              {ramsList.map((item) => (
                <MenuItem key={item._id} value={item.productRam}>
                  {item.productRam}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              multiple
              name="productWeight"
              value={form.productWeight}
              onChange={handleMultiChange}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                Product Weight
              </MenuItem>
              {weightList.map((item) => (
                <MenuItem key={item._id} value={item.productWeight}>
                  {item.productWeight}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              multiple
              name="productSize"
              value={form.productSize}
              onChange={handleMultiChange}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                Product Size
              </MenuItem>
              {sizeList.map((item) => (
                <MenuItem key={item._id} value={item.size}>
                  {item.size}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField name="location" value={form.location} onChange={handleChange} label="Location" fullWidth />
          </Grid>
          <Grid item xs={12} md={6}>
            <Rating name="rating" value={form.rating} onChange={(e, val) => setForm((p)=>({...p, rating: val}))} />
          </Grid>
          <Grid item xs={12} md={6}>
            <MultiMediaUpload
              value={form.media}
              onChange={(list) => setForm((p) => ({ ...p, media: list }))}
            />
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

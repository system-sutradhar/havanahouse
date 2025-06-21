import { useState, useContext, useEffect } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import { MyContext } from '../../App';
import { postData } from '../../utils/api';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import MultiMediaUpload from '../../components/common/MultiMediaUpload';

export default function BannerForm({
  createUrl = '/api/banners/create',
  requestUrl,
  requestFn,
  onCancel,
  onSuccess,
  initialValues = { catId: '', subCatId: '', media: [] },
}) {
  const context = useContext(MyContext);
  const [form, setForm] = useState(initialValues);
  const [subCats, setSubCats] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const subs = [];
    context.catData?.categoryList?.forEach((cat) => {
      cat.children?.forEach((sc) => subs.push({ ...sc, parentId: cat._id }));
    });
    setSubCats(subs);
  }, [context.catData]);

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.media.length) return;
    setSaving(true);
    const fn = requestFn || postData;
    await fn(requestUrl || createUrl, {
      images: form.media.map((m) => m.url),
      catId: form.catId,
      subCatId: form.subCatId,
    });
    context.setAlertBox({ open: true, error: false, msg: 'Banner Saved!' });
    setSaving(false);
    if (onSuccess) onSuccess();
  };

  if (saving) {
    return <LoadingSkeleton rows={8} />;
  }

  return (
    <AdminFormLayout onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              name="catId"
              value={form.catId}
              onChange={handleChange}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {context.catData?.categoryList?.map(cat => (
                <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Sub Category</InputLabel>
            <Select
              label="Sub Category"
              name="subCatId"
              value={form.subCatId}
              onChange={handleChange}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {subCats
                .filter(sc => !form.catId || sc.parentId === form.catId)
                .map(sc => (
                  <MenuItem key={sc._id} value={sc._id}>{sc.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <MultiMediaUpload
            value={form.media}
            onChange={(list) => setForm((f) => ({ ...f, media: list }))}
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
        {onCancel && <CancelButton onClick={onCancel} />}
        <SaveButton type="submit" />
      </Box>
    </AdminFormLayout>
  );
}

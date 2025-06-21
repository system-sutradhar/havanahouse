import { useState, useContext, useEffect } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { IoCloseSharp } from 'react-icons/io5';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import { MyContext } from '../../App';
import { uploadImage, postData } from '../../utils/api';

export default function BannerForm({ uploadUrl, createUrl, onCancel, onSuccess }) {
  const context = useContext(MyContext);
  const [form, setForm] = useState({ catId: '', subCatId: '', images: [] });
  const [subCats, setSubCats] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const subs = [];
    context.catData?.categoryList?.forEach(cat => {
      cat.children?.forEach(sc => subs.push({ ...sc, parentId: cat._id }));
    });
    setSubCats(subs);
  }, [context.catData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSaving(true);
    const data = new FormData();
    files.forEach((f) => data.append('images', f));
    const res = await uploadImage(uploadUrl, data);
    if (res?.length) {
      setForm((f) => ({ ...f, images: [...f.images, ...res] }));
      setPreviews((p) => [...p, ...res]);
    }
    setSaving(false);
  };

  const removeImage = (index) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
    setPreviews((p) => p.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.images.length) return;
    setSaving(true);
    await postData(createUrl, {
      images: form.images,
      catId: form.catId,
      subCatId: form.subCatId,
    });
    setSaving(false);
    if (onSuccess) onSuccess();
  };

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
          <Box className="imgUploadBox">
            {previews.map((img, idx) => (
              <div className="uploadBox" key={idx}>
                <span className="remove" onClick={() => removeImage(idx)}><IoCloseSharp /></span>
                <div className="box">
                  <img src={img} alt="preview" className="w-100" />
                </div>
              </div>
            ))}
            <div className="uploadBox">
              <input type="file" multiple onChange={handleFile} />
              <div className="info">
                <span>Image Upload</span>
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
        {onCancel && <CancelButton onClick={onCancel} />}
        <SaveButton type="submit" />
      </Box>
    </AdminFormLayout>
  );
}

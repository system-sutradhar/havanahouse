import { useContext, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import ScaleIcon from '@mui/icons-material/Scale';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import BaseTable from '../../components/common/BaseTable';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import { fetchDataFromApi, postData, editData, deleteData } from '../../utils/api';
import { MyContext } from '../../App';

const AddProductWeight = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState('');
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef();
  const ctx = useContext(MyContext);

  const load = () => {
    fetchDataFromApi('/api/productWeight').then((res) => setList(Array.isArray(res) ? res : []));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.trim()) return;
    setSaving(true);
    const payload = { productWeight: form.trim() };
    const req = editId ? editData(`/api/productWeight/${editId}`, payload) : postData('/api/productWeight/create', payload);
    req
      .then(() => {
        ctx.setAlertBox({ open: true, error: false, msg: 'Saved!' });
        setForm('');
        setEditId(null);
        load();
      })
      .catch(() => ctx.setAlertBox({ open: true, error: true, msg: 'Failed to save' }))
      .finally(() => setSaving(false));
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setForm(row.productWeight);
    inputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (row) => {
    if (!window.confirm('Delete this item?')) return;
    deleteData(`/api/productWeight/${row.id}`).then(load);
  };

  return (
    <AdminPageLayout
      title="Product Weight"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <ScaleIcon fontSize="inherit" />, label: 'Weights', href: '/productWEIGHT/add' },
      ]}
    >
      <div className="card shadow border-0 p-3 mt-4">
        <AdminFormLayout onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Product Weight"
                name="productWeight"
                value={form}
                onChange={(e) => setForm(e.target.value)}
                fullWidth
                inputRef={inputRef}
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
            {editId && <CancelButton onClick={() => { setEditId(null); setForm(''); }} />}
            <SaveButton type="submit" disabled={saving} />
          </Box>
        </AdminFormLayout>
      </div>
      <div className="card shadow border-0 p-3 mt-4">
        <BaseTable
          columns={[{ label: 'Product Weight', field: 'productWeight' }]}
          rows={list}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AdminPageLayout>
  );
};

export default AddProductWeight;

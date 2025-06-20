import { useContext, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import MemoryIcon from '@mui/icons-material/Memory';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import BaseTable from '../../components/common/BaseTable';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import { fetchDataFromApi, postData, editData, deleteData } from '../../utils/api';
import { MyContext } from '../../App';

const AddProductRAMS = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState('');
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef();
  const ctx = useContext(MyContext);

  const load = () => {
    fetchDataFromApi('/api/productRAMS').then((res) => setList(Array.isArray(res) ? res : []));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.trim()) return;
    setSaving(true);
    const payload = { productRam: form.trim() };
    const req = editId ? editData(`/api/productRAMS/${editId}`, payload) : postData('/api/productRAMS/create', payload);
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
    setForm(row.productRam);
    inputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (row) => {
    if (!window.confirm('Delete this item?')) return;
    deleteData(`/api/productRAMS/${row.id}`).then(load);
  };

  return (
    <AdminPageLayout
      title="Product RAMS"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <MemoryIcon fontSize="inherit" />, label: 'RAMS', href: '/productRAMS/add' },
      ]}
    >
      <div className="card shadow border-0 p-3 mt-4">
        <AdminFormLayout onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Product RAM"
                name="productRam"
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
          columns={[{ label: 'Product RAM', field: 'productRam' }]}
          rows={list}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </AdminPageLayout>
  );
};

export default AddProductRAMS;

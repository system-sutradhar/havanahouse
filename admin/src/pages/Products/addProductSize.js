import { useContext, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import StraightenIcon from '@mui/icons-material/Straighten';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import BaseTable from '../../components/common/BaseTable';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import DeleteConfirmDialog from '../../components/common/DeleteConfirmDialog';
import { fetchDataFromApi, postData, editData, deleteData } from '../../utils/api';
import { MyContext } from '../../App';

const AddProductSize = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState('');
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRow, setDeleteRow] = useState(null);
  const inputRef = useRef();
  const ctx = useContext(MyContext);

  const load = () => {
    fetchDataFromApi('/api/productSIZE').then((res) => setList(Array.isArray(res) ? res : []));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.trim()) return;
    setSaving(true);
    const payload = { size: form.trim() };
    const req = editId ? editData(`/api/productSIZE/${editId}`, payload) : postData('/api/productSIZE/create', payload);
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
    setForm(row.size);
    inputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = () => {
    if (!deleteRow) return;
    deleteData(`/api/productSIZE/${deleteRow.id}`).then(() => {
      load();
    }).finally(() => {
      setConfirmOpen(false);
      setDeleteRow(null);
    });
  };

  return (
    <AdminPageLayout
      title="Product Size"
      breadcrumbPath={[
        { icon: <HomeIcon fontSize="inherit" />, label: 'Dashboard', href: '/' },
        { icon: <StraightenIcon fontSize="inherit" />, label: 'Sizes', href: '/productSIZE/add' },
      ]}
    >
      <div className="card shadow border-0 p-3 mt-4">
        <AdminFormLayout onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Product Size"
                name="size"
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
          columns={[{ label: 'Product Size', field: 'size' }]}
          rows={list}
          onEdit={handleEdit}
          onDelete={(row) => { setDeleteRow(row); setConfirmOpen(true); }}
        />
      </div>
      <DeleteConfirmDialog
        open={confirmOpen}
        onCancel={() => { setConfirmOpen(false); setDeleteRow(null); }}
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AddProductSize;

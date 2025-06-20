import { useState, useEffect } from 'react';
import AdminPageLayout from '../../components/common/AdminPageLayout';
import AdminFormLayout from '../../components/common/AdminFormLayout';
import { SaveButton, CancelButton } from '../../components/common/ActionButtons';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import { postData, editData, fetchDataFromApi } from '../../utils/api';
import logger from '../../utils/logger';

const DEFAULT_DATA = {
  name: '',
  value: '',
  prelogin: false,
  postlogin: false,
  desktop: false,
  mobile: false,
};

export default function SettingFormPage({ editId, onCancel, onSuccess }) {
  const [form, setForm] = useState(DEFAULT_DATA);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editId) {
      fetchDataFromApi(`/api/appSettings/${editId}`)
        .then((res) => {
          if (res) {
            setForm({
              name: res.name || '',
              value: res.value || '',
              prelogin: res.prelogin || false,
              postlogin: res.postlogin || false,
              desktop: res.desktop || false,
              mobile: res.mobile || false,
            });
          }
        })
        .catch((err) => logger.error(err));
    } else {
      setForm(DEFAULT_DATA);
    }
  }, [editId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setForm((p) => ({ ...p, [name]: checked }));
  };

  const validate = () => {
    const errs = {};
    const trimmed = form.name.trim();
    if (!trimmed) errs.name = 'Required';
    else if (trimmed.length > 100) errs.name = 'Max 100 characters';
    const val = form.value.trim();
    if (!val) errs.value = 'Required';
    else if (/^[\[{]/.test(val)) {
      try { JSON.parse(val); } catch { errs.value = 'Invalid JSON'; }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const prepareValue = () => {
    const val = form.value.trim();
    if (/^[\[{]/.test(val)) {
      try { return JSON.stringify(JSON.parse(val)); } catch { return val; }
    }
    return val;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      value: prepareValue(),
      prelogin: form.prelogin,
      postlogin: form.postlogin,
      desktop: form.desktop,
      mobile: form.mobile,
    };
    const req = editId
      ? editData(`/api/appSettings/${editId}`, payload)
      : postData('/api/appSettings/create', payload);
    req
      .then(() => { if (onSuccess) onSuccess(); })
      .catch((err) => logger.error(err))
      .finally(() => setSaving(false));
  };

  return (
    <AdminPageLayout
      title={editId ? 'Edit Setting' : 'Add Setting'}
      breadcrumbPath={[
        { icon: <HomeIcon fontSize='inherit' />, label: 'Dashboard', href: '/' },
        { icon: <SettingsIcon fontSize='inherit' />, label: 'App Settings', href: '/appSettings' },
        { label: editId ? 'Edit' : 'Add' },
      ]}
      actions={<CancelButton onClick={onCancel} />}
    >
      <AdminFormLayout onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              name='name'
              value={form.name}
              onChange={handleChange}
              label='Name'
              required
              error={Boolean(errors.name)}
              helperText={errors.name || ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name='value'
              value={form.value}
              onChange={handleChange}
              label='Value'
              multiline
              minRows={3}
              error={Boolean(errors.value)}
              helperText={errors.value || ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormGroup row>
              <FormControlLabel control={<Switch checked={form.prelogin} onChange={handleToggle} name='prelogin' />} label='Prelogin' />
              <FormControlLabel control={<Switch checked={form.postlogin} onChange={handleToggle} name='postlogin' />} label='Postlogin' />
              <FormControlLabel control={<Switch checked={form.desktop} onChange={handleToggle} name='desktop' />} label='Desktop' />
              <FormControlLabel control={<Switch checked={form.mobile} onChange={handleToggle} name='mobile' />} label='Mobile' />
            </FormGroup>
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

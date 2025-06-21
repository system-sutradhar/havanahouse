import React, { useState, useEffect } from 'react';
import BaseModal from '../../common/BaseModal';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { SaveButton, CancelButton } from '../../common/ActionButtons';
import Grid from '@mui/material/Grid';
import FormGroup from '@mui/material/FormGroup';
import AdminFormLayout from '../../common/AdminFormLayout';
import { postData, editData, fetchDataFromApi } from '../../../utils/api';
import logger from '../../../utils/logger';

const DEFAULT_DATA = {
  name: '',
  value: '',
  prelogin: false,
  postlogin: false,
  desktop: false,
  mobile: false,
};

const SettingForm = ({ open, onClose, onSuccess, editId }) => {
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
  }, [editId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const validate = () => {
    const errs = {};
    const trimmed = form.name.trim();
    if (!trimmed) {
      errs.name = 'Required';
    } else if (trimmed.length > 100) {
      errs.name = 'Max 100 characters';
    }

    const val = form.value.trim();
    if (!val) {
      errs.value = 'Required';
    } else if (/^[\[{]/.test(val)) {
      try {
        JSON.parse(val);
      } catch {
        errs.value = 'Invalid JSON';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const prepareValue = () => {
    const val = form.value.trim();
    if (/^[\[{]/.test(val)) {
      try {
        const parsed = JSON.parse(val);
        return JSON.stringify(parsed);
      } catch {
        return val;
      }
    }
    return val;
  };

  const handleSubmit = () => {
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
      .then(() => {
        if (onSuccess) onSuccess();
      })
      .catch((err) => logger.error(err))
      .finally(() => {
        setSaving(false);
      });
  };

  const handleCancel = () => {
    if (form !== DEFAULT_DATA && editId == null) {
      if (!window.confirm('Discard changes?')) return;
    }
    if (onClose) onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={handleCancel}
      title={editId ? 'Edit Setting' : 'Add Setting'}
      actions={
        <>
          <CancelButton onClick={handleCancel} disabled={saving} />
          <SaveButton onClick={handleSubmit} disabled={saving} />
        </>
      }
    >
      <AdminFormLayout>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              name="name"
              value={form.name}
              onChange={handleChange}
              label="Name"
              required
              error={Boolean(errors.name)}
              helperText={errors.name || ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="value"
              value={form.value}
              onChange={handleChange}
              label="Value"
              multiline
              minRows={3}
              error={Boolean(errors.value)}
              helperText={errors.value || ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormGroup row>
              <FormControlLabel
                control={<Switch checked={form.prelogin} onChange={handleToggle} name="prelogin" />}
                label="Prelogin"
              />
              <FormControlLabel
                control={<Switch checked={form.postlogin} onChange={handleToggle} name="postlogin" />}
                label="Postlogin"
              />
              <FormControlLabel
                control={<Switch checked={form.desktop} onChange={handleToggle} name="desktop" />}
                label="Desktop"
              />
              <FormControlLabel
                control={<Switch checked={form.mobile} onChange={handleToggle} name="mobile" />}
                label="Mobile"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </AdminFormLayout>
    </BaseModal>
  );
};

export default SettingForm;

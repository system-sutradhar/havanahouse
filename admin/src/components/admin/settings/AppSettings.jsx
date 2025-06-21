import React, { useEffect, useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { AddButton } from '../../common/ActionButtons';
import DeleteConfirmDialog from '../../common/DeleteConfirmDialog';
import AdminPageLayout from '../../common/AdminPageLayout';
import BaseTable from '../../common/BaseTable';
import { MdDelete, MdEdit } from 'react-icons/md';
import SettingForm from './SettingForm';
import SettingFormPage from '../../../pages/AppSettings/SettingFormPage';
import { fetchDataFromApi, deleteData } from '../../../utils/api';
import { MyContext } from '../../../App';
import logger from '../../../utils/logger';

const AppSettings = () => {
  const [list, setList] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const ctx = useContext(MyContext);

  const loadData = () => {
    fetchDataFromApi('/api/appSettings')
      .then((res) => Array.isArray(res) && setList(res))
      .catch((err) => {
        logger.error(err);
        ctx.setAlertBox({ open: true, error: true, msg: 'Failed to load' });
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteData(`/api/appSettings/${deleteId}`)
      .then(() => {
        ctx.setAlertBox({ open: true, error: false, msg: 'Deleted!' });
        loadData();
      })
      .catch((err) => logger.error(err))
      .finally(() => {
        setConfirmOpen(false);
        setDeleteId(null);
      });
  };

  const handleSuccess = () => {
    ctx.setAlertBox({ open: true, error: false, msg: 'Saved!' });
    setOpenForm(false);
    setEditId(null);
    loadData();
  };

  if (openForm) {
    return (
      <SettingFormPage
        editId={editId}
        onCancel={() => { setOpenForm(false); setEditId(null); }}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <AdminPageLayout
      title="App Settings"
      breadcrumbPath={[{ label: 'Dashboard', href: '/' }]}
      actions={<AddButton onClick={() => setOpenForm(true)} label="Add Setting" />}
    >
      <Paper className="card shadow border-0 p-3">
        <BaseTable
          columns={[
            { label: 'Name', field: 'name' },
            {
              label: 'Value',
              field: 'value',
              render: (row) => (
                <Tooltip title={row.value || ''}>
                  <span>{row.value && row.value.length > 60 ? `${row.value.slice(0, 60)}...` : row.value}</span>
                </Tooltip>
              ),
            },
            { label: 'Prelogin', field: 'prelogin', render: (row) => (row.prelogin ? 'Yes' : 'No') },
            { label: 'Postlogin', field: 'postlogin', render: (row) => (row.postlogin ? 'Yes' : 'No') },
            { label: 'Desktop', field: 'desktop', render: (row) => (row.desktop ? 'Yes' : 'No') },
            { label: 'Mobile', field: 'mobile', render: (row) => (row.mobile ? 'Yes' : 'No') },
          ]}
          rows={list}
          onEdit={(row) => { setEditId(row.id); setOpenForm(true); }}
          onDelete={(row) => { setDeleteId(row.id); setConfirmOpen(true); }}
        />
      </Paper>
      <DeleteConfirmDialog
        open={confirmOpen}
        onCancel={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={handleDelete}
      />
    </AdminPageLayout>
  );
};

export default AppSettings;

import React, { useEffect, useState, useContext } from 'react';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { AddButton } from '../../common/ActionButtons';
import BaseTable from '../../common/BaseTable';
import { MdDelete, MdEdit } from 'react-icons/md';
import SettingForm from './SettingForm';
import { fetchDataFromApi, deleteData } from '../../../utils/api';
import { MyContext } from '../../../App';
import logger from '../../../utils/logger';

const AppSettings = () => {
  const [list, setList] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState(null);
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

  const handleDelete = (id) => {
    if (!window.confirm('Delete this setting?')) return;
    deleteData(`/api/appSettings/${id}`)
      .then(() => {
        ctx.setAlertBox({ open: true, error: false, msg: 'Deleted!' });
        loadData();
      })
      .catch((err) => logger.error(err));
  };

  const handleSuccess = () => {
    ctx.setAlertBox({ open: true, error: false, msg: 'Saved!' });
    setOpenForm(false);
    setEditId(null);
    loadData();
  };

  return (
    <Container className="right-content" maxWidth={false}>
      <Box className="card shadow border-0 w-100 p-4" mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <h5 className="mb-0">App Settings</h5>
        <AddButton onClick={() => setOpenForm(true)} label="Add Setting" />
      </Box>
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
          onDelete={(row) => handleDelete(row.id)}
        />
      </Paper>
      {openForm && (
        <SettingForm
          open={openForm}
          onClose={() => { setOpenForm(false); setEditId(null); }}
          onSuccess={handleSuccess}
          editId={editId}
        />
      )}
    </Container>
  );
};

export default AppSettings;

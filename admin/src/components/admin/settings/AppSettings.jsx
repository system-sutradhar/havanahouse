import React, { useEffect, useState, useContext } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
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
        <Button variant="contained" className="btn-blue" onClick={() => setOpenForm(true)}>
          Add Setting
        </Button>
      </Box>
      <Paper className="card shadow border-0 p-3">
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Prelogin</TableCell>
                <TableCell>Postlogin</TableCell>
                <TableCell>Desktop</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Tooltip title={item.value || ''}>
                      <span>{item.value && item.value.length > 60 ? `${item.value.slice(0, 60)}...` : item.value}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{item.prelogin ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{item.postlogin ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{item.desktop ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{item.mobile ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => { setEditId(item.id); setOpenForm(true); }} aria-label="Edit">
                        <MdEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(item.id)} aria-label="Delete" color="error">
                        <MdDelete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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

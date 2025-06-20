import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TableContainer,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function BaseTable({ columns = [], rows = [], onEdit, onDelete }) {
  return (
    <TableContainer>
      <Table
        size="small"
        sx={{
          '& thead th': {
            backgroundColor: 'var(--table-header-bg)',
            color: 'var(--text-color)',
            fontWeight: 'bold',
          },
          '& tbody tr:hover': {
            backgroundColor: 'var(--table-row-bg)',
          },
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell key={idx}>{col.label}</TableCell>
            ))}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={row.id || idx} hover>
              {columns.map((col) => (
                <TableCell key={col.field || col.label}>
                  {typeof col.render === 'function' ? col.render(row) : row[col.field]}
                </TableCell>
              ))}
              <TableCell align="right">
                {onEdit && (
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(row)} size="small">
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip title="Delete">
                    <IconButton onClick={() => onDelete(row)} size="small">
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

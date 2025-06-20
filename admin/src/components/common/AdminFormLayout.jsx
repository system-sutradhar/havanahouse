import { Box, Paper } from '@mui/material';

export default function AdminFormLayout({ children, ...props }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box component="form" autoComplete="off" {...props}>
        {children}
      </Box>
    </Paper>
  );
}

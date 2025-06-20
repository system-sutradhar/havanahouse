import { Box, Paper, useTheme } from '@mui/material';

export default function AdminFormLayout({ children, ...props }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : '#fff',
      }}
    >
      <Box component="form" autoComplete="off" {...props}>
        {children}
      </Box>
    </Paper>
  );
}

import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const toCamel = (str = '') =>
  str
    .split(' ') 
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');

const AppBreadcrumbs = ({ title, path = [] }) => (
  <Breadcrumbs separator="›" aria-label="breadcrumb" className="breadcrumbs_">
    {path.map((item, idx) => {
      const obj = typeof item === 'string' ? { label: item } : item;
      const label = obj.label;
      const href = obj.href || `/${toCamel(label)}`;
      return (
        <Link underline="hover" color="inherit" href={href} key={idx}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {obj.icon}
            <span>{label}</span>
          </Stack>
        </Link>
      );
    })}
    <Typography color="text.primary">{title}</Typography>
  </Breadcrumbs>
);

export default AppBreadcrumbs;

import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const toCamel = (str = '') =>
  str
    .split(' ') 
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('');

const AppBreadcrumbs = ({ title, path = [] }) => (
  <Breadcrumbs separator="›" aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    {path.map((item, idx) => {
      const label = typeof item === 'string' ? item : item.label;
      const href = typeof item === 'string' ? `/${toCamel(item)}` : item.href || '#';
      return (
        <Link underline="hover" color="inherit" href={href} key={idx}>
          {label}
        </Link>
      );
    })}
    <Typography color="text.primary">{title}</Typography>
  </Breadcrumbs>
);

export default AppBreadcrumbs;

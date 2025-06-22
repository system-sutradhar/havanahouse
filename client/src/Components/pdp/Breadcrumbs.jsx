"use client";
import Link from 'next/link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';

const BreadcrumbNav = ({ items = [] }) => {
  return (
    <nav aria-label="breadcrumb" className="product-breadcrumbs">
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        {items.map((item, idx) => (
          item.href ? (
            <Link key={idx} href={item.href}>{item.label}</Link>
          ) : (
            <Typography key={idx} color="text.primary">{item.label}</Typography>
          )
        ))}
      </Breadcrumbs>
    </nav>
  );
};

export default BreadcrumbNav;

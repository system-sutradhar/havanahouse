import React from 'react';
import Link from 'next/link';
import './Breadcrumbs.css';

// We use static data for now as requested
const Breadcrumbs = ({ product }) => {
  const category = "Cuban Cigars"; // Static example
  const categoryLink = "/category/cuban-cigars"; // Static example

  return (
    <nav className="breadcrumbs">
      <Link href="/">Home</Link>
      <span className="separator">/</span>
      <Link href={categoryLink}>{category}</Link>
      <span className="separator">/</span>
      <span className="current">{product.name}</span>
    </nav>
  );
};

export default Breadcrumbs;
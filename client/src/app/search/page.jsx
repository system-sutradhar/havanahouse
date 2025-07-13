'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FaTh, FaThLarge, FaBars } from 'react-icons/fa';

// Your own custom API utility
import { fetchDataFromApi } from '@/utils/api';

import ProductCard from '@/Components/ProductCard';
import FilterSidebar from '@/Components/FilterSidebar';
import PLPSkeleton from '@/Components/PLPSkeleton';
import './SearchPage.css';

const PER_PAGE = 20;

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gridColumns, setGridColumns] = useState(3);

  const fetchData = (pageNum = 1) => {
    if (!query) {
      setProducts([]);
      setHasMore(false);
      setLoading(false);
      return;
    }
    
    if (pageNum === 1) setLoading(true);

    fetchDataFromApi(`/api/search?q=${query}&page=${pageNum}&perPage=${PER_PAGE}`)
      .then(res => {
        // --- THIS IS THE FIX ---
        // We now correctly access the data directly from the 'res' object.
        const newProducts = res.products || [];
        setProducts(prev => pageNum === 1 ? newProducts : [...prev, ...newProducts]);
        setTotalProducts(res.totalProducts || 0);
        setHasMore((pageNum * PER_PAGE) < (res.totalProducts || 0));
        setPage(pageNum + 1);
      })
      .catch(err => {
        console.error("Search fetch failed:", err);
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Effect to fetch initial data when the search query changes
  useEffect(() => {
    fetchData(1);
  }, [query]);

  if (loading && page === 1) {
    return <PLPSkeleton />;
  }

  return (
    <div className="search-page-wrapper">
      <div className="search-page-container">
        <div className="results-header">
          <h1>Search Results</h1>
          {!loading && query && <p>Showing {totalProducts} results for "<strong>{query}</strong>"</p>}
        </div>
        
        <div className="plp-layout-grid">
          <div className="product-grid-container">
            <div className="controls-bar">
              <div className="product-count">{totalProducts} Products</div>
              <div className="layout-switcher">
                <button onClick={() => setGridColumns(4)} className={gridColumns === 4 ? 'active' : ''}><FaTh/></button>
                <button onClick={() => setGridColumns(3)} className={gridColumns === 3 ? 'active' : ''}><FaThLarge/></button>
                <button onClick={() => setGridColumns(1)} className={gridColumns === 1 ? 'active' : ''}><FaBars/></button>
              </div>
            </div>

            <InfiniteScroll
              dataLength={products.length}
              // --- FIX FOR INFINITE SCROLL ---
              // The 'next' prop now correctly calls fetchData with the next page number
              next={() => fetchData(page)}
              hasMore={hasMore}
              loader={<h4 className="scroll-loader">Loading More...</h4>}
              endMessage={
                <p className="scroll-end-message">
                  <b>You've seen all available results.</b>
                </p>
              }
              className="product-grid-infinite"
              style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
            >
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </InfiniteScroll>
          </div>
          <FilterSidebar />
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => (
    <Suspense fallback={<PLPSkeleton />}>
        <SearchResults />
    </Suspense>
);

export default SearchPage;
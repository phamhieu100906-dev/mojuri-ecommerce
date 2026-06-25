import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';

const API_BASE = 'http://localhost:3000/api';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const category = searchParams.get('category') || 'All';
  const searchInput = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchField, setSearchField] = useState(searchInput);
  const [minPriceField, setMinPriceField] = useState(minPrice);
  const [maxPriceField, setMaxPriceField] = useState(maxPrice);

  useEffect(() => {
    setSearchField(searchInput);
    setMinPriceField(minPrice);
    setMaxPriceField(maxPrice);
  }, [searchInput, minPrice, maxPrice]);

  const fetchShopProducts = async () => {
    let url = `${API_BASE}/products?page=${page}&limit=9`;
    if (category !== 'All') url += `&category=${category}`;
    if (searchInput) url += `&search=${encodeURIComponent(searchInput)}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (sort) url += `&sort=${sort}`;

    const { data } = await axios.get(url);
    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['shopProducts', category, searchInput, minPrice, maxPrice, sort, page],
    queryFn: fetchShopProducts,
  });

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    
    if (searchField) newParams.set('search', searchField);
    else newParams.delete('search');

    if (minPriceField) newParams.set('minPrice', minPriceField);
    else newParams.delete('minPrice');

    if (maxPriceField) newParams.set('maxPrice', maxPriceField);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchField('');
    setMinPriceField('');
    setMaxPriceField('');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        <div id="primary" className="content-area">
          
          {/* Breadcrumbs Banner */}
          <div id="title" className="page-title" style={{ backgroundImage: "url('/media/site-header.jpg')" }}>
            <div className="section-container">
              <div className="content-title-heading">
                <h1 className="text-title-heading">
                  {category === 'All' ? 'Shop' : category}
                </h1>
              </div>
              <div className="breadcrumbs">
                <Link to="/">Home</Link>
                <span className="delimiter"></span>
                <Link to="/shop">Shop</Link>
                {category !== 'All' && (
                  <>
                    <span className="delimiter"></span>
                    {category}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Shop Main Layout */}
          <div id="content" className="site-content" role="main">
            <div className="section-padding">
              <div className="section-container p-l-r">
                <div className="row">
                  
                  {/* Left Sidebar Filters */}
                  <div className="col-xl-3 col-lg-3 col-md-12 col-12 sidebar left-sidebar md-b-50 p-t-10">
                    
                    {/* Category Filter */}
                    <div className="block block-product-cats">
                      <div className="block-title"><h2>Categories</h2></div>
                      <div className="block-content">
                        <div className="product-cats-list">
                          <ul>
                            {['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((cat) => (
                              <li key={cat} className={category === cat ? 'current' : ''}>
                                <Link 
                                  to="#" 
                                  onClick={(e) => { e.preventDefault(); updateFilters('category', cat); }}
                                >
                                  {cat === 'All' ? 'All Categories' : cat}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Price Filter form */}
                    <div className="block block-product-filter">
                      <div className="block-title"><h2>Filter by Price</h2></div>
                      <div className="block-content">
                        <form onSubmit={handleApplyFilters}>
                          <div className="mb-3">
                            <input 
                              type="number" 
                              value={minPriceField} 
                              onChange={(e) => setMinPriceField(e.target.value)} 
                              placeholder="Min price ($)" 
                              className="form-control"
                              style={{ border: '1px solid #eee', padding: '8px 12px', fontSize: '13px', borderRadius: 0 }}
                            />
                          </div>
                          <div className="mb-3">
                            <input 
                              type="number" 
                              value={maxPriceField} 
                              onChange={(e) => setMaxPriceField(e.target.value)} 
                              placeholder="Max price ($)" 
                              className="form-control"
                              style={{ border: '1px solid #eee', padding: '8px 12px', fontSize: '13px', borderRadius: 0 }}
                            />
                          </div>
                          <div className="d-flex gap-2">
                            <button type="submit" className="button btn-primary btn-sm flex-grow-1" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 0', border: 'none' }}>
                              Filter
                            </button>
                            <button type="button" onClick={handleClearFilters} className="button btn-default btn-sm flex-grow-1" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 0' }}>
                              Clear
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Search Field inside Sidebar */}
                    <div className="block block-product-filter">
                      <div className="block-title"><h2>Search Product</h2></div>
                      <div className="block-content">
                        <form onSubmit={handleApplyFilters}>
                          <input 
                            type="text" 
                            value={searchField} 
                            onChange={(e) => setSearchField(e.target.value)} 
                            placeholder="Search name..." 
                            className="form-control"
                            style={{ border: '1px solid #eee', padding: '8px 12px', fontSize: '13px', borderRadius: 0, marginBottom: '10px' }}
                          />
                          <button type="submit" className="button btn-primary btn-sm w-100" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 0', border: 'none' }}>
                            Search
                          </button>
                        </form>
                      </div>
                    </div>

                  </div>

                  {/* Products Grid & Toolbar */}
                  <div className="col-xl-9 col-lg-9 col-md-12 col-12">
                    
                    <div className="products-topbar clearfix">
                      <div className="products-topbar-left">
                        <div className="products-count">
                          {data ? `Showing ${((page - 1) * 9) + 1}–${Math.min(page * 9, data.total)} of ${data.total} results` : 'Loading...'}
                        </div>
                      </div>
                      
                      <div className="products-topbar-right">
                        <div className="products-sort dropdown">
                          <select 
                            value={sort} 
                            onChange={(e) => updateFilters('sort', e.target.value)} 
                            className="form-select form-control"
                            style={{ border: '1px solid #eee', padding: '8px 15px', minWidth: '180px', fontSize: '13px', borderRadius: 0, height: 'auto', background: '#fff', cursor: 'pointer' }}
                          >
                            <option value="newest">Sort by latest</option>
                            <option value="price-asc">Sort by price: low to high</option>
                            <option value="price-desc">Sort by price: high to low</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Products list panel */}
                    <div className="tab-content">
                      <div className="tab-pane fade show active" id="layout-grid" role="tabpanel">
                        <div className="products-list grid">
                          
                          {isLoading ? (
                            <div className="text-center py-5">
                              <div className="spinner-border text-dark" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                            </div>
                          ) : data && data.products.length === 0 ? (
                            <div className="text-center py-5" style={{ background: '#fafafa', borderRadius: '4px' }}>
                              <p style={{ color: '#777', margin: 0 }}>No products match your filters.</p>
                            </div>
                          ) : (
                            <>
                              <div className="row">
                                {data && data.products.map((product) => (
                                  <ProductCard key={product.id} product={product} />
                                ))}
                              </div>

                              {/* Template style pagination */}
                              {data && data.pages > 1 && (
                                <nav className="pagination">
                                  <ul className="page-numbers">
                                    {page > 1 && (
                                      <li>
                                        <Link 
                                          className="prev page-numbers" 
                                          to="#" 
                                          onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                                        >
                                          Prev
                                        </Link>
                                      </li>
                                    )}
                                    {[...Array(data.pages)].map((_, i) => (
                                      <li key={i}>
                                        {page === i + 1 ? (
                                          <span className="page-numbers current">{i + 1}</span>
                                        ) : (
                                          <Link 
                                            className="page-numbers" 
                                            to="#" 
                                            onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                                          >
                                            {i + 1}
                                          </Link>
                                        )}
                                      </li>
                                    ))}
                                    {page < data.pages && (
                                      <li>
                                        <Link 
                                          className="next page-numbers" 
                                          to="#" 
                                          onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
                                        >
                                          Next
                                        </Link>
                                      </li>
                                    )}
                                  </ul>
                                </nav>
                              )}
                            </>
                          )}

                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

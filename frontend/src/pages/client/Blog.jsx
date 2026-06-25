import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = '/api';

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All';

  const fetchBlogs = async () => {
    let url = `${API_BASE}/blogs`;
    if (category !== 'All') {
      url += `?category=${category}`;
    }
    const { data } = await axios.get(url);
    return data;
  };

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogsList', category],
    queryFn: fetchBlogs,
  });

  const handleCategoryChange = (cat, e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        
        {/* Title Banner */}
        <div id="title" className="page-title" style={{ backgroundImage: "url('/media/site-header.jpg')" }}>
          <div className="section-container">
            <div className="content-title-heading">
              <h1 className="text-title-heading">Blog Grid</h1>
            </div>
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
              <span className="delimiter"></span>
              Blog Grid
            </div>
          </div>
        </div>

        {/* Content area */}
        <div id="content" className="site-content" role="main">
          <div className="section-padding">
            <div className="section-container p-l-r">
              <div className="row">
                
                {/* Left Sidebar Categories */}
                <div className="col-xl-3 col-lg-3 col-md-12 col-12 sidebar left-sidebar md-b-50">
                  <div className="block block-post-cats">
                    <div className="block-title"><h2>Categories</h2></div>
                    <div className="block-content">
                      <div className="post-cats-list">
                        <ul>
                          {['All', 'Tips', 'Collections', 'News'].map((cat) => (
                            <li key={cat} className={category === cat ? 'active' : ''}>
                              <Link 
                                to="#" 
                                onClick={(e) => handleCategoryChange(cat, e)}
                              >
                                {cat === 'All' ? 'All Articles' : cat}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Articles list */}
                <div className="col-xl-9 col-lg-9 col-md-12 col-12">
                  <div className="posts-list grid">
                    
                    {isLoading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-dark" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : blogs && blogs.length === 0 ? (
                      <div className="text-center py-5" style={{ background: '#fafafa', borderRadius: '4px' }}>
                        <p style={{ color: '#777', margin: 0 }}>No articles found in this category.</p>
                      </div>
                    ) : (
                      <div className="row">
                        {blogs && blogs.map((blog) => (
                          <div key={blog.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
                            <div className="post-entry transition-product" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                              
                              <div className="post-image" style={{ height: '220px', overflow: 'hidden' }}>
                                <Link to={`/blog/${blog.id}`}>
                                  <img 
                                    src={`/${blog.coverImage}`} 
                                    alt={blog.title} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/blog/1.jpg"} 
                                  />
                                </Link>
                              </div>

                              <div className="post-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                                <div>
                                  <div className="post-categories">
                                    <Link to={`/blog?category=${blog.category}`}>{blog.category}</Link>
                                  </div>
                                  
                                  <h2 className="post-title" style={{ fontSize: '16px', fontWeight: 'bold', minHeight: '44px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                                  </h2>
                                </div>

                                <div>
                                  <div className="post-meta" style={{ fontSize: '11px', color: '#888', marginBottom: '15px' }}>
                                    <span className="post-date">
                                      {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                  </div>

                                  <div className="post-button">
                                    <Link className="button" to={`/blog/${blog.id}`}>Read more</Link>
                                  </div>
                                </div>

                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    )}

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

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export default function BlogDetail() {
  const { id } = useParams();

  const fetchBlogDetail = async () => {
    const { data } = await axios.get(`${API_BASE}/blogs/${id}`);
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogDetail', id],
    queryFn: fetchBlogDetail,
  });

  if (isLoading) {
    return (
      <div id="site-main" className="site-main">
        <div id="main-content" className="main-content">
          <div className="container py-5 text-center">
            <div className="spinner-border text-dark" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div id="site-main" className="site-main">
        <div id="main-content" className="main-content">
          <div className="container py-5 text-center">
            <h2>Article not found.</h2>
            <Link to="/blog" className="button btn-primary mt-3">Back to blog</Link>
          </div>
        </div>
      </div>
    );
  }

  const { blog, recent } = data;

  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        
        {/* Title banner */}
        <div id="title" className="page-title" style={{ backgroundImage: "url('/media/site-header.jpg')" }}>
          <div className="section-container">
            <div className="content-title-heading">
              <h1 className="text-title-heading">Blog Details</h1>
            </div>
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
              <span className="delimiter"></span>
              <Link to="/blog">Blog</Link>
              <span className="delimiter"></span>
              {blog.title}
            </div>
          </div>
        </div>

        {/* Content details */}
        <div id="content" className="site-content" role="main">
          <div className="section-padding">
            <div className="section-container p-l-r">
              <div className="row">
                
                {/* Main article content column */}
                <div className="col-xl-9 col-lg-9 col-md-12 col-12 m-b-md-80">
                  <div className="post-details accent-style">
                    <div className="post-entry">
                      
                      <div className="post-image mb-4" style={{ overflow: 'hidden' }}>
                        <img 
                          src={`/${blog.coverImage}`} 
                          alt={blog.title} 
                          style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'cover' }} 
                          onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/blog/1.jpg"} 
                        />
                      </div>

                      <div className="post-content">
                        
                        <div className="post-categories">
                          <Link to={`/blog?category=${blog.category}`}>{blog.category}</Link>
                        </div>
                        
                        <h2 className="post-title" style={{ fontSize: '28px', fontWeight: 'bold', lineHeight: '1.3', color: '#111' }}>
                          {blog.title}
                        </h2>

                        <div className="post-meta" style={{ fontSize: '11px', color: '#888', marginBottom: '20px' }}>
                          <span className="post-date">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>

                        <div 
                          className="post-description" 
                          style={{ fontSize: '14px', lineHeight: '1.8', color: '#444' }}
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                      </div>

                    </div>
                  </div>
                </div>

                {/* Right Sidebar columns */}
                <div className="col-xl-3 col-lg-3 col-md-12 col-12 sidebar right-sidebar">
                  
                  {/* Recent Posts widget */}
                  <div className="block block-posts recent-posts p-t-5">
                    <div className="block-title"><h2>Recent Posts</h2></div>
                    <div className="block-content">
                      
                      {recent && recent.length === 0 ? (
                        <p className="text-muted" style={{ fontSize: '12px' }}>No other articles available.</p>
                      ) : (
                        <ul className="posts-list">
                          {recent.map((rec) => (
                            <li key={rec.id} className="post-item">
                              <Link to={`/blog/${rec.id}`} className="post-image" style={{ width: '80px', height: '60px', overflow: 'hidden' }}>
                                <img 
                                  src={`/${rec.coverImage}`} 
                                  alt="" 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                  onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/blog/1.jpg"} 
                                />
                              </Link>
                              <div className="post-content">
                                <h2 className="post-title" style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '1.4' }}>
                                  <Link to={`/blog/${rec.id}`}>{rec.title}</Link>
                                </h2>
                                <div className="post-time" style={{ fontSize: '10px' }}>
                                  <span className="post-date">
                                    {new Date(rec.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
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
  );
}

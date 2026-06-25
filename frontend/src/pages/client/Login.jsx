import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = '/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, formData);
      login(data.user, data.token);
      
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        
        {/* Title banner */}
        <div id="title" className="page-title">
          <div className="section-container">
            <div className="content-title-heading">
              <h1 className="text-title-heading">My Account</h1>
            </div>
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
              <span className="delimiter"></span>
              Login
            </div>
          </div>
        </div>

        {/* Form content */}
        <div id="content" className="site-content" role="main">
          <div className="section-padding">
            <div className="section-container small">
              <div className="page-login-register">
                <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-8 col-sm-12 col-12 s-column form-login">
                    <h2>Sign in</h2>
                    
                    {error && (
                      <div className="alert alert-danger" style={{ fontSize: '13px', borderRadius: 0, padding: '10px 15px' }}>
                        {error}
                      </div>
                    )}

                    <form className="login" onSubmit={handleSubmit}>
                      <div className="content">
                        
                        <div className="username">
                          <input 
                            type="email" 
                            required 
                            className="input-text" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email address *" 
                          />
                        </div>
                        
                        <div className="password">
                          <input 
                            type="password" 
                            required 
                            className="input-text" 
                            name="password" 
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password *" 
                          />
                        </div>

                        <div className="rememberme-lost">
                          <div className="rememberme">
                            <input name="rememberme" type="checkbox" id="rememberme" value="forever" />
                            <label htmlFor="rememberme" className="inline" style={{ marginLeft: '5px' }}>Remember me</label>
                          </div>
                        </div>

                        <div className="button-login">
                          <input 
                            type="submit" 
                            className="button" 
                            value={loading ? "Signing in..." : "Login"} 
                            disabled={loading} 
                          />
                        </div>

                        <div className="button-next-reregister" style={{ marginTop: '20px', textAlign: 'center' }}>
                          <Link to="/register" style={{ color: '#e0a96d', fontWeight: 'bold' }}>Create An Account</Link>
                        </div>

                      </div>
                    </form>
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

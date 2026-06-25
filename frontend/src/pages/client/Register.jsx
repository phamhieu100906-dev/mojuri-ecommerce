import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = 'http://localhost:3000/api';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
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
    if (formData.password !== formData.confirmPassword) {
      setError('Confirm password does not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${API_BASE}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your inputs.');
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
              Register
            </div>
          </div>
        </div>

        {/* Form content */}
        <div id="content" className="site-content" role="main">
          <div className="section-padding">
            <div className="section-container small">
              <div className="page-login-register">
                <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-8 col-sm-12 col-12 s-column form-register">
                    <h2>Register</h2>
                    
                    {error && (
                      <div className="alert alert-danger" style={{ fontSize: '13px', borderRadius: 0, padding: '10px 15px' }}>
                        {error}
                      </div>
                    )}

                    <form className="register" onSubmit={handleSubmit}>
                      <div className="content">
                        
                        <div className="email">
                          <input 
                            type="text" 
                            required 
                            className="input-text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange}
                            placeholder="Full name *" 
                          />
                        </div>

                        <div className="email">
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

                        <div className="password">
                          <input 
                            type="password" 
                            required 
                            className="input-text" 
                            name="confirmPassword" 
                            value={formData.confirmPassword} 
                            onChange={handleChange}
                            placeholder="Confirm password *" 
                          />
                        </div>

                        <div className="email">
                          <input 
                            type="tel" 
                            className="input-text" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange}
                            placeholder="Phone number" 
                          />
                        </div>

                        <div className="email">
                          <textarea 
                            className="input-text" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange}
                            placeholder="Shipping address" 
                            rows="2"
                            style={{ height: 'auto', padding: '12px 20px' }}
                          />
                        </div>

                        <div className="button-register">
                          <input 
                            type="submit" 
                            className="button" 
                            value={loading ? "Registering..." : "Register"} 
                            disabled={loading} 
                          />
                        </div>

                        <div className="button-next-login" style={{ marginTop: '20px', textAlign: 'center' }}>
                          <Link to="/login" style={{ color: '#e0a96d', fontWeight: 'bold' }}>Already have an account? Sign in</Link>
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

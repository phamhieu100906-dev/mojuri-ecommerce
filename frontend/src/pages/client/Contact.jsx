import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await axios.post(`${API_BASE}/contacts`, formData);
      alert('Your message was sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred while sending message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        
        {/* Title banner */}
        <div id="title" className="page-title" style={{ backgroundImage: "url('/media/site-header.jpg')" }}>
          <div className="section-container">
            <div className="content-title-heading">
              <h1 className="text-title-heading">Contact Us</h1>
            </div>
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
              <span className="delimiter"></span>
              Contact Us
            </div>
          </div>
        </div>

        {/* Contact Page Contents */}
        <div id="content" className="site-content" role="main">
          <div className="page-contact">
            
            {/* Map Section */}
            <section className="section section-padding">
              <div className="section-container small">
                <div className="block block-contact-map">
                  <div className="block-widget-wrap">
                    <iframe 
                      src="https://maps.google.com/maps?q=Hanoi%20Vietnam&amp;t=m&amp;z=13&amp;output=embed&amp;iwloc=near" 
                      aria-label="Cầu Giấy, Hà Nội, Việt Nam"
                      style={{ border: 0 }}
                      title="Mojuri Shop Location Map"
                    ></iframe>
                  </div>
                </div>
              </div>
            </section>

            {/* Help & Details Section */}
            <section className="section section-padding m-b-70">
              <div className="section-container">
                <div className="block block-contact-info">
                  <div className="block-widget-wrap">
                    <div className="info-icon">
                      <i className="icon-large-paper-bag" style={{ fontSize: '48px', color: '#e0a96d' }}></i>
                    </div>
                    <div className="info-title">
                      <h2>Need Help?</h2>
                    </div>
                    <div className="info-items">
                      <div className="row">
                        
                        <div className="col-md-4 sm-m-b-30">
                          <div className="info-item">
                            <div className="item-tilte">
                              <h2>Phone Contact</h2>
                            </div>
                            <div className="item-content" style={{ fontSize: '13px', color: '#666' }}>
                              0987 654 321
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 sm-m-b-30">
                          <div className="info-item">
                            <div className="item-tilte">
                              <h2>Customer Service</h2>
                            </div>
                            <div className="item-content" style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                              <p>Monday to Sunday</p>
                              <p>8:30am – 9:30pm Hanoi, VN time</p>
                              <p>Online support 24/7</p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="info-item">
                            <div className="item-tilte">
                              <h2>Returns & Care</h2>
                            </div>
                            <div className="item-content small-width" style={{ fontSize: '13px', color: '#666', lineHeight: '1.6' }}>
                              For details regarding product repairs, maintenance services, and returns guidelines, please send a message using the form below or contact our hotline directly.
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Email form Section */}
            <section className="section section-padding background-img bg-img-7 p-t-70 p-b-70 m-b-0" style={{ backgroundAttachment: 'fixed', backgroundImage: "url('/media/banner/bg-img-7.jpg')" }}>
              <div className="section-container small">
                <div className="block block-contact-form">
                  <div className="block-widget-wrap">
                    <div className="block-title">
                      <h2>Send Us Your Questions!</h2>
                      <div className="sub-title">We’ll get back to you within two business days.</div>
                    </div>
                    <div className="block-content">
                      <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="contact-us-form">
                          
                          <div className="row">
                            <div className="col-sm-12 col-md-6 mb-3 mb-md-0">
                              <label className="required">Name</label><br />
                              <span className="form-control-wrap">
                                <input 
                                  type="text" 
                                  name="name" 
                                  value={formData.name} 
                                  onChange={handleChange} 
                                  className="form-control" 
                                  required 
                                />
                              </span>
                            </div>
                            <div className="col-sm-12 col-md-6">
                              <label className="required">Email</label><br />
                              <span className="form-control-wrap">
                                <input 
                                  type="email" 
                                  name="email" 
                                  value={formData.email} 
                                  onChange={handleChange} 
                                  className="form-control" 
                                  required 
                                />
                              </span>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div className="col-sm-12">
                              <label className="required">Subject</label><br />
                              <span className="form-control-wrap">
                                <input 
                                  type="text" 
                                  name="subject" 
                                  value={formData.subject} 
                                  onChange={handleChange} 
                                  className="form-control" 
                                  required 
                                />
                              </span>
                            </div>
                          </div>

                          <div className="row mt-3">
                            <div className="col-sm-12">
                              <label className="required">Message</label><br />
                              <span className="form-control-wrap">
                                <textarea 
                                  name="message" 
                                  cols="40" 
                                  rows="8" 
                                  className="form-control" 
                                  value={formData.message} 
                                  onChange={handleChange} 
                                  required
                                ></textarea>
                              </span>
                            </div>
                          </div>

                          <div className="form-button mt-4">
                            <input 
                              type="submit" 
                              value={sending ? 'Sending...' : 'Submit'} 
                              className="button" 
                              disabled={sending} 
                            />
                          </div>

                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}

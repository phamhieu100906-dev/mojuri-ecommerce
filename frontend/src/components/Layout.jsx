import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1500); // Show popup after 1.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing! Your discount code is: MOJURI10. Use it at checkout to get 10% off!');
    closePopup();
  };

  return (
    <div id="page" className="hfeed page-wrapper">
      <Header />
      <main style={{ minHeight: '60vh' }}>{children}</main>
      <Footer />

      {/* Newsletter Popup */}
      {showPopup && (
        <>
          <div 
            className="popup-shadow" 
            style={{ display: 'block', opacity: 1, visibility: 'visible', zIndex: 99999 }} 
            onClick={closePopup}
          ></div>
          <div 
            className="newsletter-popup show" 
            style={{ display: 'block', opacity: 1, visibility: 'visible', zIndex: 100000 }}
          >
            <button 
              className="newsletter-close" 
              style={{ border: 'none', background: 'none', cursor: 'pointer', outline: 'none' }} 
              onClick={closePopup}
            ></button>
            <div className="newsletter-container"> 
              <div className="newsletter-img">
                <img src="/media/banner/newsletter-popup.jpg" alt="Newsletter Promotion" />
              </div> 
              <div className="newsletter-form">
                <form onSubmit={handleSubscribe}>
                  <div className="newsletter-title">
                    <div className="title" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold' }}>
                      Get <br /> 10% Off!
                    </div>
                    <div className="sub-title">on your first order. Offer ends soon.</div>
                  </div>
                  <div className="newsletter-input clearfix">
                    <input 
                      type="email" 
                      name="your-email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control" 
                      placeholder="Enter Your Email ..." 
                      required 
                    />
                    <input type="submit" value="Subscribe" className="form-control" />
                  </div>
                  <div className="newsletter-no" style={{ cursor: 'pointer' }} onClick={closePopup}>
                    no thanks !
                  </div>
                </form>
              </div> 
            </div>
          </div>
        </>
      )}
    </div>
  );
}

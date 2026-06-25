import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';

const API_BASE = 'http://localhost:3000/api';

const fetchProducts = async () => {
  const { data } = await axios.get(`${API_BASE}/products?limit=8`);
  return data.products;
};

const fetchBlogs = async () => {
  const { data } = await axios.get(`${API_BASE}/blogs`);
  return data.slice(0, 3);
};

export default function Home() {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['homeProducts'],
    queryFn: fetchProducts,
  });

  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ['homeBlogs'],
    queryFn: fetchBlogs,
  });

  // Hero carousel slides
  const slides = [
    {
      image: "/media/slider/1-1.jpg",
      title: "Discover a \nworld of jewelry",
      button: "Explore Bestseller",
      link: "/shop"
    },
    {
      image: "/media/slider/1-2.jpg",
      title: "Discover the\n Best of the Best",
      button: "Explore Bestseller",
      link: "/shop?category=Earrings"
    },
    {
      image: "/media/slider/1-3.jpg",
      title: "Oh,\n Hello Newness!",
      button: "Explore Bestseller",
      link: "/shop?category=Necklaces"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        <div id="primary" className="content-area">
          <div id="content" className="site-content" role="main">
            
            {/* HERO SLIDER SECTION (React-Native Slide Animation) */}
            <section className="section m-b-70">
              <div className="block block-sliders auto-height color-white nav-center">
                <div 
                  className="slick-sliders slick-initialized slick-slider slick-dotted" 
                  style={{ position: 'relative', overflow: 'hidden' }}
                >
                  
                  {/* Slides List Container */}
                  <div className="slick-list draggable" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                    <div 
                      className="slick-track" 
                      style={{ 
                        display: 'flex', 
                        transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 
                        transform: `translateX(-${(currentSlide * 100) / slides.length}%)`, 
                        width: `${slides.length * 100}%` 
                      }}
                    >
                      {slides.map((slide, idx) => (
                        <div 
                          key={idx} 
                          className={`item slick-slide ${currentSlide === idx ? 'slick-active slick-current' : ''}`}
                          style={{ 
                            width: `${100 / slides.length}%`, 
                            display: 'block', 
                            float: 'left',
                            position: 'relative'
                          }}
                        >
                          <div className="item-content">
                            <div className="content-image">
                              <img width="1920" height="1080" src={slide.image} alt="Image Slider" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                            <div className="item-info horizontal-start vertical-middle">
                              <div className="content">
                                <h2 className="title-slider" style={{ whiteSpace: 'pre-line' }}>{slide.title}</h2>
                                <Link className="button-slider button button-white button-outline thick-border" to={slide.link}>{slide.button}</Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <span 
                    className="slick-prev" 
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    style={{ zIndex: 10, cursor: 'pointer' }}
                  >
                    <i className="arrow_carrot-left"></i>
                  </span>
                  <span 
                    className="slick-next" 
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                    style={{ zIndex: 10, cursor: 'pointer' }}
                  >
                    <i className="arrow_carrot-right"></i>
                  </span>

                  {/* Dots Indicators */}
                  <ul className="slick-dots" style={{ display: 'block', bottom: '25px', zIndex: 10 }}>
                    {slides.map((_, idx) => (
                      <li key={idx} className={currentSlide === idx ? 'slick-active' : ''} onClick={() => setCurrentSlide(idx)}>
                        <button type="button">{idx + 1}</button>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            </section>

            {/* BANNERS LAYOUT 1 SECTION */}
            <section className="section section-padding m-b-70">
              <div className="section-container large">
                <div className="block block-banners layout-1 banners-effect">
                  <div className="block-widget-wrap small-space">
                    <div className="row">
                      <div className="section-column left col-md-4 col-sm-12 sm-m-b">
                        <div className="block-widget-banner">
                          <div className="bg-banner">
                            <div className="banner-wrapper banners">
                              <div className="banner-image">
                                <Link to="/shop">
                                  <img width="630" height="457" src="/media/banner/banner-1-1.jpg" alt="New Arrivals" />
                                </Link>
                              </div>
                              <div className="banner-wrapper-infor">
                                <div className="info">
                                  <div className="content">
                                    <h3 className="title-banner">New Arrivals</h3>
                                    <Link className="button" to="/shop">Shop Now</Link>						
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="section-column center col-md-4 col-sm-12 sm-m-b">
                        <div className="block-widget-banner">
                          <div className="bg-banner">
                            <div className="banner-wrapper banners">
                              <div className="banner-image">
                                <Link to="/shop">
                                  <img width="450" height="457" src="/media/banner/banner-1-2.jpg" alt="Best Seller" />
                                </Link>
                              </div>
                              <div className="banner-wrapper-infor text-center">
                                <div className="info">
                                  <div className="content">
                                    <h3 className="title-banner">Best Seller</h3>
                                    <Link className="button center" to="/shop">Shop Now</Link>						
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="section-column right col-md-4 col-sm-12">
                        <div className="block-widget-banner">
                          <div className="bg-banner">
                            <div className="banner-wrapper banners">
                              <div className="banner-image">
                                <Link to="/shop">
                                  <img width="630" height="457" src="/media/banner/banner-1-3.jpg" alt="Clearance Sale" />
                                </Link>
                              </div>
                              <div className="banner-wrapper-infor">
                                <div className="info">
                                  <div className="content">
                                    <h3 className="title-banner">Clearance Sale</h3>
                                    <Link className="button" to="/shop">Shop Now</Link>						
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
            </section>

            {/* TOP CATEGORIES SECTION (Responsive Grid) */}
            <section className="section section-padding m-b-70">
              <div className="section-container">
                <div className="block block-product-cats round-border">
                  <div className="block-widget-wrap">
                    <div className="block-title"><h2>Top Categories</h2></div>
                    <div className="block-content">
                      <div className="product-cats-list">
                        <div className="row justify-content-center">
                          {[
                            { name: 'Bracelets', img: '/media/product/cat-1.jpg', link: '/shop?category=Bracelets' },
                            { name: 'Earrings', img: '/media/product/cat-3.jpg', link: '/shop?category=Earrings' },
                            { name: 'Necklaces', img: '/media/product/cat-4.jpg', link: '/shop?category=Necklaces' },
                            { name: 'Rings', img: '/media/product/cat-5.jpg', link: '/shop?category=Rings' },
                            { name: 'Charms', img: '/media/product/cat-2.jpg', link: '/shop' }
                          ].map((cat, idx) => (
                            <div key={idx} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 mb-4">
                              <div className="item-product-cat" style={{ textAlign: 'center' }}>	
                                <div className="item-product-cat-content">
                                  <Link to={cat.link}>
                                    <div className="item-image animation-horizontal">
                                      <img width="258" height="258" src={cat.img} alt={cat.name} onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} />
                                    </div>
                                  </Link>			
                                  <div className="product-cat-content-info" style={{ marginTop: '10px' }}>
                                    <h2 className="item-title">
                                      <Link to={cat.link}>{cat.name}</Link>
                                    </h2>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* HANDCRAFTED INTRO SECTION */}
            <section className="section background-img bg-img-1 m-b-70" style={{ backgroundImage: "url('/media/banner/bg-img-1.jpg')" }}>
              <div className="block block-intro">
                <div className="row">
                  <div className="section-column left col-lg-6 col-md-12">
                    <div className="intro-wrap" style={{ padding: '60px 40px' }}>
                      <h2 className="intro-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', fontWeight: 'bold' }}>Handcrafted<br /> &amp; Ethically Sourced</h2>
                      <div className="intro-item">
                        <div className="icon">
                          <span className="wrap animation-horizontal">
                            <i className="icon-diamond" style={{ fontSize: '32px', color: '#e0a96d' }}></i>
                          </span>
                        </div>
                        <div className="content">
                          <h3 className="title">FAIR PRICING</h3>
                          <div className="text">We believe in honest luxury. By cutting out the middleman, we deliver exceptional design and materials at a fraction of traditional retail costs.</div>
                        </div>
                      </div>
                      <div className="intro-item">
                        <div className="icon">
                          <span className="wrap animation-horizontal">
                            <i className="icon-star" style={{ fontSize: '32px', color: '#e0a96d' }}></i>
                          </span>
                        </div>
                        <div className="content">
                          <h3 className="title">HIGH QUALITY</h3>
                          <div className="text">Our jewelry is made from premium solid gold, ethically sourced diamonds, and high-quality sterling silver, built to last a lifetime.</div>
                        </div>
                      </div>
                      <div className="intro-btn">
                        <Link to="/shop" className="button button-black button-arrow animation-horizontal">LEARN MORE</Link>
                      </div>
                    </div>
                  </div>
                  <div className="section-column right col-lg-6 d-none d-lg-block p-0">
                    <Link to="/shop">
                      <img className="hover-opacity" width="820" height="674" src="/media/banner/intro-1.jpg" alt="intro" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* TRENDING PRODUCTS LIST SECTION */}
            <section className="section section-padding m-b-70">
              <div className="section-container large">
                <div className="block block-products">
                  <div className="block-widget-wrap">
                    <div className="block-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 'bold' }}>Trending Products</h2>
                    </div>
                    <div className="block-content">
                      {productsLoading ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-dark" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          {products && products.slice(0, 8).map((product) => (
                            <ProductCard key={product.id} product={product} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* BANNERS LAYOUT 2 SECTION */}
            <section className="section section-padding m-b-70">
              <div className="section-container large">
                <div className="block block-banners layout-2 banners-effect">
                  <div className="block-widget-wrap">
                    <div className="row">
                      <div className="col-md-6 col-sm-12 mb-4 mb-md-0">
                        <div className="block-widget-banner m-b-15">
                          <div className="bg-banner">
                            <div className="banner-wrapper banners">
                              <div className="banner-image">
                                <Link to="/shop">
                                  <img width="856" height="496" src="/media/banner/banner-1-4.jpg" alt="Summer Collections" />
                                </Link>
                              </div>
                              <div className="banner-wrapper-infor">
                                <div className="info">
                                  <div className="content">
                                    <h3 className="title-banner">Summer Collections</h3>
                                    <div className="banner-image-description">
                                      Freshwater pearl necklace and earrings
                                    </div>
                                    <Link className="button button-outline thick-border border-white button-arrow" to="/shop">Explore</Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-12">
                        <div className="block-widget-banner">
                          <div className="bg-banner">
                            <div className="banner-wrapper banners">
                              <div className="banner-image">
                                <Link to="/shop">
                                  <img width="856" height="496" src="/media/banner/banner-1-5.jpg" alt="Make It Memorable" />
                                </Link>
                              </div>
                              <div className="banner-wrapper-infor">
                                <div className="info">
                                  <div className="content">
                                    <h3 className="title-banner">Make It Memorable</h3>
                                    <div className="banner-image-description">
                                      Elegant gold engagements and wedding bands
                                    </div>
                                    <Link className="button button-outline thick-border border-white button-arrow" to="/shop">Explore</Link>
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
            </section>

            {/* TESTIMONIALS SECTION (Responsive Columns) */}
            <section className="section section-padding background-img bg-img-2 m-b-70 p-t-140 p-b-70 m-t-n-130" style={{ backgroundImage: "url('/media/banner/bg-img-2.jpg')" }}>
              <div className="container">
                <div className="block block-testimonial layout-2">
                  <div className="block-widget-wrap">
                    <div className="block-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
                      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 'bold' }}>What Our Customers Say</h2>
                    </div>
                    <div className="block-content">
                      <div className="testimonial-wrap">
                        <div className="row">
                          
                          <div className="col-md-4 col-sm-12 mb-4 mb-md-0">
                            <div className="testimonial-content">
                              <div className="item">
                                <div className="testimonial-item" style={{ minHeight: '200px' }}>
                                  <div className="testimonial-icon">
                                    <div className="rating">
                                      <div className="star star-5"></div>
                                    </div>
                                  </div>
                                  <h2 className="testimonial-title">“Amazing piece of history”</h2>
                                  <div className="testimonial-excerpt">
                                    Absolutely in love with my twin hoop earrings! The craftsmanship is incredible and they feel so luxurious. Truly standard-setting jewelry.
                                  </div>								
                                </div>
                                <div className="testimonial-image image-position-top">
                                  <div className="thumbnail">
                                    <img width="110" height="110" src="/media/testimonial/1.jpg" alt="Robert Smith" />							
                                  </div>
                                  <div className="testimonial-info">
                                    <h2 className="testimonial-customer-name">Robert Smith</h2>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 col-sm-12 mb-4 mb-md-0">
                            <div className="testimonial-content">
                              <div className="item">
                                <div className="testimonial-item" style={{ minHeight: '200px' }}>
                                  <div className="testimonial-icon">
                                    <div className="rating">
                                      <div className="star star-4"></div>
                                    </div>
                                  </div>
                                  <h2 className="testimonial-title">“Fabulous Customer Care”</h2>
                                  <div className="testimonial-excerpt">
                                    I bought a wedding band and the support team helped me resize it without any issues. The process was super fast and friendly!
                                  </div>								
                                </div>
                                <div className="testimonial-image image-position-top">
                                  <div className="thumbnail">
                                    <img width="110" height="110" src="/media/testimonial/2.jpg" alt="Saitama One" />							
                                  </div>
                                  <div className="testimonial-info">
                                    <h2 className="testimonial-customer-name">Saitama One</h2>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 col-sm-12">
                            <div className="testimonial-content">
                              <div className="item">
                                <div className="testimonial-item" style={{ minHeight: '200px' }}>
                                  <div className="testimonial-icon">
                                    <div className="rating">
                                      <div className="star star-5"></div>
                                    </div>
                                  </div>
                                  <h2 className="testimonial-title">“Stunning Design”</h2>
                                  <div className="testimonial-excerpt">
                                    Every time I wear my gold chain necklace, I get compliments. The packaging, delivery speed, and overall look is simply premium!
                                  </div>								
                                </div>
                                <div className="testimonial-image image-position-top">
                                  <div className="thumbnail">
                                    <img width="110" height="110" src="/media/testimonial/3.jpg" alt="Sara Colinton" />							
                                  </div>
                                  <div className="testimonial-info">
                                    <h2 className="testimonial-customer-name">Sara Colinton</h2>
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
            </section>

            {/* NEWSLETTER SUBSCRIBE SECTION */}
            <section className="section section-padding m-b-80">
              <div className="section-container">
                <div className="block block-newsletter layout-2 one-col">
                  <div className="block-widget-wrap">
                    <div className="newsletter-title-wrap">
                      <h2 className="newsletter-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 'bold' }}>Latest From MoJuri!</h2>
                      <div className="newsletter-text">Sign-up to receive 10% off your next purchase. Plus hear about new arrivals and offers.</div>
                    </div>
                    <form 
                      onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); e.target.reset(); }} 
                      className="newsletter-form"
                    >
                      <input type="email" name="your-email" placeholder="Email address" required />
                      <span className="btn-submit">
                        <input type="submit" value="SUBSCRIBE" />
                      </span>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            {/* BRANDS LIST LOGOS SECTION (Responsive Grid) */}
            <section className="section section-padding top-border p-t-10 p-b-10 m-b-0">
              <div className="section-container">
                <div className="block block-image">
                  <div className="block-widget-wrap">
                    <div className="d-flex justify-content-around align-items-center flex-wrap gap-4" style={{ padding: '25px 0' }}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="brand-logo-item" style={{ width: '120px', textAlign: 'center' }}>
                          <Link to="/shop"> 
                            <img width="450" height="450" src={`/media/brand/${num}.jpg`} alt={`Brand ${num}`} style={{ maxWidth: '100%', height: 'auto', filter: 'grayscale(1)', opacity: 0.7, transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.target.style.filter = 'none'; e.target.style.opacity = 1; }} onMouseLeave={(e) => { e.target.style.filter = 'grayscale(1)'; e.target.style.opacity = 0.7; }} />
                          </Link>
                        </div>
                      ))}
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

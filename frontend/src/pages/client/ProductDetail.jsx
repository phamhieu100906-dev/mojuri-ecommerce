import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCartStore } from '../../context/cartStore';
import { useWishlistStore } from '../../context/wishlistStore';
import ProductCard from '../../components/ProductCard';

const API_BASE = '/api';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist, wishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(null);

  const fetchProductDetail = async () => {
    const { data } = await axios.get(`${API_BASE}/products/${id}`);
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['productDetail', id],
    queryFn: fetchProductDetail,
  });

  useEffect(() => {
    // Reset state on ID changes
    setQuantity(1);
    setActiveImage(null);
  }, [id]);

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
            <h2>Product not found.</h2>
            <Link to="/shop" className="button btn-primary mt-3">Back to shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const { product, related } = data;
  const mainImage = activeImage || product.thumbnail;
  const isFav = isInWishlist(product.id);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    if (!isFav) {
      alert(`Đã thêm "${product.name}" vào mục yêu thích!`);
    } else {
      alert(`Đã xóa "${product.name}" khỏi mục yêu thích!`);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, quantity);
    alert(`Đã thêm ${quantity} "${product.name}" vào giỏ hàng!`);
  };

  const hasSale = product.salePrice !== null && product.salePrice !== undefined;
  
  const imageGallery = (() => {
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        
        {/* Breadcrumb banner */}
        <div id="title" className="page-title" style={{ backgroundImage: "url('/media/site-header.jpg')" }}>
          <div className="section-container">
            <div className="content-title-heading">
              <h1 className="text-title-heading">{product.name}</h1>
            </div>
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
              <span className="delimiter"></span>
              <Link to="/shop">Shop</Link>
              <span className="delimiter"></span>
              <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
              <span className="delimiter"></span>
              {product.name}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div id="content" className="site-content" role="main">
          <div className="section-padding">
            <div className="section-container p-l-r shop-details">
              
              <div className="product-detailsEntry single-product">
                <div className="row">
                  
                  {/* Left Column: Product Images */}
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12 image-quickview">
                    <div className="product-images-slider">
                      
                      <div className="main-image-wrap mb-4" style={{ border: '1px solid #eee', background: '#fff', textAlign: 'center' }}>
                        <img 
                          width="600" 
                          height="600" 
                          src={mainImage.startsWith('http') ? mainImage : `/${mainImage}`} 
                          alt={product.name} 
                          onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} 
                          style={{ maxWidth: '100%', height: 'auto', maxHeight: '450px', objectFit: 'contain' }}
                        />
                      </div>

                      {/* Thumbnail Gallery */}
                      {imageGallery.length > 0 && (
                        <div className="gallery-thumbnails d-flex gap-2 justify-content-center">
                          {imageGallery.map((img, index) => (
                            <div 
                              key={index} 
                              onClick={() => setActiveImage(img)}
                              style={{ 
                                width: '70px', 
                                height: '70px', 
                                border: `2px solid ${mainImage === img ? '#e0a96d' : '#eee'}`, 
                                cursor: 'pointer',
                                background: '#fff',
                                overflow: 'hidden'
                              }}
                            >
                              <img 
                                src={img.startsWith('http') ? img : `/${img}`} 
                                alt="" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} 
                              />
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Right Column: Entry details */}
                  <div className="col-xl-6 col-lg-6 col-md-12 col-12 quickview-single-info">
                    <div className="product-content-detail entry-summary">
                      
                      <span className="product-category" style={{ fontSize: '11px', textTransform: 'uppercase', color: '#e0a96d', fontWeight: 'bold', letterSpacing: '1px' }}>
                        {product.category}
                      </span>
                      
                      <h1 className="product-title entry-title">{product.name}</h1>
                      
                      {/* Price Section */}
                      <div className="price-single">
                        <div className="price">
                          {hasSale ? (
                            <>
                              <del><span>${product.price}</span></del>
                              <span>${product.salePrice}</span>
                            </>
                          ) : (
                            <span>${product.price}</span>
                          )}
                        </div>
                      </div>

                      {/* Rating details */}
                      <div className="product-rating">
                        <div className="star-rating" role="img">
                          <span style={{ width: '100%' }}>Rated 5.00 out of 5 based on 1 customer review</span>
                        </div>
                        <a href="#" className="review-link" onClick={(e) => { e.preventDefault(); setActiveTab('reviews'); }}>(<span className="count">1</span> customer review)</a>
                      </div>

                      {/* Description */}
                      <div className="description">
                        <p>{product.description}</p>
                      </div>

                      {/* Stock details */}
                      <div className="stock-status" style={{ marginBottom: '25px', fontSize: '13px' }}>
                        Availability:{' '}
                        {product.stock > 0 ? (
                          <span style={{ color: 'green', fontWeight: 'bold' }}>In stock ({product.stock} items left)</span>
                        ) : (
                          <span style={{ color: 'red', fontWeight: 'bold' }}>Out of stock</span>
                        )}
                      </div>

                      {/* Add to cart & Wishlist buttons block */}
                      {product.stock > 0 && (
                        <div className="buttons">
                          <form className="cart" onSubmit={handleAddToCart} style={{ display: 'inline-block', verticalAlign: 'top', margin: 0 }}>
                            <div className="quantity-button">
                              <div className="quantity">
                                <button 
                                  type="button" 
                                  className="minus" 
                                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                  -
                                </button>
                                <input 
                                  type="number" 
                                  className="input-text qty text" 
                                  step="1" 
                                  min="1" 
                                  value={quantity} 
                                  readOnly
                                />
                                <button 
                                  type="button" 
                                  className="plus" 
                                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                >
                                  +
                                </button>
                              </div>
                              <button type="submit" className="single-add-to-cart-button button alt">Add to cart</button>
                            </div>
                          </form>

                          <div className="btn-wishlist" data-title={isFav ? "Remove from Wishlist" : "Wishlist"}>
                            <button 
                              type="button" 
                              className={`product-btn ${isFav ? 'added' : ''}`}
                              onClick={handleToggleWishlist}
                            >
                              {isFav ? "In Wishlist" : "Add to wishlist"}
                            </button>
                          </div>

                          <div className="btn-compare" data-title="Compare">
                            <button type="button" className="product-btn">Compare</button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>
              </div>

              {/* Tabs Section */}
              <div className="product-tabs" style={{ marginTop: '50px' }}>
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <button 
                      onClick={() => setActiveTab('description')} 
                      className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                      role="tab"
                      style={{ background: 'none', border: 'none', fontWeight: 600 }}
                    >
                      Description
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => setActiveTab('reviews')} 
                      className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                      role="tab"
                      style={{ background: 'none', border: 'none', fontWeight: 600 }}
                    >
                      Reviews (1)
                    </button>
                  </li>
                </ul>

                <div className="tab-content" style={{ padding: '25px 0' }}>
                  {activeTab === 'description' ? (
                    <div className="tab-pane active">
                      <p>This premium jewelry item is meticulously crafted to ensure the highest standard of elegance. We use only sustainably sourced diamonds, certified precious gems, and solid metals.</p>
                      <ul>
                        <li>Crafted from 100% fine materials.</li>
                        <li>Designed with anti-tarnish protective plating.</li>
                        <li>Includes a Certificate of Authenticity and a lifetime polishing warranty.</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="tab-pane active">
                      <div className="reviews-tab">
                        <div className="review-item mb-4 pb-3" style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <div className="d-flex justify-content-between mb-2">
                            <strong>Ngoc Trinh</strong>
                            <div className="star-rating" style={{ float: 'none', display: 'inline-block' }}>
                              <span style={{ width: '100%' }}>5.00 out of 5</span>
                            </div>
                          </div>
                          <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Absolutely beautiful, it shines so nicely! Delivery was prompt and it fits perfectly. Strongly recommend!</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Products Grid */}
              {related && related.length > 0 && (
                <section className="related products mt-5">
                  <h2>Related products</h2>
                  <div className="row">
                    {related.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </section>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

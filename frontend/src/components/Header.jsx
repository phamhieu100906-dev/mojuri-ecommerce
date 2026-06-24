import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useCartStore } from '../context/cartStore';
import { useWishlistStore } from '../context/wishlistStore';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { cart, removeFromCart, getTotalPrice, getCartCount, addToCart } = useCartStore();
  const { wishlist, removeFromWishlist, getWishlistCount } = useWishlistStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartPopupOpen, setCartPopupOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <header id="site-header" className={`site-header header-v1 ${isHome ? 'color-white' : ''}`}>
      {/* Mobile Header */}
      <div className="header-mobile">
        <div className="section-padding">
          <div className="section-container">
            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3 header-left">
                <div className="navbar-header">
                  <button 
                    type="button" 
                    id="show-megamenu" 
                    className={`navbar-toggle ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  ></button>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6 header-center">
                <div className="site-logo">
                  <Link to="/">
                    <img 
                      width="400" 
                      height="79" 
                      src={isHome ? "/media/logo-white.png" : "/media/logo.png"} 
                      alt="Mojuri Logo" 
                      onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/logo.png"} 
                    />
                  </Link>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3 header-right">
                <div className="mojuri-topcart dropdown">
                  <div className="dropdown mini-cart top-cart">
                    <Link className="dropdown-toggle cart-icon" to="/cart">
                      <div className="icons-cart">
                        <i className="icon-large-paper-bag"></i>
                        <span className="cart-count">{getCartCount()}</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu content */}
        {mobileMenuOpen && (
          <div className="mobile-menu-wrapper" style={{ background: '#fff', borderTop: '1px solid #eee', padding: '20px', position: 'absolute', width: '100%', left: 0, zIndex: 9999 }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ padding: '10px 0' }}><Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>Home</Link></li>
              <li style={{ padding: '10px 0' }}><Link to="/shop" onClick={() => setMobileMenuOpen(false)} style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>Shop</Link></li>
              <li style={{ padding: '10px 0' }}><Link to="/blog" onClick={() => setMobileMenuOpen(false)} style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>Blog</Link></li>
              <li style={{ padding: '10px 0' }}><Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>Contact</Link></li>
              {user ? (
                <>
                  {user.role === 'ADMIN' && (
                    <li style={{ padding: '10px 0' }}><Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>Admin Dashboard</Link></li>
                  )}
                  <li style={{ padding: '10px 0' }}>
                    <button 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }} 
                      style={{ background: 'none', border: 'none', padding: 0, color: 'red', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Logout ({user.name})
                    </button>
                  </li>
                </>
              ) : (
                <li style={{ padding: '10px 0' }}><Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: '#111', fontWeight: 600, textDecoration: 'none' }}>Login</Link></li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="header-desktop">
        <div className="header-wrapper">
          <div className="section-padding">
            <div className="section-container large p-l-r">
              <div className="row">
                
                {/* Logo */}
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 header-left">
                  <div className="site-logo">
                    <Link to="/">
                      <img 
                        width="400" 
                        height="140" 
                        src={isHome ? "/media/logo-white.png" : "/media/logo.png"} 
                        alt="Mojuri Logo" 
                        onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/logo.png"} 
                      />
                    </Link>
                  </div>
                </div>

                {/* Main Navigation */}
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 text-center header-center">
                  <div className="site-navigation">
                    <nav id="main-navigation">
                      <ul id="menu-main-menu" className="menu">
                        <li className="level-0 menu-item menu-item-has-children">
                          <Link to="/"><span className="menu-item-text">Home</span></Link>
                          <ul className="sub-menu">
                            <li><Link to="/"><span className="menu-item-text">Home Clean</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">Home Collection</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">Home Minimal</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">Home Modern</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">Home Parallax</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">Home Strong</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">Home Style</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">Home Unique</span></Link></li>
                          </ul>
                        </li>
                        <li className="level-0 menu-item menu-item-has-children">
                          <Link to="/shop"><span className="menu-item-text">Shop</span></Link>
                          <ul className="sub-menu">
                            <li className="level-1 menu-item menu-item-has-children">
                              <Link to="/shop"><span className="menu-item-text">Shop - Products</span></Link>
                              <ul className="sub-menu">
                                <li><Link to="/shop"><span className="menu-item-text">Shop Grid - Left Sidebar</span></Link></li>
                                <li><Link to="/shop"><span className="menu-item-text">Shop List - Left Sidebar</span></Link></li>
                                <li><Link to="/shop"><span className="menu-item-text">Shop Grid - Right Sidebar</span></Link></li>
                                <li><Link to="/shop"><span className="menu-item-text">Shop List - Right Sidebar</span></Link></li>
                                <li><Link to="/shop"><span className="menu-item-text">Shop Grid - No Sidebar</span></Link></li>
                              </ul>
                            </li>
                            <li><Link to="/shop"><span className="menu-item-text">Shop Details</span></Link></li>
                            <li><Link to="/cart"><span className="menu-item-text">Shop - Cart</span></Link></li>
                            <li><Link to="/checkout"><span className="menu-item-text">Shop - Checkout</span></Link></li>
                            <li><Link to="/shop"><span className="menu-item-text">Shop - Wishlist</span></Link></li>
                          </ul>
                        </li>
                        <li className="level-0 menu-item menu-item-has-children mega-menu mega-menu-fullwidth align-center">
                          <Link to="/blog"><span className="menu-item-text">Blog</span></Link>
                          <div className="sub-menu">
                            <div className="row" style={{ textAlign: 'left' }}>
                              <div className="col-md-5">
                                <div className="menu-section">
                                  <h2 className="sub-menu-title">Blog Category</h2>
                                  <ul className="menu-list" style={{ listStyle: 'none', padding: 0 }}>
                                    <li><Link to="/blog"><span className="menu-item-text">Blog Grid - Left Sidebar</span></Link></li>
                                    <li><Link to="/blog"><span className="menu-item-text">Blog Grid - Right Sidebar</span></Link></li>
                                    <li><Link to="/blog"><span className="menu-item-text">Blog List - Left Sidebar</span></Link></li>
                                    <li><Link to="/blog"><span className="menu-item-text">Blog List - Right Sidebar</span></Link></li>
                                    <li><Link to="/blog"><span className="menu-item-text">Blog Grid - No Sidebar</span></Link></li>
                                  </ul>
                                </div>
                                <div className="menu-section mt-3">
                                  <h2 className="sub-menu-title">Blog Details</h2>
                                  <ul className="menu-list" style={{ listStyle: 'none', padding: 0 }}>
                                    <li><Link to="/blog/1"><span className="menu-item-text">Blog Details - Left Sidebar</span></Link></li>
                                    <li><Link to="/blog/2"><span className="menu-item-text">Blog Details - Right Sidebar</span></Link></li>
                                    <li><Link to="/blog/3"><span className="menu-item-text">Blog Details - No Sidebar</span></Link></li>
                                  </ul>
                                </div>
                              </div>
                              <div className="col-md-7">
                                <div className="menu-section">
                                  <h2 className="sub-menu-title">Recent Posts</h2>
                                  <div className="block block-posts recent-posts p-t-5">
                                    <ul className="posts-list" style={{ listStyle: 'none', padding: 0 }}>
                                      <li className="post-item d-flex gap-3 mb-3">
                                        <Link to="/blog/1" className="post-image" style={{ width: '80px', flexShrink: 0 }}>
                                          <img src="/media/blog/1.jpg" alt="" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                                        </Link>
                                        <div className="post-content">
                                          <h2 className="post-title" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                                            <Link to="/blog/1">Bridial Fair Collections 2023</Link>
                                          </h2>
                                          <div className="post-time" style={{ fontSize: '11px', color: '#888' }}>
                                            <span className="post-date">May 30, 2022</span>
                                            <span className="post-comment" style={{ marginLeft: '10px' }}>4 Comments</span>
                                          </div>
                                        </div>
                                      </li>
                                      <li className="post-item d-flex gap-3 mb-3">
                                        <Link to="/blog/2" className="post-image" style={{ width: '80px', flexShrink: 0 }}>
                                          <img src="/media/blog/2.jpg" alt="" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                                        </Link>
                                        <div className="post-content">
                                          <h2 className="post-title" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                                            <Link to="/blog/2">Our Sterling Silver</Link>
                                          </h2>
                                          <div className="post-time" style={{ fontSize: '11px', color: '#888' }}>
                                            <span className="post-date">Aug 24, 2022</span>
                                            <span className="post-comment" style={{ marginLeft: '10px' }}>2 Comments</span>
                                          </div>
                                        </div>
                                      </li>
                                      <li className="post-item d-flex gap-3">
                                        <Link to="/blog/3" className="post-image" style={{ width: '80px', flexShrink: 0 }}>
                                          <img src="/media/blog/3.jpg" alt="" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                                        </Link>
                                        <div className="post-content">
                                          <h2 className="post-title" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                                            <Link to="/blog/3">Kitchen Inspired On Japanese</Link>
                                          </h2>
                                          <div className="post-time" style={{ fontSize: '11px', color: '#888' }}>
                                            <span className="post-date">Dec 06, 2022</span>
                                            <span className="post-comment" style={{ marginLeft: '10px' }}>1 Comment</span>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="level-0 menu-item menu-item-has-children">
                          <Link to="#"><span className="menu-item-text">Pages</span></Link>
                          <ul className="sub-menu">
                            <li><Link to="/login"><span className="menu-item-text">Login / Register</span></Link></li>
                            <li><Link to="/login"><span className="menu-item-text">Forgot Password</span></Link></li>
                            <li><Link to="/login"><span className="menu-item-text">My Account</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">About Us</span></Link></li>
                            <li><Link to="/contact"><span className="menu-item-text">Contact</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">FAQ</span></Link></li>
                            <li><Link to="/"><span className="menu-item-text">Page 404</span></Link></li>
                          </ul>
                        </li>
                        <li className="level-0 menu-item">
                          <Link to="/contact"><span className="menu-item-text">Contact</span></Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 header-right">
                  <div className="header-page-link">
                    
                    {/* Search */}
                    <div className="search-box" onClick={() => navigate('/shop')}>
                      <div className="search-toggle"><i className="icon-search"></i></div>
                    </div>

                    {/* User Link / Dropdown */}
                    <div className="login-header icon dropdown" style={{ position: 'relative' }}>
                      {user ? (
                        <div className="d-inline-block">
                          <span 
                            className="dropdown-toggle" 
                            style={{ cursor: 'pointer', fontWeight: 600, color: 'inherit' }} 
                            id="userMenu" 
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                          >
                            <i className="icon-user" style={{ marginRight: '5px' }}></i> {user.name}
                          </span>
                          <div 
                            className={`dropdown-menu dropdown-menu-right ${userDropdownOpen ? 'show' : ''}`} 
                            style={{ 
                              display: userDropdownOpen ? 'block' : 'none', 
                              padding: '10px 0', 
                              border: '1px solid #eee', 
                              marginTop: '10px',
                              position: 'absolute',
                              right: 0,
                              left: 'auto',
                              zIndex: 1000,
                              background: '#fff',
                              minWidth: '150px'
                            }} 
                            aria-labelledby="userMenu"
                          >
                            {user.role === 'ADMIN' && (
                              <Link 
                                to="/admin" 
                                className="dropdown-item" 
                                style={{ color: '#111', fontSize: '13px', display: 'block', padding: '5px 15px' }}
                                onClick={() => setUserDropdownOpen(false)}
                              >
                                Admin Dashboard
                              </Link>
                            )}
                            <button 
                              onClick={handleLogout} 
                              className="dropdown-item text-danger btn-link" 
                              style={{ 
                                cursor: 'pointer', 
                                background: 'none', 
                                border: 'none', 
                                width: '100%', 
                                textAlign: 'left', 
                                fontSize: '13px', 
                                display: 'block', 
                                padding: '5px 15px' 
                              }}
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      ) : (
                        <Link to="/login" title="Login" style={{ color: 'inherit' }}>
                          <i className="icon-user"></i>
                        </Link>
                      )}
                    </div>

                    {/* Wishlist Box */}
                    <div className="wishlist-box">
                      <Link to="#" onClick={(e) => { e.preventDefault(); setWishlistOpen(true); }} style={{ color: 'inherit' }}>
                        <i className="icon-heart"></i>
                        {getWishlistCount() > 0 && (
                          <span className="count-wishlist">{getWishlistCount()}</span>
                        )}
                      </Link>
                    </div>

                    {/* Mini Cart */}
                    <div 
                      className={`mojuri-topcart dropdown ${isHome ? 'light' : ''}`}
                      onMouseEnter={() => setCartPopupOpen(true)}
                      onMouseLeave={() => setCartPopupOpen(false)}
                    >
                      <div className="dropdown mini-cart top-cart">
                        <div className="remove-cart-shadow"></div>
                        <Link className="dropdown-toggle cart-icon" to="/cart">
                          <div className="icons-cart">
                            <i className="icon-large-paper-bag"></i>
                            <span className="cart-count">{getCartCount()}</span>
                          </div>
                        </Link>

                        {/* Cart Popup */}
                        <div 
                          className={`dropdown-menu cart-popup ${cartPopupOpen ? 'show' : ''}`} 
                          style={{ display: cartPopupOpen ? 'block' : 'none', right: 0, left: 'auto' }}
                        >
                          {cart.length === 0 ? (
                            <div className="cart-empty-wrap">
                              <ul className="cart-list">
                                <li className="empty">
                                  <span>No products in the cart.</span>
                                  <Link className="go-shop" to="/shop" onClick={() => setCartPopupOpen(false)}>
                                    GO TO SHOP <i aria-hidden="true" className="arrow_right"></i>
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          ) : (
                            <div className="cart-list-wrap">
                              <ul className="cart-list">
                                {cart.map((item) => (
                                  <li key={item.product.id} className="mini-cart-item">
                                    <button 
                                      onClick={() => removeFromCart(item.product.id)} 
                                      className="remove" 
                                      title="Remove this item"
                                      style={{ border: 'none', background: 'none' }}
                                    >
                                      <i className="icon_close"></i>
                                    </button>
                                    <Link to={`/product/${item.product.id}`} className="product-image" onClick={() => setCartPopupOpen(false)}>
                                      <img 
                                        width="600" 
                                        height="600" 
                                        src={item.product.thumbnail.startsWith('http') ? item.product.thumbnail : `/${item.product.thumbnail}`} 
                                        alt={item.product.name} 
                                        onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} 
                                      />
                                    </Link>
                                    <Link to={`/product/${item.product.id}`} className="product-name" onClick={() => setCartPopupOpen(false)}>
                                      {item.product.name}
                                    </Link>
                                    <div className="quantity">Qty: {item.quantity}</div>
                                    <div className="price">${item.product.salePrice || item.product.price}</div>
                                  </li>
                                ))}
                              </ul>
                              <div className="total-cart">
                                <div className="title-total">Total: </div>
                                <div className="total-price"><span>${getTotalPrice()}</span></div>
                              </div>
                              <div className="buttons">
                                <Link to="/cart" className="button btn view-cart btn-primary" onClick={() => setCartPopupOpen(false)}>View cart</Link>
                                <Link to="/checkout" className="button btn checkout btn-default" onClick={() => setCartPopupOpen(false)}>Check out</Link>
                              </div>
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
        </div>
      </div>
      {/* Wishlist Modal Popup */}
      {wishlistOpen && (
        <>
          <div className="popup-shadow" style={{ display: 'block', opacity: 1, visibility: 'visible', zIndex: 100000 }} onClick={() => setWishlistOpen(false)}></div>
          <div className="wishlist-popup show" style={{ display: 'block', opacity: 1, visibility: 'visible', zIndex: 100001 }}>
            <div className="wishlist-popup-inner">
              <div className="wishlist-popup-content">
                <div className="wishlist-popup-content-top">
                  <span className="wishlist-name">Wishlist</span>
                  <span className="wishlist-count-wrapper">
                    <span className="wishlist-count">{getWishlistCount()}</span>
                  </span>
                  <span className="wishlist-popup-close" onClick={() => setWishlistOpen(false)} style={{ cursor: 'pointer' }}></span>
                </div>
                <div className="wishlist-popup-content-mid" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-4 text-muted" style={{ fontSize: '13px' }}>Your wishlist is empty.</div>
                  ) : (
                    <table className="wishlist-items" style={{ width: '100%' }}>
                      <tbody>
                        {wishlist.map((item) => (
                          <tr key={item.id} className="wishlist-item">
                            <td className="wishlist-item-remove" style={{ cursor: 'pointer' }} onClick={() => removeFromWishlist(item.id)}>
                              <span></span>
                            </td>
                            <td className="wishlist-item-image">
                              <Link to={`/product/${item.id}`} onClick={() => setWishlistOpen(false)}>
                                <img width="600" height="600" src={item.thumbnail.startsWith('http') ? item.thumbnail : `/${item.thumbnail}`} alt={item.name} onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} />
                              </Link>
                            </td>
                            <td className="wishlist-item-info">
                              <div className="wishlist-item-name">
                                <Link to={`/product/${item.id}`} onClick={() => setWishlistOpen(false)} style={{ fontWeight: 600 }}>{item.name}</Link>
                              </div>
                              <div className="wishlist-item-price">
                                {item.salePrice !== null ? (
                                  <>
                                    <del aria-hidden="true" style={{ fontSize: '11px', color: '#888', marginRight: '5px' }}>${item.price}</del>
                                    <ins style={{ textDecoration: 'none', color: '#cb8161', fontWeight: 'bold' }}>${item.salePrice}</ins>
                                  </>
                                ) : (
                                  <span style={{ fontWeight: 'bold' }}>${item.price}</span>
                                )}
                              </div>
                            </td>
                            <td className="wishlist-item-actions">
                              <div className="wishlist-item-add">
                                <div data-title="Add to cart">
                                  <a 
                                    rel="nofollow" 
                                    href="#" 
                                    className="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      addToCart(item, 1);
                                      alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
                                      setWishlistOpen(false);
                                    }}
                                    style={{ fontSize: '11px', padding: '6px 12px', display: 'inline-block' }}
                                  >
                                    Add to cart
                                  </a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="wishlist-popup-content-bot" style={{ padding: '15px 0 0' }}>
                  <div className="wishlist-popup-content-bot-inner" style={{ textAlign: 'center' }}>
                    <span className="wishlist-continue" style={{ cursor: 'pointer', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }} onClick={() => setWishlistOpen(false)}>
                      Continue shopping
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

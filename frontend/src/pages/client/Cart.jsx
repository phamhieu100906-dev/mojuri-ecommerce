import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../context/cartStore';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCartStore();

  const cartTotal = getTotalPrice();
  const shippingFee = cartTotal >= 400 || cartTotal === 0 ? 0 : 15;
  const grandTotal = cartTotal + shippingFee;

  if (cart.length === 0) {
    return (
      <div id="site-main" className="site-main">
        <div id="main-content" className="main-content">
          <div className="container py-5 text-center" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <i className="icon-large-paper-bag mb-4" style={{ fontSize: '64px', color: '#ccc' }}></i>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold' }}>Your cart is empty</h2>
            <p style={{ color: '#777', marginTop: '10px' }}>Go back to the shop to discover our high-quality jewelry.</p>
            <Link to="/shop" className="button btn-primary mt-4" style={{ padding: '12px 30px', fontWeight: 600 }}>BACK TO SHOP</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        
        {/* Breadcrumb banner */}
        <div id="title" className="page-title" style={{ backgroundImage: "url('/media/site-header.jpg')" }}>
          <div className="section-container">
            <div className="content-title-heading">
              <h1 className="text-title-heading">Shopping Cart</h1>
            </div>
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
              <span className="delimiter"></span>
              <Link to="/shop">Shop</Link>
              <span className="delimiter"></span>
              Shopping Cart
            </div>
          </div>
        </div>

        {/* Cart Page content */}
        <div id="content" className="site-content" role="main">
          <div className="section-padding">
            <div className="section-container p-l-r">
              <div className="shop-cart">
                <div className="row">
                  
                  {/* Table area */}
                  <div className="col-xl-8 col-lg-12 col-md-12 col-12 m-b-40">
                    <form className="woocommerce-cart-form" onSubmit={(e) => e.preventDefault()}>
                      <table className="shop_table shop_table_responsive cart slick-xs-row-reverse">
                        <thead>
                          <tr>
                            <th className="product-remove">&nbsp;</th>
                            <th className="product-thumbnail">&nbsp;</th>
                            <th className="product-name">Product</th>
                            <th className="product-price">Price</th>
                            <th className="product-quantity">Quantity</th>
                            <th className="product-subtotal">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item) => {
                            const productPrice = item.product.salePrice || item.product.price;
                            const itemSubtotal = productPrice * item.quantity;
                            const imageSrc = item.product.thumbnail.startsWith('http') ? item.product.thumbnail : `/${item.product.thumbnail}`;

                            return (
                              <tr key={item.product.id} className="cart_item">
                                <td className="product-remove">
                                  <Link 
                                    to="#" 
                                    onClick={(e) => { e.preventDefault(); removeFromCart(item.product.id); }} 
                                    className="remove"
                                  >
                                    ×
                                  </Link>
                                </td>
                                <td className="product-thumbnail">
                                  <Link to={`/product/${item.product.id}`}>
                                    <img 
                                      width="600" 
                                      height="600" 
                                      src={imageSrc} 
                                      alt={item.product.name} 
                                      onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} 
                                    />
                                  </Link>
                                </td>
                                <td className="product-name" data-title="Product">
                                  <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                                </td>
                                <td className="product-price" data-title="Price">
                                  <span className="woocommerce-Price-amount amount">
                                    <span className="woocommerce-Price-currencySymbol">$</span>{productPrice}
                                  </span>
                                </td>
                                <td className="product-quantity" data-title="Quantity">
                                  <div className="quantity">
                                    <button 
                                      type="button" 
                                      className="minus" 
                                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    >
                                      -
                                    </button>
                                    <input 
                                      type="number" 
                                      className="input-text qty text" 
                                      step="1" 
                                      min="1" 
                                      value={item.quantity} 
                                      readOnly
                                    />
                                    <button 
                                      type="button" 
                                      className="plus" 
                                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="product-subtotal" data-title="Subtotal">
                                  <span className="woocommerce-Price-amount amount">
                                    <span className="woocommerce-Price-currencySymbol">$</span>{itemSubtotal}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}

                          <tr>
                            <td colSpan="6" className="actions">
                              <div className="coupon">
                                <input type="text" name="coupon_code" className="input-text" placeholder="Coupon code" />
                                <button type="button" className="button" onClick={() => alert('Coupon applied!')}>Apply coupon</button>
                              </div>
                              <button type="button" className="button" onClick={() => navigate('/shop')}>Continue Shopping</button>
                            </td>
                          </tr>

                        </tbody>
                      </table>
                    </form>
                  </div>

                  {/* Summary Area */}
                  <div className="col-xl-4 col-lg-12 col-md-12 col-12">
                    <div className="cart-collaterals">
                      <div className="cart_totals">
                        <h2>Cart totals</h2>
                        <table cellSpacing="0" className="shop_table shop_table_responsive">
                          <tbody>
                            
                            <tr className="cart-subtotal">
                              <th>Subtotal</th>
                              <td data-title="Subtotal">
                                <span className="woocommerce-Price-amount amount">
                                  <span className="woocommerce-Price-currencySymbol">$</span>{cartTotal}
                                </span>
                              </td>
                            </tr>

                            <tr className="shipping">
                              <th>Shipping</th>
                              <td data-title="Shipping">
                                {shippingFee === 0 ? (
                                  <span>Free Shipping</span>
                                ) : (
                                  <span>
                                    <span className="woocommerce-Price-amount amount">
                                      <span className="woocommerce-Price-currencySymbol">$</span>{shippingFee}
                                    </span>
                                  </span>
                                )}
                              </td>
                            </tr>

                            {shippingFee > 0 && (
                              <tr>
                                <td colSpan="2" style={{ padding: '10px 0', borderTop: 'none' }}>
                                  <div className="free-ship" style={{ padding: 0, margin: 0 }}>
                                    <div className="title-ship" style={{ fontSize: '11px', color: '#888' }}>
                                      Buy <strong>${400 - cartTotal}</strong> more to enjoy <strong>FREE Shipping</strong>
                                    </div>
                                    <div className="total-percent" style={{ height: '6px', marginTop: '5px' }}>
                                      <div className="percent" style={{ width: `${(cartTotal / 400) * 100}%` }}></div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}

                            <tr className="order-total">
                              <th>Total</th>
                              <td data-title="Total">
                                <strong>
                                  <span className="woocommerce-Price-amount amount">
                                    <span className="woocommerce-Price-currencySymbol">$</span>{grandTotal}
                                  </span>
                                </strong>
                              </td>
                            </tr>

                          </tbody>
                        </table>

                        <div className="wc-proceed-to-checkout">
                          <Link to="/checkout" className="checkout-button button alt wc-forward">
                            Proceed to checkout
                          </Link>
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

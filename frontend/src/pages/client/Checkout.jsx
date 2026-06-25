import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';
import { useCartStore } from '../../context/cartStore';

const API_BASE = '/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { cart, clearCart, getTotalPrice } = useCartStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const cartTotal = getTotalPrice();
  const shippingFee = cartTotal >= 400 ? 0 : 15;
  const grandTotal = cartTotal + shippingFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const { data } = await axios.post(
        `${API_BASE}/orders`,
        {
          ...formData,
          items: orderItems,
        },
        { headers }
      );

      clearCart();
      setOrderSuccess(data);
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred while creating order.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div id="site-main" className="site-main">
        <div id="main-content" className="main-content">
          <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: '#f5faf5', color: '#e0a96d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '25px', border: '2px solid #e0a96d' }}>
              <i className="fa fa-check"></i>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold' }}>Order Successful!</h2>
            <p style={{ color: '#555', marginTop: '10px', maxWidth: '500px' }}>
              Thank you for shopping at Mojuri. Your order has been placed successfully.
            </p>
            <div className="card p-4 my-4 text-left" style={{ minWidth: '350px', border: '1px solid #eee', background: '#fafafa', borderRadius: 0 }}>
              <div className="mb-2"><strong>Order ID:</strong> <span style={{ color: '#e0a96d', fontWeight: 'bold' }}>{orderSuccess.id}</span></div>
              <div className="mb-2"><strong>Recipient:</strong> {orderSuccess.name}</div>
              <div className="mb-2"><strong>Phone:</strong> {orderSuccess.phone}</div>
              <div className="mb-2"><strong>Shipping Address:</strong> {orderSuccess.address}</div>
              <div className="mb-0"><strong>Total amount Paid:</strong> <span style={{ color: '#e0a96d', fontWeight: 'bold' }}>${orderSuccess.totalPrice}</span></div>
            </div>
            <Link to="/shop" className="button btn-primary" style={{ padding: '12px 30px', fontWeight: 600 }}>CONTINUE SHOPPING</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div id="site-main" className="site-main">
        <div id="main-content" className="main-content">
          <div className="container py-5 text-center">
            <h2>No items in checkout.</h2>
            <Link to="/shop" className="button btn-primary mt-3">Back to shop</Link>
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
              <h1 className="text-title-heading">Checkout</h1>
            </div>
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
              <span className="delimiter"></span>
              <Link to="/cart">Cart</Link>
              <span className="delimiter"></span>
              Checkout
            </div>
          </div>
        </div>

        {/* Checkout Page Content */}
        <div id="content" className="site-content" role="main">
          <div className="section-padding">
            <div className="section-container p-l-r">
              <div className="shop-checkout">
                <form name="checkout" className="checkout woocommerce-checkout" onSubmit={handleSubmit}>
                  <div className="row">
                    
                    {/* Billing Details Fields */}
                    <div className="col-xl-7 col-lg-7 col-md-12 col-12 font-size-16 justify-content-between">
                      <div className="woocommerce-billing-fields">
                        <h3>Billing details</h3>
                        <div className="woocommerce-billing-fields__field-wrapper">
                          
                          <p className="form-row form-row-wide validate-required">
                            <label>Full name <abbr className="required" title="required">*</abbr></label>
                            <span className="input-wrapper">
                              <input 
                                type="text" 
                                className="input-text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                              />
                            </span>
                          </p>

                          <p className="form-row form-row-first validate-required validate-phone">
                            <label>Phone <abbr className="required" title="required">*</abbr></label>
                            <span className="input-wrapper">
                              <input 
                                type="tel" 
                                className="input-text" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                required 
                              />
                            </span>
                          </p>

                          <p className="form-row form-row-last validate-required validate-email">
                            <label>Email address <abbr className="required" title="required">*</abbr></label>
                            <span className="input-wrapper">
                              <input 
                                type="email" 
                                className="input-text" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                              />
                            </span>
                          </p>

                          <p className="form-row form-row-wide address-field validate-required">
                            <label>Shipping address <abbr className="required" title="required">*</abbr></label>
                            <span className="input-wrapper">
                              <textarea 
                                name="address" 
                                className="input-text" 
                                value={formData.address} 
                                onChange={handleChange} 
                                rows="3" 
                                required
                              />
                            </span>
                          </p>

                        </div>
                      </div>
                    </div>

                    {/* Order Review panel */}
                    <div className="col-xl-5 col-lg-5 col-md-12 col-12 m-t-md-40">
                      <div id="order_review" className="woocommerce-checkout-review-order">
                        <h3>Your order</h3>
                        <table className="shop_table woocommerce-checkout-review-order-table">
                          <thead>
                            <tr>
                              <th className="product-name">Product</th>
                              <th className="product-total">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cart.map((item) => {
                              const itemPrice = item.product.salePrice || item.product.price;
                              return (
                                <tr key={item.product.id} className="cart_item">
                                  <td className="product-name">
                                    {item.product.name}
                                    <strong className="product-quantity">× {item.quantity}</strong>
                                  </td>
                                  <td className="product-total">
                                    <span className="woocommerce-Price-amount amount">
                                      <span className="woocommerce-Price-currencySymbol">$</span>{itemPrice * item.quantity}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            
                            <tr className="cart-subtotal">
                              <th>Subtotal</th>
                              <td>
                                <span className="woocommerce-Price-amount amount">
                                  <span className="woocommerce-Price-currencySymbol">$</span>{cartTotal}
                                </span>
                              </td>
                            </tr>

                            <tr className="shipping">
                              <th>Shipping</th>
                              <td>
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

                            <tr className="order-total">
                              <th>Total</th>
                              <td>
                                <strong>
                                  <span className="woocommerce-Price-amount amount">
                                    <span className="woocommerce-Price-currencySymbol">$</span>{grandTotal}
                                  </span>
                                </strong>
                              </td>
                            </tr>

                          </tfoot>
                        </table>

                        {/* Payment Options */}
                        <div id="payment" className="woocommerce-checkout-payment">
                          <ul className="wc_payment_methods payment_methods methods">
                            <li className="wc_payment_method payment_method_cod">
                              <input 
                                type="radio" 
                                className="input-radio" 
                                name="payment_method" 
                                id="payment_method_cod" 
                                defaultChecked 
                              />
                              <label htmlFor="payment_method_cod">Cash on delivery (COD)</label>
                              <div className="payment_box payment_method_cod">
                                <p>Pay with cash upon delivery of your jewelry package.</p>
                              </div>
                            </li>
                          </ul>
                          
                          <div className="form-row place-order">
                            <button 
                              type="submit" 
                              disabled={loading} 
                              className="button alt" 
                              name="woocommerce_checkout_place_order" 
                              id="place_order"
                            >
                              {loading ? 'Processing...' : 'Place order'}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

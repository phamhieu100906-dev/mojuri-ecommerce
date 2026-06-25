import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = 'http://localhost:3000/api';

export default function MyOrders() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const fetchMyOrders = async () => {
    const { data } = await axios.get(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
    enabled: !!token,
  });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PROCESSING': return 'Đang chuẩn bị';
      case 'SHIPPED': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao hàng';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'PROCESSING': return 'bg-info text-white';
      case 'SHIPPED': return 'bg-primary text-white';
      case 'DELIVERED': return 'bg-success text-white';
      case 'CANCELLED': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  if (!token || !user) {
    return (
      <div id="site-main" className="site-main">
        <div id="main-content" className="main-content">
          <div className="container py-5 text-center" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <i className="icon-user mb-4" style={{ fontSize: '64px', color: '#ccc' }}></i>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold' }}>Bạn chưa đăng nhập</h2>
            <p style={{ color: '#777', marginTop: '10px' }}>Đăng nhập để xem lịch sử và tra cứu trạng thái đơn hàng của bạn.</p>
            <Link to="/login" className="button btn-primary mt-4" style={{ padding: '12px 30px', fontWeight: 600 }}>ĐĂNG NHẬP NGAY</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="site-main" className="site-main">
      <div id="main-content" className="main-content">
        
        {/* Breadcrumbs */}
        <div id="title" className="page-title" style={{ backgroundImage: "url('/media/site-header.jpg')" }}>
          <div className="section-container">
            <div className="content-title-heading">
              <h1 className="text-title-heading">Đơn hàng của tôi</h1>
            </div>
            <div className="breadcrumbs">
              <Link to="/">Trang chủ</Link>
              <span className="delimiter"></span>
              Đơn hàng của tôi
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div id="content" className="site-content" role="main">
          <div className="section-padding">
            <div className="section-container p-l-r">
              <div className="my-orders-page" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <h3 className="mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: 'bold' }}>Lịch sử mua hàng</h3>
                
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-dark" role="status">
                      <span className="sr-only">Đang tải...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">Đã xảy ra lỗi khi tải danh sách đơn hàng.</div>
                ) : orders && orders.length === 0 ? (
                  <div className="text-center py-5" style={{ background: '#fafafa', border: '1px solid #eee' }}>
                    <p className="text-muted mb-3">Bạn chưa thực hiện đơn đặt hàng nào.</p>
                    <Link to="/shop" className="button btn-primary btn-sm">Mua sắm ngay</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders && orders.map((order) => (
                      <div key={order.id} className="card mb-4 p-4 border-0 shadow-sm" style={{ background: '#fafafa', borderRadius: 0, border: '1px solid #eee' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2 border-bottom pb-2">
                          <div>
                            <span className="text-muted" style={{ fontSize: '11px' }}>MÃ ĐƠN HÀNG:</span>
                            <div style={{ fontWeight: 'bold', color: '#111' }}>{order.id}</div>
                          </div>
                          <div>
                            <span className="text-muted" style={{ fontSize: '11px', display: 'block', textAlign: 'right' }}>TRẠNG THÁI:</span>
                            <span className={`badge ${getStatusClass(order.status)}`}>{getStatusLabel(order.status)}</span>
                          </div>
                        </div>

                        <div className="row mb-3">
                          <div className="col-md-6">
                            <p className="mb-1" style={{ fontSize: '13px' }}><strong>Ngày đặt hàng:</strong> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                            <p className="mb-1" style={{ fontSize: '13px' }}><strong>Người nhận:</strong> {order.name}</p>
                            <p className="mb-1" style={{ fontSize: '13px' }}><strong>Số điện thoại:</strong> {order.phone}</p>
                          </div>
                          <div className="col-md-6">
                            <p className="mb-1" style={{ fontSize: '13px' }}><strong>Địa chỉ giao:</strong> {order.address}</p>
                            <p className="mb-1" style={{ fontSize: '13px' }}><strong>Hình thức thanh toán:</strong> COD (Thanh toán khi nhận hàng)</p>
                            <p className="mb-0" style={{ fontSize: '13px' }}><strong>Tổng giá trị:</strong> <span style={{ color: '#e0a96d', fontWeight: 'bold' }}>${order.totalPrice}</span></p>
                          </div>
                        </div>

                        <div className="items-box mt-3 border-top pt-3">
                          <h6 className="mb-2" style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Danh sách sản phẩm</h6>
                          <div className="table-responsive">
                            <table className="table table-sm table-borderless mb-0">
                              <tbody>
                                {order.items.map((item) => {
                                  const imageSrc = item.product.thumbnail.startsWith('http') ? item.product.thumbnail : `/${item.product.thumbnail}`;
                                  return (
                                    <tr key={item.id}>
                                      <td style={{ width: '50px', padding: '5px 0' }}>
                                        <img src={imageSrc} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover' }} onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} />
                                      </td>
                                      <td style={{ padding: '5px 10px', verticalAlign: 'middle' }}>
                                        <Link to={`/product/${item.product.id}`} style={{ color: '#111', fontWeight: 500, fontSize: '13px' }}>
                                          {item.product.name}
                                        </Link>
                                      </td>
                                      <td className="text-center" style={{ width: '100px', padding: '5px 0', verticalAlign: 'middle', fontSize: '13px' }}>
                                        x {item.quantity}
                                      </td>
                                      <td className="text-right" style={{ width: '120px', padding: '5px 0', verticalAlign: 'middle', fontWeight: 'bold', fontSize: '13px', color: '#e0a96d' }}>
                                        ${item.price * item.quantity}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = '/api';

export default function Orders() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchAdminOrders = async () => {
    const { data } = await axios.get(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrdersList'],
    queryFn: fetchAdminOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.put(`${API_BASE}/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminOrdersList']);
      if (selectedOrder && selectedOrder.id === data.id) {
        setSelectedOrder({ ...selectedOrder, status: data.status });
      }
      alert('Đã cập nhật trạng thái đơn hàng thành công!');
    },
    onError: (err) => {
      alert(err.response?.data?.error || 'Không thể cập nhật trạng thái.');
    }
  });

  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý';
      case 'PROCESSING': return 'Đang chuẩn bị';
      case 'SHIPPED': return 'Đang giao';
      case 'DELIVERED': return 'Đã giao';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'admin-badge badge-pending';
      case 'PROCESSING': return 'admin-badge badge-processing';
      case 'SHIPPED': return 'admin-badge badge-shipped';
      case 'DELIVERED': return 'admin-badge badge-delivered';
      case 'CANCELLED': return 'admin-badge badge-cancelled';
      default: return 'badge bg-secondary';
    }
  };

  return (
    <div>
      <h2 className="mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', fontSize: '32px' }}>Quản lý đơn hàng</h2>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          
          <div className="col-12 mb-4">
            <div className="admin-card p-3">
              <div className="table-responsive">
                <table className="admin-table align-middle" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Người nhận</th>
                      <th>Điện thoại</th>
                      <th>Ngày đặt hàng</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th className="text-center" style={{ width: '200px' }}>Cập nhật trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders && orders.map((order) => (
                      <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                        <td className="font-weight-bold" style={{ color: '#0f172a' }}>{order.id.slice(0, 8)}...</td>
                        <td>{order.name}</td>
                        <td>{order.phone}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td className="font-weight-bold" style={{ color: '#c5a880' }}>${order.totalPrice.toLocaleString()}</td>
                        <td>
                          <span className={getStatusBadgeClass(order.status)}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="form-select form-select-sm admin-form-control d-inline-block"
                            style={{ width: '150px', padding: '5px 10px !important', height: 'auto' }}
                          >
                            <option value="PENDING">Chờ xử lý</option>
                            <option value="PROCESSING">Đang chuẩn bị</option>
                            <option value="SHIPPED">Đang giao</option>
                            <option value="DELIVERED">Đã giao</option>
                            <option value="CANCELLED">Hủy đơn</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Details Panel popup */}
          {selectedOrder && (
            <div className="col-12 animate-fade-in">
              <div className="admin-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', letterSpacing: '0.5px' }}>
                    CHI TIẾT ĐƠN HÀNG: {selectedOrder.id}
                  </h4>
                  <button onClick={() => setSelectedOrder(null)} className="admin-btn-outline btn-sm" style={{ padding: '6px 15px' }}>Đóng</button>
                </div>
                
                <div className="row mb-4" style={{ fontSize: '13.5px', color: '#475569' }}>
                  <div className="col-md-6">
                    <p className="mb-2"><strong>Khách hàng:</strong> {selectedOrder.name}</p>
                    <p className="mb-2"><strong>Email:</strong> {selectedOrder.email}</p>
                    <p className="mb-2"><strong>Điện thoại:</strong> {selectedOrder.phone}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2"><strong>Địa chỉ giao:</strong> {selectedOrder.address}</p>
                    <p className="mb-2"><strong>Ngày đặt:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                    <p className="mb-2"><strong>Tổng thanh toán:</strong> <span style={{ color: '#c5a880', fontWeight: 'bold', fontSize: '15px' }}>${selectedOrder.totalPrice}</span></p>
                  </div>
                </div>

                <h5 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px', color: '#0f172a', letterSpacing: '0.5px' }}>Sản phẩm đã mua</h5>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle" style={{ fontSize: '13px' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá bán</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-right">Tạm tính</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => {
                        const imageSrc = item.product.thumbnail.startsWith('http') ? item.product.thumbnail : `/${item.product.thumbnail}`;
                        return (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={imageSrc} 
                                  alt="" 
                                  style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                                  onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} 
                                />
                                <span className="font-weight-bold" style={{ color: '#1e293b' }}>{item.product.name}</span>
                              </div>
                            </td>
                            <td>${item.price}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-right font-weight-bold" style={{ color: '#c5a880' }}>${item.price * item.quantity}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = 'http://localhost:3000/api';

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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'PROCESSING': return 'bg-info text-white';
      case 'SHIPPED': return 'bg-primary text-white';
      case 'DELIVERED': return 'bg-success text-white';
      case 'CANCELLED': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  };

  return (
    <div>
      <h2 className="mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold' }}>Quản lý đơn hàng</h2>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="sr-only">Đang tải...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          
          <div className="col-12 mb-4">
            <div className="card border-0 shadow-sm p-3 bg-white">
              <div className="table-responsive">
                <table className="table align-middle" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Người nhận</th>
                      <th>Điện thoại</th>
                      <th>Ngày đặt</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders && orders.map((order) => (
                      <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                        <td className="font-weight-bold text-truncate" style={{ maxWidth: '120px' }}>{order.id}</td>
                        <td>{order.name}</td>
                        <td>{order.phone}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td className="font-weight-bold" style={{ color: '#e0a96d' }}>${order.totalPrice}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="text-center" onClick={(e) => e.stopPropagation()}>
                          <select 
                            value={order.status} 
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="form-select form-select-sm"
                            style={{ width: '130px', display: 'inline-block' }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedOrder && (
            <div className="col-12">
              <div className="card border-0 shadow-sm p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>CHI TIẾT ĐƠN HÀNG: {selectedOrder.id}</h4>
                  <button onClick={() => setSelectedOrder(null)} className="btn btn-outline-secondary btn-sm">Đóng</button>
                </div>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Khách hàng:</strong> {selectedOrder.name}</p>
                    <p className="mb-1"><strong>Email:</strong> {selectedOrder.email}</p>
                    <p className="mb-1"><strong>Điện thoại:</strong> {selectedOrder.phone}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Địa chỉ giao:</strong> {selectedOrder.address}</p>
                    <p className="mb-1"><strong>Ngày tạo:</strong> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                    <p className="mb-1"><strong>Tổng tiền:</strong> <span style={{ color: '#e0a96d', fontWeight: 'bold' }}>${selectedOrder.totalPrice}</span></p>
                  </div>
                </div>

                <h5 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '15px' }}>Sản phẩm đã mua</h5>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
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
                                <img src={imageSrc} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }} onError={(e) => e.target.src = "https://html-demo-orcin.vercel.app/premium/mojuri/media/product/3.jpg"} />
                                <span>{item.product.name}</span>
                              </div>
                            </td>
                            <td>${item.price}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-right font-weight-bold">${item.price * item.quantity}</td>
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

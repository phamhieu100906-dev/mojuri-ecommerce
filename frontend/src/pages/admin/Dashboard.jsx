import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../../context/authStore';

const API_BASE = '/api';

export default function Dashboard() {
  const { token } = useAuthStore();

  const fetchStats = async () => {
    const { data } = await axios.get(`${API_BASE}/orders/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Đã xảy ra lỗi khi tải số liệu thống kê. Vui lòng kiểm tra quyền đăng nhập của bạn.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 'bold', fontSize: '32px' }}>Tổng quan hệ thống</h2>
      
      {/* Stat Cards Row */}
      <div className="row mb-5">
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="admin-card stat-card-gold p-4 border-0">
            <div className="text-muted text-uppercase mb-2" style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Doanh thu</div>
            <div className="h2 mb-0" style={{ fontWeight: 'bold', color: '#8c6d40', fontFamily: "'Cormorant Garamond', serif" }}>${stats.totalRevenue.toLocaleString()}</div>
            <small className="text-success mt-2 d-block" style={{ fontSize: '11px' }}><i className="fa fa-arrow-up mr-1"></i> (không tính đơn hủy)</small>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="admin-card stat-card-success p-4 border-0">
            <div className="text-muted text-uppercase mb-2" style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Tổng đơn hàng</div>
            <div className="h2 mb-0" style={{ fontWeight: 'bold', color: '#065f46', fontFamily: "'Cormorant Garamond', serif" }}>{stats.totalOrders}</div>
            <small className="text-muted mt-2 d-block" style={{ fontSize: '11px' }}>Tất cả trạng thái đơn hàng</small>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="admin-card stat-card-info p-4 border-0">
            <div className="text-muted text-uppercase mb-2" style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Tổng sản phẩm</div>
            <div className="h2 mb-0" style={{ fontWeight: 'bold', color: '#0f766e', fontFamily: "'Cormorant Garamond', serif" }}>{stats.totalProducts}</div>
            <small className="text-muted mt-2 d-block" style={{ fontSize: '11px' }}>Danh mục đang kinh doanh</small>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="admin-card stat-card-purple p-4 border-0">
            <div className="text-muted text-uppercase mb-2" style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Đã bán ra</div>
            <div className="h2 mb-0" style={{ fontWeight: 'bold', color: '#6b21a8', fontFamily: "'Cormorant Garamond', serif" }}>{stats.totalItemsSold}</div>
            <small className="text-muted mt-2 d-block" style={{ fontSize: '11px' }}>Tổng số sản phẩm bán ra</small>
          </div>
        </div>

      </div>

      <div className="row">
        {/* Revenue Table Chart card */}
        <div className="col-lg-8 mb-4">
          <div className="admin-card">
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a' }}>
              Biểu đồ doanh thu hàng ngày
            </h4>
            
            {stats.revenueChart.length === 0 ? (
              <div className="text-center py-5 text-muted" style={{ fontSize: '13px' }}>Chưa có dữ liệu giao dịch phát sinh.</div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Ngày giao dịch</th>
                      <th className="text-right">Doanh thu ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.revenueChart.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.date}</td>
                        <td className="text-right font-weight-bold" style={{ color: '#c5a880', fontSize: '15px' }}>
                          ${item.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Documentation Instructions Card */}
        <div className="col-lg-4 mb-4">
          <div className="admin-card" style={{ background: '#ffffff' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#0f172a' }}>
              Hướng dẫn quản trị
            </h4>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7' }}>
              Chào mừng bạn đến với trang quản trị <strong>Mojuri Jewelry Store</strong>.
              <br /><br />
              Sử dụng thanh điều hướng bên trái để thực hiện quản trị:
            </p>
            <ul style={{ fontSize: '13px', color: '#475569', paddingLeft: '20px', lineHeight: '1.8' }}>
              <li className="mb-2">Thêm mới, sửa thông tin, xóa các sản phẩm trang sức.</li>
              <li className="mb-2">Theo dõi và cập nhật trạng thái đơn hàng của khách hàng.</li>
              <li className="mb-2">Đăng bài viết chia sẻ kinh nghiệm chọn trang sức.</li>
              <li className="mb-2">Trả lời và cập nhật các liên hệ hỗ trợ từ khách hàng.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}

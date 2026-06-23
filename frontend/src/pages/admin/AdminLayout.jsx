import React, { useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="admin-container d-flex" style={{ minHeight: '100vh', background: '#f5f7fb' }}>
      
      <aside className="admin-sidebar bg-dark text-white p-3" style={{ width: '240px', flexShrink: 0 }}>
        <div className="text-center py-4 border-bottom border-secondary mb-4">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#e0a96d', margin: 0, fontWeight: 'bold' }}>Mojuri Admin</h2>
          <span style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Hệ thống quản trị</span>
        </div>
        
        <ul className="nav flex-column mb-auto" style={{ listStyle: 'none', padding: 0 }}>
          <li className="nav-item mb-2">
            <Link to="/admin" className="nav-link text-white py-2 px-3 d-block rounded" style={{ textDecoration: 'none', fontWeight: 600 }}>
              <i className="fa fa-dashboard mr-2"></i> Tổng quan
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/products" className="nav-link text-white py-2 px-3 d-block rounded" style={{ textDecoration: 'none', fontWeight: 600 }}>
              <i className="fa fa-diamond mr-2"></i> Sản phẩm
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/orders" className="nav-link text-white py-2 px-3 d-block rounded" style={{ textDecoration: 'none', fontWeight: 600 }}>
              <i className="fa fa-shopping-cart mr-2"></i> Đơn hàng
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/blogs" className="nav-link text-white py-2 px-3 d-block rounded" style={{ textDecoration: 'none', fontWeight: 600 }}>
              <i className="fa fa-newspaper-o mr-2"></i> Bài viết
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/contacts" className="nav-link text-white py-2 px-3 d-block rounded" style={{ textDecoration: 'none', fontWeight: 600 }}>
              <i className="fa fa-envelope mr-2"></i> Liên hệ
            </Link>
          </li>
        </ul>

        <div className="mt-5 pt-4 border-top border-secondary">
          <Link to="/" className="btn btn-outline-light btn-sm w-100 mb-2">
            <i className="fa fa-arrow-left mr-1"></i> Về trang bán hàng
          </Link>
        </div>
      </aside>

      <div className="admin-content-wrapper flex-grow-1 d-flex flex-column">
        <header className="bg-white py-3 px-4 border-bottom d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold" style={{ color: '#333', fontSize: '16px' }}>Hệ thống quản trị</h4>
          <div>
            <strong>{user.name}</strong> <span className="badge badge-warning ml-2" style={{ background: '#e0a96d', color: '#fff' }}>ADMIN</span>
          </div>
        </header>
        <main className="p-4" style={{ flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>

    </div>
  );
}

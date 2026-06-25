import React, { useEffect } from 'react';
import { Link, NavLink, useNavigate, Outlet } from 'react-router-dom';
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
    <div className="admin-container">
      
      <aside className="admin-sidebar">
        <div className="sidebar-logo text-center">
          <h2>Mojuri Admin</h2>
          <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Hệ thống quản trị</span>
        </div>
        
        <ul className="nav flex-column mb-auto mt-4" style={{ listStyle: 'none', padding: 0 }}>
          <li className="nav-item mb-1">
            <NavLink to="/admin" end className={({ isActive }) => "nav-link " + (isActive ? "active-link" : "")}>
              <i className="fa fa-dashboard"></i> Tổng quan
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink to="/admin/products" className={({ isActive }) => "nav-link " + (isActive ? "active-link" : "")}>
              <i className="fa fa-diamond"></i> Sản phẩm
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink to="/admin/orders" className={({ isActive }) => "nav-link " + (isActive ? "active-link" : "")}>
              <i className="fa fa-shopping-cart"></i> Đơn hàng
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink to="/admin/blogs" className={({ isActive }) => "nav-link " + (isActive ? "active-link" : "")}>
              <i className="fa fa-newspaper-o"></i> Bài viết
            </NavLink>
          </li>
          <li className="nav-item mb-1">
            <NavLink to="/admin/contacts" className={({ isActive }) => "nav-link " + (isActive ? "active-link" : "")}>
              <i className="fa fa-envelope"></i> Liên hệ
            </NavLink>
          </li>
        </ul>

        <div className="mt-auto p-4 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
          <Link to="/" className="btn btn-outline-light btn-sm w-100" style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '12px', background: 'transparent' }}>
            <i className="fa fa-arrow-left mr-1"></i> Về trang bán hàng
          </Link>
        </div>
      </aside>

      <div className="admin-content-wrapper flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <header className="admin-header d-flex justify-content-between align-items-center">
          <h4 className="m-0 font-weight-bold" style={{ color: '#0f172a', fontSize: '15px', letterSpacing: '0.5px' }}>Bảng Điều Khiển Hệ Thống</h4>
          <div style={{ fontSize: '13px' }}>
            Chào, <strong style={{ color: '#1e293b' }}>{user.name}</strong> 
            <span className="badge ml-2" style={{ background: '#c5a880', color: '#fff', padding: '5px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>ADMIN</span>
          </div>
        </header>
        <main className="p-4 flex-grow-1 animate-fade-in">
          <Outlet />
        </main>
      </div>

    </div>
  );
}

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      {/* 사이드바 */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-badge">관</div>
          <div>
            <div className="sidebar-title">수작업팩토리</div>
            <div className="sidebar-sub">관리자</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/admin/inquiries" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
            <span className="nav-icon">📋</span>
            <span>견적 문의 관리</span>
          </NavLink>
          <a href="/" target="_blank" className="nav-item">
            <span className="nav-icon">🌐</span>
            <span>메인 사이트 보기</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

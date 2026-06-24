import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '5267';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_auth', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('비밀번호가 올바르지 않습니다.');
        setPassword('');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-badge">관</div>
          <h1>수작업팩토리</h1>
          <p>관리자 페이지</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호 입력"
              autoFocus
              required
            />
          </div>

          {error && <div className="login-error">⚠️ {error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>

        <p className="login-back">
          <a href="/">← 메인 사이트로 돌아가기</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

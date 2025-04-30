import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Kiểm tra thông tin đăng nhập
    if (username === 'admin' && password === 'admin123') {
      // Lưu thông tin đăng nhập
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('username', username);
      
      // Chuyển hướng đến trang admin
      navigate('/admin');
    } else if (username === 'user' && password === 'user123') {
      // Lưu thông tin đăng nhập cho user thường
      localStorage.setItem('token', 'user-token');
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('username', username);
      
      // Chuyển hướng đến trang chủ
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="login-info">
          <p>Demo accounts:</p>
          <p>Admin: username: admin, password: admin123</p>
          <p>User: username: user, password: user123</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 
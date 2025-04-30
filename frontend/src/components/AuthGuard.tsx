import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Kiểm tra xem người dùng có phải là admin không
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, chuyển hướng về trang login
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Nếu không phải admin, chuyển hướng về trang chủ
    return <Navigate to="/" replace />;
  }

  // Nếu đã đăng nhập và là admin, hiển thị nội dung
  return <>{children}</>;
};

export default AuthGuard; 
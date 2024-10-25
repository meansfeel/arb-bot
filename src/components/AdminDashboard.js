import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function AdminDashboard() {
  const { user } = useContext(AuthContext);

  if (user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  // 管理员面板的内容
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* 添加管理员功能 */}
    </div>
  );
}

export default AdminDashboard;
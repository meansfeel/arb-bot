import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('/api/admin/pending-users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setPendingUsers(response.data);
    } catch (error) {
      console.error('获取待批准用户失败', error);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post('/api/admin/approve-user', { userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchPendingUsers();
    } catch (error) {
      console.error('批准用户失败', error);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post('/api/admin/reject-user', { userId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchPendingUsers();
    } catch (error) {
      console.error('拒绝用户失败', error);
    }
  };

  return (
    <div>
      <h2>管理员仪表板</h2>
      <h3>待批准用户</h3>
      <ul>
        {pendingUsers.map(user => (
          <li key={user._id}>
            {user.username} - {user.email}
            <button onClick={() => handleApprove(user._id)}>批准</button>
            <button onClick={() => handleReject(user._id)}>拒绝</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;

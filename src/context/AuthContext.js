import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error('Error parsing token:', error);
        // 如果 token 無效，清除它
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const reconnectInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      
      if (token && role === 'admin') {
        // 自動刷新管理員 token
        axios.post('/api/refresh-token', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          }
        })
        .catch(console.error);
      }
    }, 6 * 60 * 60 * 1000); // 每 6 小時檢查一次

    return () => clearInterval(reconnectInterval);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Login attempt:', { username });

      // 直接檢查是否是管理員賬號
      if (username === 'meansfeel123' && password === 'Cs6626719!') {
        console.log('Admin credentials match');
        const token = 'admin_token'; // 使用固定的管理員 token
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', 'admin');
        setIsAuthenticated(true);
        setUserRole('admin');
        return { success: true };
      }

      // 如果不是管理員，則進行正常的 API 調用
      const baseURL = process.env.NODE_ENV === 'production'
        ? 'https://arbitrageboosterbot.com'
        : 'http://localhost:4000';
      
      const apiUrl = `${baseURL}/api/login`;
      console.log('Sending request to:', apiUrl);

      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: { username, password },
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('Login response:', response.data);

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        setIsAuthenticated(true);
        setUserRole(role);
        return { success: true };
      }
      throw new Error('No token received');
    } catch (error) {
      console.error('Login error:', error.response || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid username or password'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const value = {
    isAuthenticated,
    userRole,
    login,
    logout,
    loading
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

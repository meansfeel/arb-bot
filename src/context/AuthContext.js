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
      // 從 token 中解析用戶角色
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username,
        password
      });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUserRole(role);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
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
    return <div>Loading...</div>; // 或者使用一個加載動畫組件
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

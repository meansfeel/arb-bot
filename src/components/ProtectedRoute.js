import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <CircularProgress />;
  }

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
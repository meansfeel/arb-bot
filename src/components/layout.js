import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { AuthContext } from '../context/AuthContext';
import ConnectWallet from './ConnectWallet'; // 导入 ConnectWallet 组件

function Layout({ children }) {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user && user.role === 'admin'; // 假设用户对象中有一个 role 字段

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Arbitrage Booster Bot
          </Typography>
          {isLoggedIn ? (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
              <Button color="inherit" component={RouterLink} to="/auto-trader">Auto Trader</Button>
              <Button color="inherit" component={RouterLink} to="/simulated-trader">Simulated Trader</Button>
              {isAdmin && (
                <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>
              )}
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </>
          )}
          <ConnectWallet /> {/* 在导航栏中添加 ConnectWallet 组件 */}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3, flexGrow: 1 }}>
        {children}
      </Box>
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[200] }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Arbitrage Booster Bot
        </Typography>
      </Box>
    </Box>
  );
}

export default Layout;

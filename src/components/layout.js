import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AuthContext } from '../context/AuthContext';
import ConnectWallet from './ConnectWallet';
import { useTheme } from '@mui/material/styles';

function Layout({ children, toggleTheme }) {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user && user.role === 'admin';

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
              <ConnectWallet />
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </>
          )}
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
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

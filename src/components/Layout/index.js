import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children, toggleTheme }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, logout, userRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Arbitrage Booster Bot
          </Typography>
          
          {isAuthenticated && (
            <>
              <IconButton 
                sx={{ ml: 1 }} 
                onClick={toggleTheme} 
                color="inherit"
              >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              
              <IconButton
                color="inherit"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </IconButton>
              
              {userRole === 'admin' && (
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </IconButton>
              )}
              
              <IconButton
                color="inherit"
                onClick={handleLogout}
              >
                Logout
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3,
        backgroundColor: theme.palette.background.default
      }}>
        {children}
      </Box>

      <Box component="footer" sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.background.paper
      }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Arbitrage Booster Bot. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;

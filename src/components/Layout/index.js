import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  AdminPanelSettings as AdminIcon,
  AutoGraph as AutoTraderIcon,
  Analytics as SimulatedTraderIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConnectWalletDialog from '../ConnectWalletDialog';

const Layout = ({ children, toggleTheme }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, logout, userRole } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleConnectWallet = () => {
    if (walletConnected) {
      // 如果已連接，顯示錢包地址或其他操作
      return;
    }
    setWalletDialogOpen(true);
  };

  const handleWalletConnect = (address) => {
    setWalletAddress(address);
    setWalletConnected(true);
    // 可以在這裡添加其他連接後的邏輯
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      show: isAuthenticated
    },
    {
      text: 'Auto Trader',
      icon: <AutoTraderIcon />,
      path: '/auto-trader',
      show: isAuthenticated
    },
    {
      text: 'Simulated Trader',
      icon: <SimulatedTraderIcon />,
      path: '/simulated-trader',
      show: isAuthenticated
    },
    {
      text: 'Admin Panel',
      icon: <AdminIcon />,
      path: '/admin',
      show: isAuthenticated && userRole === 'admin'
    },
    {
      text: 'Profile',
      icon: <AccountIcon />,
      path: '/profile',
      show: isAuthenticated
    }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isAuthenticated && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Arbitrage Booster Bot
          </Typography>

          {isAuthenticated && (
            <>
              <Tooltip title={walletConnected ? walletAddress : "Connect Wallet"}>
                <Button
                  color="inherit"
                  startIcon={<WalletIcon />}
                  onClick={handleConnectWallet}
                  sx={{ mr: 2 }}
                >
                  {walletConnected ? 'Connected' : 'Connect Wallet'}
                </Button>
              </Tooltip>

              <IconButton 
                color="inherit"
                onClick={toggleTheme}
                sx={{ mr: 1 }}
              >
                {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {isAuthenticated && (
        <Drawer
          variant="persistent"
          anchor="left"
          open={drawerOpen}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
              top: ['48px', '56px', '64px'],
              height: 'auto',
              bottom: 0,
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {menuItems.filter(item => item.show).map((item) => (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => {
                    navigate(item.path);
                    setDrawerOpen(false);
                  }}
                  sx={{
                    backgroundColor: 
                      window.location.pathname === item.path
                        ? theme.palette.action.selected
                        : 'transparent'
                  }}
                >
                  <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: ['48px', '56px', '64px'],
          ml: isAuthenticated && drawerOpen ? '240px' : 0,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {children}
      </Box>

      <ConnectWalletDialog
        open={walletDialogOpen}
        onClose={() => setWalletDialogOpen(false)}
        onConnect={handleWalletConnect}
      />
    </Box>
  );
};

export default Layout;

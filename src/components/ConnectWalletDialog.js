import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";

const ConnectWalletDialog = ({ open, onClose, onConnect }) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);

  const wallets = [
    { id: 'metamask', name: 'MetaMask', icon: '/metamask-icon.png' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '/walletconnect-icon.png' }
  ];

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.REACT_APP_INFURA_ID
      }
    }
  };

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions
  });

  const handleConnect = async (walletId) => {
    setConnecting(true);
    setError('');
    setSelectedWallet(walletId);

    try {
      let provider;
      
      if (walletId === 'metamask') {
        if (typeof window.ethereum !== 'undefined') {
          provider = window.ethereum;
          const accounts = await provider.request({
            method: 'eth_requestAccounts'
          });
          
          const chainId = await provider.request({ 
            method: 'eth_chainId' 
          });
          
          if (chainId !== '0x1' && chainId !== '0x5') {
            throw new Error('Please connect to Ethereum Mainnet or Goerli Testnet');
          }

          const web3 = new Web3(provider);
          const balance = await web3.eth.getBalance(accounts[0]);
          const ethBalance = web3.utils.fromWei(balance, 'ether');

          onConnect({
            address: accounts[0],
            balance: ethBalance,
            provider: provider,
            web3: web3
          });
          onClose();
        } else {
          throw new Error('MetaMask is not installed');
        }
      } else if (walletId === 'walletconnect') {
        provider = await web3Modal.connectTo("walletconnect");
        
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();

        if (chainId !== 1 && chainId !== 5) {
          throw new Error('Please connect to Ethereum Mainnet or Goerli Testnet');
        }

        const balance = await web3.eth.getBalance(accounts[0]);
        const ethBalance = web3.utils.fromWei(balance, 'ether');

        provider.on("accountsChanged", (accounts) => {
          onConnect({
            address: accounts[0],
            balance: ethBalance,
            provider: provider,
            web3: web3
          });
        });

        provider.on("chainChanged", (chainId) => {
          window.location.reload();
        });

        provider.on("disconnect", (error) => {
          web3Modal.clearCachedProvider();
          window.location.reload();
        });

        onConnect({
          address: accounts[0],
          balance: ethBalance,
          provider: provider,
          web3: web3
        });
        onClose();
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <WalletIcon sx={{ mr: 1 }} />
          Connect Wallet
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Connect your wallet to access the Arbitrage Booster Bot features.
        </Typography>

        <List>
          {wallets.map((wallet) => (
            <React.Fragment key={wallet.id}>
              <ListItem
                button
                onClick={() => handleConnect(wallet.id)}
                disabled={connecting}
                selected={selectedWallet === wallet.id}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <img 
                    src={wallet.icon} 
                    alt={wallet.name}
                    style={{ width: 32, height: 32 }}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={wallet.name}
                  secondary={
                    connecting && selectedWallet === wallet.id 
                      ? 'Connecting...' 
                      : `Connect using ${wallet.name}`
                  }
                />
                {connecting && selectedWallet === wallet.id && (
                  <CircularProgress size={24} sx={{ ml: 1 }} />
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ mt: 2 }}>
          <Typography 
            variant="caption" 
            color="text.secondary"
            display="flex"
            alignItems="center"
          >
            <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
            Make sure you are connecting to the correct network
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectWalletDialog;

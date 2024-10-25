import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Button, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AuthContext } from '../context/AuthContext';

function ConnectWallet() {
  const { isLoggedIn } = useContext(AuthContext);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [open, setOpen] = useState(false);

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      }
    }
  });

  const connectWallet = useCallback(async () => {
    if (!isLoggedIn) {
      alert("Please log in to connect your wallet.");
      return;
    }

    try {
      const instance = await web3Modal.connect();
      const newProvider = new ethers.BrowserProvider(instance);
      const signer = await newProvider.getSigner();
      const address = await signer.getAddress();
      const balance = await newProvider.getBalance(address);
      const network = await newProvider.getNetwork();

      setProvider(newProvider);
      setAccount(address);
      setBalance(ethers.formatEther(balance));
      setChainId(network.chainId);
      setOpen(true);
    } catch (error) {
      console.error("Could not connect to wallet", error);
    }
  }, [isLoggedIn]);

  const disconnectWallet = useCallback(async () => {
    if (provider?.disconnect) {
      await provider.disconnect();
    }
    await web3Modal.clearCachedProvider();
    setAccount(null);
    setBalance(null);
    setChainId(null);
    setProvider(null);
  }, [provider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [connectWallet]);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0]);
      };

      const handleChainChanged = (chainId) => {
        setChainId(chainId);
      };

      const handleDisconnect = () => {
        disconnectWallet();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider, disconnectWallet]);

  return (
    <Box sx={{ mt: 2 }}>
      {isLoggedIn ? (
        account ? (
          <Button variant="contained" color="secondary" onClick={disconnectWallet}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )
      ) : (
        <Button variant="contained" color="primary" disabled>
          Login to Connect Wallet
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Wallet Connected</DialogTitle>
        <DialogContent>
          <Typography>Address: {account}</Typography>
          <Typography>Balance: {balance} ETH</Typography>
          <Typography>Chain ID: {chainId}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ConnectWallet;

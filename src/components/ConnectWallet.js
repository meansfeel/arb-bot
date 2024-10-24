import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Button, Typography, Box } from '@mui/material';

function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    } else {
      console.error('MetaMask not detected');
    }
  }, []);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        const balanceWei = await web3.eth.getBalance(accounts[0]);
        setBalance(web3.utils.fromWei(balanceWei, 'ether'));
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {account ? `Connected account: ${account}` : 'Please connect your MetaMask wallet'}
      </Typography>
      {balance !== null && <Typography variant="body1">Balance: {balance} ETH</Typography>}
      <Button variant="contained" color="primary" onClick={connectWallet} disabled={!!account}>
        {account ? 'Connected' : 'Connect Wallet'}
      </Button>
      <Button variant="contained" color="secondary" onClick={disconnectWallet} disabled={!account}>
        Disconnect
      </Button>
    </Box>
  );
}

export default ConnectWallet;

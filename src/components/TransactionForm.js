import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';

function TransactionForm() {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contract/execute`, {
        toAddress,
        amount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Transaction successful: ' + response.data.receipt.transactionHash);
    } catch (error) {
      setError('Transaction failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Send Transaction
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="toAddress"
        label="To Address"
        name="toAddress"
        autoComplete="toAddress"
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="amount"
        label="Amount (ETH)"
        type="number"
        id="amount"
        autoComplete="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Transaction'}
      </Button>
    </Box>
  );
}

export default TransactionForm;

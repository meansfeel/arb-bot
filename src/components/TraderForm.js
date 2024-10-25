import React, { useState } from 'react';
import { TextField, Select, MenuItem, Button, Box, Typography } from '@mui/material';

const chains = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'binance', label: 'Binance Smart Chain' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'avalanche', label: 'Avalanche' },
  { value: 'solana', label: 'Solana' },
];

const coins = [
  { value: 'BTC', label: 'Bitcoin' },
  { value: 'ETH', label: 'Ethereum' },
  { value: 'USDT', label: 'Tether' },
  { value: 'BNB', label: 'Binance Coin' },
  { value: 'ADA', label: 'Cardano' },
];

function TraderForm({ onSubmit, type }) {
  const [amount, setAmount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [coin, setCoin] = useState('BTC');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ amount, quantity, chain, coin });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {type === 'simulated' ? 'Simulated Trade' : 'Auto Trade'}
      </Typography>
      <TextField
        fullWidth
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        margin="normal"
        required
      />
      <Select
        fullWidth
        value={chain}
        onChange={(e) => setChain(e.target.value)}
        margin="normal"
      >
        {chains.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <Select
        fullWidth
        value={coin}
        onChange={(e) => setCoin(e.target.value)}
        margin="normal"
      >
        {coins.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        {type === 'simulated' ? 'Start Simulation' : 'Start Auto Trading'}
      </Button>
    </Box>
  );
}

export default TraderForm;
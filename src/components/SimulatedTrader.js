import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, Grid } from '@mui/material';

function SimulatedTrader() {
  const [trades, setTrades] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        // 模拟获取交易数据
        const newTrade = {
          id: trades.length + 1,
          action: Math.random() > 0.5 ? 'Buy' : 'Sell',
          amount: (Math.random() * 10).toFixed(2),
          price: (Math.random() * 1000).toFixed(2),
          timestamp: new Date().toLocaleTimeString()
        };
        setTrades((prevTrades) => [newTrade, ...prevTrades]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRunning, trades]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Simulated Trader
        </Typography>
        <Button variant="contained" color="primary" onClick={handleStart} disabled={isRunning}>
          Start Simulation
        </Button>
        <Button variant="contained" color="secondary" onClick={handleStop} disabled={!isRunning} sx={{ ml: 2 }}>
          Stop Simulation
        </Button>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {trades.map((trade) => (
            <Grid item xs={12} key={trade.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="body1">
                  {trade.timestamp} - {trade.action} {trade.amount} at ${trade.price}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}

export default SimulatedTrader;

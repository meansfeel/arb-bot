import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Grid, Button } from '@mui/material';
import TraderForm from './TraderForm';

function SimulatedTrader() {
  const [trades, setTrades] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [tradeInfo, setTradeInfo] = useState(null);

  useEffect(() => {
    if (isRunning && tradeInfo) {
      const interval = setInterval(() => {
        const newTrade = {
          id: trades.length + 1,
          action: Math.random() > 0.5 ? 'Buy' : 'Sell',
          amount: (Math.random() * parseFloat(tradeInfo.amount)).toFixed(2),
          price: (Math.random() * 1000).toFixed(2),
          timestamp: new Date().toLocaleTimeString(),
          coin: tradeInfo.coin,
          chain: tradeInfo.chain
        };
        setTrades((prevTrades) => [newTrade, ...prevTrades]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRunning, trades, tradeInfo]);

  const handleSubmit = (formData) => {
    console.log('Simulated trade started:', formData);
    setTradeInfo(formData);
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
        <TraderForm onSubmit={handleSubmit} type="simulated" />
        {isRunning && (
          <Button variant="contained" color="secondary" onClick={handleStop} sx={{ mt: 2 }}>
            Stop Simulation
          </Button>
        )}
        {isRunning && tradeInfo && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Simulated Trades for {tradeInfo.coin} on {tradeInfo.chain}
            </Typography>
            <Grid container spacing={2}>
              {trades.map((trade) => (
                <Grid item xs={12} key={trade.id}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="body1">
                      {trade.timestamp} - {trade.action} {trade.amount} {tradeInfo.coin} at ${trade.price}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default SimulatedTrader;

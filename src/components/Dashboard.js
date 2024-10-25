import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Typography, Box, Paper, Grid, Card, CardContent, CircularProgress, Alert, Button, useTheme, useMediaQuery, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';

function Dashboard() {
  const [arbitrageData, setArbitrageData] = useState([]);
  const [exchangeData, setExchangeData] = useState([]);
  const [marketPricesData, setMarketPricesData] = useState({ cex: [], dex: [] });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [arbitrageBotData, setArbitrageBotData] = useState({ cex: [], dex: [] });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      if (!token) {
        setError('No token found. Please log in.');
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      console.log('Fetching data from:', process.env.REACT_APP_BACKEND_URL);
      const [arbitrageResponse, exchangeResponse, marketPricesResponse, arbitrageBotResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/arbitrage`, config),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/exchanges`, config),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/market-prices`, config),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/arbitrage-bot`, config)
      ]);
      
      console.log('Arbitrage data:', arbitrageResponse.data);
      console.log('Exchange data:', exchangeResponse.data);
      console.log('Market prices data:', marketPricesResponse.data);
      console.log('Arbitrage bot data:', arbitrageBotResponse.data);

      setArbitrageData(arbitrageResponse.data);
      setExchangeData(exchangeResponse.data);
      setMarketPricesData(marketPricesResponse.data);
      setArbitrageBotData(arbitrageBotResponse.data);
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setError('Error fetching data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              CEX Market Prices
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exchange</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marketPricesData.cex.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.exchange}</TableCell>
                      <TableCell>{item.symbol}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              DEX Market Prices
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Exchange</TableCell>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marketPricesData.dex.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.exchange}</TableCell>
                      <TableCell>{item.symbol}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Connected Exchanges
            </Typography>
            <Grid container spacing={2}>
              {exchangeData.length > 0 ? (
                exchangeData.map((exchange, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{exchange.name}</Typography>
                        <Typography variant="body2">Type: {exchange.type}</Typography>
                        <Typography variant="body2">Last Updated: {new Date(exchange.lastUpdated).toLocaleString()}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">No exchange data available</Alert>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
        {arbitrageData.length > 0 ? (
          arbitrageData.map((opportunity, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {opportunity.exchange1} to {opportunity.exchange2}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h5" component="div">
                      {opportunity.profitPercentage}%
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">No arbitrage opportunities available</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              CEX Arbitrage Bot Activities
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Pair</TableCell>
                    <TableCell>Profit</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arbitrageBotData.cex.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.from}</TableCell>
                      <TableCell>{item.to}</TableCell>
                      <TableCell>{item.pair}</TableCell>
                      <TableCell>{item.profit}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              DEX Arbitrage Bot Activities
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>To</TableCell>
                    <TableCell>Pair</TableCell>
                    <TableCell>Profit</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arbitrageBotData.dex.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.from}</TableCell>
                      <TableCell>{item.to}</TableCell>
                      <TableCell>{item.pair}</TableCell>
                      <TableCell>{item.profit}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Paper, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function Dashboard() {
  const [arbitrageData, setArbitrageData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArbitrageData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setIsLoading(false);
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/arbitrage`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setArbitrageData(response.data);
      } catch (error) {
        setError('Error fetching arbitrage data: ' + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    };

    fetchArbitrageData();
  }, []);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {arbitrageData.map((opportunity, index) => (
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
                <Typography variant="body2" color="text.secondary">
                  Volume: {opportunity.volume}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time: {opportunity.time}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;

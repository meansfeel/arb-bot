import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [arbitrageData, setArbitrageData] = useState([]);

  useEffect(() => {
    const fetchArbitrageData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/arbitrage`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setArbitrageData(response.data);
      } catch (error) {
        console.error('Error fetching arbitrage data:', error);
      }
    };

    fetchArbitrageData();
  }, []);

  return (
    <div>
      <h2>Arbitrage Opportunities</h2>
      <ul>
        {arbitrageData.map((opportunity, index) => (
          <li key={index}>
            {opportunity.exchange1} to {opportunity.exchange2}: {opportunity.profitPercentage}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
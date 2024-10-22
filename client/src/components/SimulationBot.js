import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SimulationBot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSimulationResults();
  }, []);

  const fetchSimulationResults = async () => {
    try {
      const response = await axios.get('/api/simulation/results', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsRunning(response.data.running);
      setResults(response.data.results);
    } catch (error) {
      setError('获取模拟结果失败');
    }
  };

  const toggleSimulation = async () => {
    try {
      setError('');
      const endpoint = isRunning ? '/api/simulation/stop' : '/api/simulation/start';
      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsRunning(!isRunning);
      if (!isRunning) {
        setResults(null);
      } else {
        setResults(response.data.results);
      }
    } catch (error) {
      setError(`${isRunning ? '停止' : '启动'}模拟失败: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <h2>模拟交易机器人</h2>
      <button onClick={toggleSimulation}>
        {isRunning ? '停止模拟' : '开始模拟'}
      </button>
      {isRunning && <p>模拟正在运行中...</p>}
      {results && (
        <div>
          <h3>模拟结果</h3>
          <p>盈利: {results.profit.toFixed(2)} USDT</p>
          <p>交易次数: {results.tradeCount}</p>
        </div>
      )}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default SimulationBot;

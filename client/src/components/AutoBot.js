import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutoBot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBotStatus();
  }, []);

  const fetchBotStatus = async () => {
    try {
      const response = await axios.get('/api/bot/status', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsRunning(response.data.status === '运行中');
      setStatus(response.data.status);
    } catch (error) {
      setError('获取机器人状态失败');
    }
  };

  const toggleBot = async () => {
    try {
      setError('');
      const endpoint = isRunning ? '/api/bot/stop' : '/api/bot/start';
      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsRunning(!isRunning);
      setStatus(isRunning ? '已停止' : '运行中');
    } catch (error) {
      setError(`${isRunning ? '停止' : '启动'}机器人失败: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <h2>自动交易机器人</h2>
      <p>状态: {status}</p>
      <button onClick={toggleBot}>
        {isRunning ? '停止机器人' : '启动机器人'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
};

export default AutoBot;

const express = require('express');
const router = express.Router();
const { getPrice } = require('../services/exchangeService');
const auth = require('../middleware/auth');

let simulationRunning = false;
let simulationInterval;
let simulationResults = { profit: 0, tradeCount: 0 };

const runSimulation = async () => {
  try {
    const btcPrice = await getPrice('BTCUSDT');
    const ethPrice = await getPrice('ETHUSDT');

    // 模拟套利逻辑
    if (btcPrice / ethPrice > 15) {
      simulationResults.tradeCount++;
      const theoreticalProfit = (btcPrice - 15 * ethPrice) * 0.066; // 假设交易0.066 BTC
      simulationResults.profit += theoreticalProfit;
    }
  } catch (error) {
    console.error('模拟运行错误:', error);
  }
};

router.post('/start', auth, async (req, res) => {
  if (simulationRunning) {
    return res.status(400).json({ message: '模拟已经在运行中' });
  }

  simulationRunning = true;
  simulationResults = { profit: 0, tradeCount: 0 };
  simulationInterval = setInterval(runSimulation, 10000); // 每10秒运行一次
  res.json({ message: '模拟已启动' });
});

router.post('/stop', auth, async (req, res) => {
  if (!simulationRunning) {
    return res.status(400).json({ message: '模拟未在运行' });
  }

  clearInterval(simulationInterval);
  simulationRunning = false;
  res.json({ message: '模拟已停止', results: simulationResults });
});

router.get('/results', auth, (req, res) => {
  res.json({ running: simulationRunning, results: simulationResults });
});

module.exports = router;

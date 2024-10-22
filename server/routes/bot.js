const express = require('express');
const router = express.Router();
const { getPrice, executeTrade } = require('../services/exchangeService');
const { collectFee } = require('../services/feeService');
const auth = require('../middleware/auth');
const logger = require('../services/logger');

let botRunning = false;
let botInterval;

const runBot = async (userId) => {
  try {
    const btcPrice = await getPrice('BTCUSDT');
    const ethPrice = await getPrice('ETHUSDT');

    // 简单的套利逻辑，实际情况可能更复杂
    if (btcPrice / ethPrice > 15) { // 假设这是一个套利机会
      const buyResult = await executeTrade('ETHUSDT', 'BUY', 1);
      const sellResult = await executeTrade('BTCUSDT', 'SELL', 0.066); // 假设1 BTC = 15 ETH

      // 收取费用
      await collectFee(buyResult.executedQty * ethPrice, userId);

      logger.info('套利交易执行成功', { userId, buyResult, sellResult });
    }
  } catch (error) {
    logger.error('机器人运行错误', { userId, error: error.message });
  }
};

router.post('/start', auth, async (req, res) => {
  if (botRunning) {
    return res.status(400).json({ message: '机器人已经在运行中' });
  }

  botRunning = true;
  botInterval = setInterval(() => runBot(req.userId), 60000); // 每分钟运行一次
  res.json({ message: '机器人已启动' });
});

router.post('/stop', auth, async (req, res) => {
  if (!botRunning) {
    return res.status(400).json({ message: '机器人未在运行' });
  }

  clearInterval(botInterval);
  botRunning = false;
  res.json({ message: '机器人已停止' });
});

router.get('/status', auth, (req, res) => {
  res.json({ status: botRunning ? '运行中' : '已停止' });
});

module.exports = router;

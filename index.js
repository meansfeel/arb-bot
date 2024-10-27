const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const path = require('path');

dotenv.config();

// 用户模型定义（修改现有的 userSchema）
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// isAdmin 中间件
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status', error: error.message });
  }
};

const app = express();

// CORS 配置
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://arbitrageboosterbot.com',
      'http://localhost:3001',
      'http://localhost:4000'
    ];
    // 允許來自允許列表的請求或者沒有 origin 的請求（比如移動應用）
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 確保路由順序正確
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 路由放在靜態文件服務之前
app.use('/api', require('./routes/api'));

// 添加 OPTIONS 請求處理
app.options('*', cors());

// 添加請求日誌中間件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST') {
    console.log('Body:', req.body);
  }
  next();
});

// 添加 X-Content-Type-Options 头部
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// 添加 Cache-Control 头部
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  next();
});

// 配置 logger
const logger = winston.createLogger({
  // ... logger 配置保持不变
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// 将 MongoDB 连接移到这里
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    logger.info('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err);
    logger.error('Could not connect to MongoDB', { error: err.message });
  });

const PORT = process.env.PORT || 4000;

// ... 其余代码保持不变

// 受保护的路由
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Received token:', token);
  if (token == null) {
    console.log('No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Invalid token:', err);
      return res.sendStatus(403);
    }
    console.log('Token verified, user:', user);
    req.user = user;
    next();
  });
};

// 注册路
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    logger.info(`User registered successfully: ${username}`);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    logger.error('Error registering user', { error: error.message });
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});
// 添加用户
app.post('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    logger.error('Error adding user', { error: error.message });
    res.status(500).json({ message: 'Error adding user', error: error.message });
  }
});
// 登录路由
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username });

    // 預設管理員賬戶檢查
    if (username === 'meansfeel123' && password === 'Cs6626719!') {
      console.log('Admin login successful');
      const token = jwt.sign(
        { 
          userId: 'admin_user',
          role: 'admin',
          username: 'meansfeel123'
        }, 
        process.env.JWT_SECRET || '1234567890',
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        role: 'admin',
        message: 'Admin login successful'
      });
    }

    // 一般用戶登入邏輯
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for user:', username);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role,
        username: user.username
      }, 
      process.env.JWT_SECRET || '1234567890',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', username);
    res.json({ 
      token, 
      role: user.role,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message
    });
  }
});

// 添加套利路由
app.get('/api/arbitrage', authenticateToken, (req, res) => {
  console.log('Received request for arbitrage data');
  const arbitrageData = [
    { exchange1: 'Binance', exchange2: 'Coinbase', profitPercentage: 1.5 },
    { exchange1: 'Kraken', exchange2: 'Bitfinex', profitPercentage: 0.8 },
  ];
  res.json(arbitrageData);
});

// 添加交易所路由
app.get('/api/exchanges', authenticateToken, (req, res) => {
  console.log('Received request for exchanges data');
  const exchangesData = [
    { name: 'Binance', type: 'CEX', lastUpdated: new Date().toISOString() },
    { name: 'Uniswap', type: 'DEX', lastUpdated: new Date().toISOString() },
  ];
  res.json(exchangesData);
});

// 静态文服务
app.use(express.static(path.join(__dirname, 'build')));

// 所有其他請求返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

app.listen(PORT, (err) => {
  if (err) {
    logger.error('Error starting server', { error: err.message });
  } else {
    logger.info(`Server is running on port ${PORT}`);
  }
});

app.post('/api/contract/execute', authenticateToken, async (req, res) => {
  try {
    const { toAddress, amount } = req.body;
    const fromAddress = req.user.userId; // 假户 ID 是以太坊地址
    const privateKey = process.env.PRIVATE_KEY; // 从环境变量中获取私钥

    // 创建交易对象
    const tx = {
      from: fromAddress,
      to: toAddress,
      value: web3.utils.toWei(amount, 'ether'),
      gas: 2000000
    };

    // 签交易
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // 发送交易
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    res.json({ receipt });
  } catch (error) {
    logger.error('Error executing transaction', { error: error.message });
    res.status(500).json({ message: 'Error executing transaction', error: error.message });
  }
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason.message, promise });
});

// 添加新的路由来获取市场价格数据
app.get('/api/market-prices', authenticateToken, (req, res) => {
  console.log('Received request for market prices data');
  const marketPricesData = {
    cex: [
      { exchange: 'Binance', symbol: 'BTC/USDT', price: 45000 },
      { exchange: 'Coinbase', symbol: 'ETH/USD', price: 3000 },
      { exchange: 'Kraken', symbol: 'XRP/USD', price: 0.5 }
    ],
    dex: [
      { exchange: 'Uniswap', symbol: 'ETH/USDT', price: 3005 },
      { exchange: 'SushiSwap', symbol: 'LINK/ETH', price: 0.01 },
      { exchange: 'PancakeSwap', symbol: 'CAKE/BNB', price: 0.05 }
    ]
  };
  res.json(marketPricesData);
});

// 在现有的路由之后添加新的路由

// 添加机器搬砖套利数据路由
app.get('/api/arbitrage-bot', authenticateToken, (req, res) => {
  console.log('Received request for arbitrage bot data');
  const arbitrageBotData = {
    cex: [
      { from: 'Binance', to: 'Coinbase', pair: 'BTC/USDT', profit: '0.5%', amount: '0.1 BTC', timestamp: new Date().toISOString() },
      { from: 'Kraken', to: 'Bitfinex', pair: 'ETH/USD', profit: '0.3%', amount: '2 ETH', timestamp: new Date().toISOString() }
    ],
    dex: [
      { from: 'Uniswap', to: 'SushiSwap', pair: 'ETH/USDT', profit: '0.7%', amount: '5 ETH', timestamp: new Date().toISOString() },
      { from: 'PancakeSwap', to: 'Uniswap', pair: 'LINK/ETH', profit: '0.4%', amount: '100 LINK', timestamp: new Date().toISOString() }
    ]
  };
  res.json(arbitrageBotData);
});

// 批准或取消批准用户
app.put('/api/admin/users/:userId/approve', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { isApproved } = req.body;
    
    const user = await User.findByIdAndUpdate(userId, { isApproved }, { new: true });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: `User ${isApproved ? 'approved' : 'unapproved'} successfully`, user });
  } catch (error) {
    logger.error('Error approving/unapproving user', { error: error.message });
    res.status(500).json({ message: 'Error approving/unapproving user', error: error.message });
  }
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app; // 添加這行作為模塊導出

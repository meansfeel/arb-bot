const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const path = require('path');
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
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

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

const PORT = process.env.PORT || 5004;

// ... 其余代码保持不变

// 用户模型
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

const User = mongoose.model('User', userSchema);

// 受保护的路由
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Received token:', token);
  if (token == null) {
    console.log('No token provided');
    logger.warn('Access attempt without token');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Invalid token:', err);
      logger.warn('Invalid token used for authentication');
      return res.sendStatus(403);
    }
    console.log('Token verified, user:', user);
    req.user = user;
    next();
  });
};

// 注册路由
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
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // 检查是否是预设的账号密码
    if (username === 'meansfeel123' && password === 'Cs6626719!') {
      console.log('Using predefined account');
      const token = jwt.sign({ userId: 'predefined_user', role: 'admin' }, process.env.JWT_SECRET);
      return res.json({ token, role: 'admin' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    console.log('Login successful for user:', username);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// 添加套利路由
app.get('/api/arbitrage', authenticateToken, async (req, res) => {
  try {
    // 这里应该是您的套利逻辑
    const arbitrageData = [
      { exchange1: 'Binance', exchange2: 'Coinbase', profitPercentage: 1.5 },
      { exchange1: 'Kraken', exchange2: 'Bitfinex', profitPercentage: 0.8 },
    ];
    res.json(arbitrageData);
  } catch (error) {
    logger.error('Error fetching arbitrage data', { error: error.message });
    res.status(500).json({ message: 'Error fetching arbitrage data', error: error.message });
  }
});
   // 静态文件服务
   app.use(express.static(path.join(__dirname, 'build')));

   // 通配符路由
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'build', 'index.html'));
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
    const fromAddress = req.user.userId; // 假设用户 ID 是以太坊地址
    const privateKey = process.env.PRIVATE_KEY; // 从环境变量中获取私钥

    // 创建交易对象
    const tx = {
      from: fromAddress,
      to: toAddress,
      value: web3.utils.toWei(amount, 'ether'),
      gas: 2000000
    };

    // 签署交易
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    // 发送交易
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    res.json({ receipt });
  } catch (error) {
    logger.error('Error executing transaction', { error: error.message });
    res.status(500).json({ message: 'Error executing transaction', error: error.message });
  }
});
// 获取所有用户
// 示例：获取用户信息的路由
app.get('/api/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      logger.warn(`User not found for ID: ${req.user.userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    logger.info(`User data retrieved for ID: ${req.user.userId}`);
    res.json(user);
  } catch (error) {
    logger.error('Error fetching user data', { error: error.message });
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

// 示例：更新用户信息的路由
app.put('/api/user', authenticateToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user.userId, { username, email }, { new: true }).select('-password');
    if (!user) {
      logger.warn(`User not found for ID: ${req.user.userId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    logger.info(`User data updated for ID: ${req.user.userId}`);
    res.json(user);
  } catch (error) {
    logger.error('Error updating user data', { error: error.message });
    res.status(500).json({ message: 'Error updating user data', error: error.message });
  }
});

// 删除用户
app.delete('/api/admin/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Error deleting user', { error: error.message });
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason.message, promise });
});

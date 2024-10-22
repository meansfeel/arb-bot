const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const winston = require('winston');
const path = require('path');

// 在其他中间件之后，路由之前添加
app.use(express.static(path.join(__dirname, 'build')));

// 在所有其他路由之后添加
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
dotenv.config();

// 配置 logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const app = express();

app.use(cors({
  origin: 'http://localhost:3002'
}));
app.use(express.json());

const PORT = process.env.PORT || 5002;

// 连接到 MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('Could not connect to MongoDB', { error: err.message }));

// 用户模型
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

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

// 登录路由
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Login attempt with invalid username: ${username}`);
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn(`Failed login attempt for user: ${username}`);
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    logger.info(`User logged in successfully: ${username}`);
    res.json({ token });
  } catch (error) {
    logger.error('Error logging in', { error: error.message });
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// 受保护的路由
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    logger.warn('Access attempt without token');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Invalid token used for authentication');
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.get('/api/protected', authenticateToken, (req, res) => {
  logger.info(`Protected route accessed by user ID: ${req.user.userId}`);
  res.json({ message: 'This is a protected route', userId: req.user.userId });
});

// 获取用户信息的路由
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

app.listen(PORT, (err) => {
  if (err) {
    logger.error('Error starting server', { error: err.message });
  } else {
    logger.info(`Server is running on port ${PORT}`);
  }
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason.message, promise });
});

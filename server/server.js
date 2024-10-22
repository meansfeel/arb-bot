const express = require('express');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const botRoutes = require('./routes/bot');
const simulationRoutes = require('./routes/simulation');
const path = require('path');

dotenv.config();

const app = express();

// 添加 Helmet 中间件来设置各种 HTTP 头
app.use(helmet());

// 设置基本的 rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100 // 限制每个 IP 15 分钟内最多 100 个请求
});

app.use(limiter);
app.use(cors());
app.use(express.json());

// 连接数据库
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 使用路由
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/simulation', simulationRoutes);

const PORT = process.env.PORT || 5000;

// 设置安全审计 cron 作业
if (process.env.NODE_ENV === 'production') {
  require(path.join(__dirname, '..', 'scripts', 'setupCronJob.js'));
}

if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync('/path/to/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/path/to/cert.pem', 'utf8');
  const ca = fs.readFileSync('/path/to/chain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(PORT, () => {
    console.log(`HTTPS 服务器运行在端口 ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`HTTP 服务器运行在端口 ${PORT}`);
  });
}

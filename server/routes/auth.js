const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const router = express.Router();

router.post('/register', [
  body('username').isLength({ min: 3 }).trim().escape(),
  body('password').isLength({ min: 6 }),
  body('email').isEmail().normalizeEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, email } = req.body;
    const user = new User({ username, password, email });
    await user.save();
    res.status(201).json({ message: '注册成功，等待管理员批准' });
  } catch (error) {
    res.status(400).json({ message: '注册失败' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !user.isApproved) {
      return res.status(401).json({ message: '用户名或密码错误，或账户未获批准' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: '登录失败' });
  }
});

router.post('/logout', (req, res) => {
  // 客户端应该删除token
  res.json({ message: '登出成功' });
});

router.post('/setup-2fa', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  
  const secret = speakeasy.generateSecret();
  user.twoFactorSecret = secret.base32;
  await user.save();

  const otpAuthUrl = speakeasy.otpauthURL({
    secret: secret.ascii,
    label: 'ArbitrageBoosterBot',
    issuer: 'ArbitrageBoosterBot'
  });

  const qrCodeDataUrl = await qrcode.toDataURL(otpAuthUrl);

  res.json({ secret: secret.base32, qrCodeDataUrl });
});

router.post('/verify-2fa', async (req, res) => {
  const { userId, token } = req.body;
  const user = await User.findById(userId);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token
  });

  if (verified) {
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false, message: '验证失败' });
  }
});

module.exports = router;

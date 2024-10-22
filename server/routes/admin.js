const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId, isAdmin: true });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: '请先进行管理员身份验证' });
  }
};

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username !== 'meansfeel123' || password !== 'Cs6626719!') {
      return res.status(401).json({ message: '管理员用户名或密码错误' });
    }
    const admin = await User.findOne({ username: 'meansfeel123', isAdmin: true });
    if (!admin) {
      return res.status(401).json({ message: '管理员账户不存在' });
    }
    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: '登录失败' });
  }
});

router.get('/pending-users', adminAuth, async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false });
    res.json(pendingUsers);
  } catch (error) {
    res.status(400).json({ message: '获取待批准用户失败' });
  }
});

router.post('/approve-user', adminAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { isApproved: true });
    res.json({ message: '用户已批准' });
  } catch (error) {
    res.status(400).json({ message: '批准用户失败' });
  }
});

router.post('/reject-user', adminAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndDelete(userId);
    res.json({ message: '用户已拒绝并删除' });
  } catch (error) {
    res.status(400).json({ message: '拒绝用户失败' });
  }
});

router.post('/blacklist-user', adminAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { isApproved: false });
    res.json({ message: '用户已加入黑名单' });
  } catch (error) {
    res.status(400).json({ message: '将用户加入黑名单失败' });
  }
});

module.exports = router;

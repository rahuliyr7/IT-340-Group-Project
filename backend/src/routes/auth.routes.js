const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { sendEmail } = require('../services/email.service');

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    await sendEmail(email, 'Welcome to Atlantic Auctions', 'Your account is created. Login to start bidding!');
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, token } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.twoFaEnabled) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFaSecret,
        encoding: 'base32',
        token,
      });
      if (!verified) return res.status(401).json({ error: 'Invalid 2FA token' });
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    await sendEmail(email, 'Login Notification', 'You logged in successfully.');
    res.json({ token: jwtToken });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', async (req, res) => {
  // Assume token in header; invalidate if needed
  const email = req.body.email; // Or extract from token
  await sendEmail(email, 'Logout Notification', 'You logged out successfully.');
  res.json({ message: 'Logged out' });
});

router.post('/setup-2fa', async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assume auth middleware
    const secret = speakeasy.generateSecret({ name: 'AtlanticAuctions' });
    user.twoFaSecret = secret.base32;
    await user.save();
    qrcode.toDataURL(secret.otpauth_url, (err, data) => {
      res.json({ qrCode: data, secret: secret.base32 });
    });
  } catch (error) {
    res.status(500).json({ error: '2FA setup failed' });
  }
});

router.post('/verify-2fa', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id);
    const verified = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: 'base32',
      token,
    });
    if (verified) {
      user.twoFaEnabled = true;
      await user.save();
      res.json({ message: '2FA enabled' });
    } else {
      res.status(400).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Add purchase notification in product routes if needed
// e.g., after purchase: sendEmail(user.email, 'Purchase Confirmation', 'You bought X for $Y.');

module.exports = router;

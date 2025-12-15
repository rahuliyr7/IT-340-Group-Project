const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/verify', authMiddleware, authController.verifyToken);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;

// routes/2fa.routes.js (or inside auth routes)
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User'); // Adjust path

// Setup 2FA - Generate secret and QR code
router.post('/setup-2fa', async (req, res) => {
  const user = await User.findById(req.user.id); // Assuming authenticated

  const secret = speakeasy.generateSecret({
    name: `Atlantic Auctions (${user.email})`
  });

  user.twoFactorSecret = secret.base32;
  await user.save();

  QRCode.toDataURL(secret.otpauth_url, (err, dataURL) => {
    if (err) return res.status(500).json({ error: 'QR generation failed' });
    res.json({ qrCode: dataURL, secret: secret.base32 });
  });
});

// Verify and enable 2FA
router.post('/verify-2fa', async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user.id);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 2 // Allows slight time drift
  });

  if (verified) {
    user.twoFactorEnabled = true;
    await user.save();
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Invalid code' });
  }
});

// In your login route - after password check, if 2FA enabled
if (user.twoFactorEnabled) {
  // Send a temp token or flag, prompt for code on frontend
  return res.json({ requires2FA: true });
}

// Verify 2FA code during login
router.post('/verify-login-2fa', async (req, res) => {
  const { token, tempUserId } = req.body; // Send temp identifier from initial login
  const user = await User.findById(tempUserId);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token
  });

  if (verified) {
    // Proceed with full login (issue JWT/session)
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

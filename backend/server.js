const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();
//added required nodemailer and requiremnet for user Model
//added dotenv

const app = express();
app.use(bodyParser.json());
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
//added nodemailer transporter

// Connect to MongoDB (use your DB VM IP)
mongoose.connect('mongodb://192.168.149.130/altantic-auctions', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('DB connection error:', err));

// Register route
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Hash password (simple, uses 10 rounds for security)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, hashedPassword });
    await newUser.save();
    res.status(201).send('User registered');
  } catch (err) {
    res.status(400).send('Error registering user');
  }
});

// Login route
// Login route with 2FA step
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ ok: false, error: 'user_not_found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ ok: false, error: 'wrong_password' });
    }

    // Generate 6-digit 2FA code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Code expires in 10 minutes
    user.twoFactorCode = code;
    user.twoFactorExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send code via email
    await transporter.sendMail({
      from: `"Atlantic Auctions" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Atlantic Auctions 2FA Code',
      text: `Your authentication code is: ${code}`
    });
    //updated login route

    // Tell frontend to go to 2FA
    return res.json({
      ok: true,
      status: '2fa_required',
      userId: user._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'server_error' });
  }
});

// Start server on port 3000
app.listen(3000, () => console.log('Server running on port 3000'));



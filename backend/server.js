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
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');
    
    // Check if password matches hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Wrong password');
    
    res.send('Login successful');
  } catch (err) {
    res.status(400).send('Error logging in');
  }
});

// Start server on port 3000
app.listen(3000, () => console.log('Server running on port 3000'));



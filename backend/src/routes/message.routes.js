// routes/message.routes.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Send message (protect with auth middleware)
router.post('/send', async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.id; // From your auth middleware

  const newMsg = new Message({ sender: senderId, receiver: receiverId, message });
  await newMsg.save();
  res.json({ success: true, message: newMsg });
});

// Get messages with a user
router.get('/with/:userId', async (req, res) => {
  const userId = req.params.userId;
  const currentUser = req.user.id;

  const messages = await Message.find({
    $or: [
      { sender: currentUser, receiver: userId },
      { sender: userId, receiver: currentUser }
    ]
  }).sort('createdAt').populate('sender receiver', 'username email');

  res.json(messages);
});

module.exports = router;

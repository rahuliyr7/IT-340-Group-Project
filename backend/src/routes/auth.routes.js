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

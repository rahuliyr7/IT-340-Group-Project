const express = require('express');
const router = express.Router();
const historyController = require('../controllers/history.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Order history routes (Buyers only)
router.get('/orders', historyController.getOrderHistory);
router.get('/orders/:id', historyController.getOrderById);

// Search history routes (Buyers only)
router.post('/searches', historyController.saveSearch);
router.get('/searches', historyController.getSearchHistory);
router.delete('/searches', historyController.clearSearchHistory);

module.exports = router;

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes (no authentication required)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes (authentication required)

// Seller routes - Create, update, delete products
router.post('/', authMiddleware, productController.createProduct);
router.get('/seller/my-products', authMiddleware, productController.getMyProducts);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

// Buyer routes - Purchase and bid
router.post('/:id/purchase', authMiddleware, productController.purchaseProduct);
router.post('/:id/bid', authMiddleware, productController.placeBid);

module.exports = router;

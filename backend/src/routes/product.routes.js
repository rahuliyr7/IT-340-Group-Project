const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes (no authentication required)
router.get('/', productController.getAllProducts);

// Protected routes - SPECIFIC ROUTES MUST COME BEFORE PARAMETERIZED ROUTES
// Seller routes - Create, update, delete products
router.post('/', authMiddleware, productController.createProduct);
router.get('/seller/my-products', authMiddleware, productController.getMyProducts); // THIS MUST BE BEFORE /:id

// Buyer routes - Purchase and bid (these must also come before /:id)
router.post('/:id/purchase', authMiddleware, productController.purchaseProduct);
router.post('/:id/bid', authMiddleware, productController.placeBid);

// Product operations (update/delete) - also before /:id
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

// Parameterized routes MUST come last
router.get('/:id', productController.getProductById); // THIS MUST BE LAST

module.exports = router;

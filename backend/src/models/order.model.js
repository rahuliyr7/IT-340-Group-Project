const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Buyer information
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  buyerEmail: {
    type: String,
    required: true
  },
  
  // Product information
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    default: ''
  },
  
  // Seller information
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  
  // Order details
  orderType: {
    type: String,
    enum: ['purchase', 'auction_win'],
    default: 'purchase'
  },
  price: {
    type: Number,
    required: true
  },
  finalBid: {
    type: Number,
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  
  // Timestamps
  orderDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
orderSchema.index({ buyerId: 1, orderDate: -1 });

module.exports = mongoose.model('Order', orderSchema);

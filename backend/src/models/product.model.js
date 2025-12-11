const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Sports', 'Comics', 'Watches', 'Movies', 'Music', 'Gaming', 'Other']
  },
  rarity: {
    type: String,
    required: [true, 'Rarity is required'],
    enum: ['Common', 'Rare', 'Ultra Rare']
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  images: [{
    type: String,
    default: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400'
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  isAuction: {
    type: Boolean,
    default: false
  },
  // Auction-specific fields
  currentBid: {
    type: Number,
    default: 0
  },
  reservePrice: {
    type: Number,
    default: null
  },
  auctionStart: {
    type: Date,
    default: null
  },
  auctionEnd: {
    type: Date,
    default: null
  },
  bids: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
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
  // Status
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'removed'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  soldDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Automatically set auction start time when auction is created
productSchema.pre('save', function(next) {
  if (this.isAuction && !this.auctionStart) {
    this.auctionStart = new Date();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

const Product = require('../models/product.model');
const User = require('../models/user.model');
const Order = require('../models/order.model');

// Create new product (Sellers only)
exports.createProduct = async (req, res) => {
  try {
    // Verify user is a seller
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.accountType !== 'seller') {
      return res.status(403).json({ 
        message: 'Only seller accounts can create products' 
      });
    }

    const {
      name,
      description,
      category,
      rarity,
      condition,
      images,
      price,
      isAuction,
      auctionDuration, // in days
      reservePrice
    } = req.body;

    // Validate required fields
    if (!name || !description || !category || !rarity || !price) {
      return res.status(400).json({ 
        message: 'All required fields must be provided' 
      });
    }

    // Create product data
    const productData = {
      name,
      description,
      category,
      rarity,
      condition: condition || 'Good',
      images: images || [],
      price,
      isAuction: isAuction || false,
      sellerId: user._id,
      sellerName: `${user.firstName} ${user.lastName}`,
      status: 'active'
    };

    // If it's an auction, set auction fields
    if (isAuction) {
      productData.currentBid = 0;
      productData.auctionStart = new Date();
      
      // Set auction end date (default 7 days)
      const durationDays = auctionDuration || 7;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + durationDays);
      productData.auctionEnd = endDate;

      if (reservePrice) {
        productData.reservePrice = reservePrice;
      }
    }

    const product = new Product(productData);
    await product.save();

    console.log(`New product created: ${product.name} by ${user.email}`);

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// Get all active products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, rarity, search, sortBy } = req.query;

    // Build filter
    let filter = { status: 'active' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (rarity && rarity !== 'All') {
      filter.rarity = rarity;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    //Tag filters
    if(req.query.tags){
      const tagArr=String(req.query.tags)
      .split(',')
      .map(t =>t.trim())
      .filter(Boolean);
      if(tagArr.length){
        filter.tags={$all: tagArr};
      }
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort.price = 1;
        break;
      case 'price-high':
        sort.price = -1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'ending-soon':
        sort.auctionEnd = 1;
        break;
      default:
        sort.createdAt = -1;
    }

    const products = await Product.find(filter).sort(sort);

    res.json({
      message: 'Products retrieved successfully',
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'firstName lastName email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product retrieved successfully',
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
};

// Get seller's products (Sellers only)
exports.getMyProducts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.accountType !== 'seller') {
      return res.status(403).json({ 
        message: 'Only sellers can view their products' 
      });
    }

    const products = await Product.find({ sellerId: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      message: 'Your products retrieved successfully',
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
};

// Update product (Sellers only - own products)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership
    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'You can only update your own products' 
      });
    }

    // Cannot update sold or expired products
    if (product.status === 'sold' || product.status === 'expired') {
      return res.status(400).json({ 
        message: 'Cannot update sold or expired products' 
      });
    }

    const {
      name,
      description,
      category,
      rarity,
      condition,
      price
    } = req.body;

    // Update allowed fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (rarity) product.rarity = rarity;
    if (condition) product.condition = condition;
    
    // Can only update price if no bids on auction
    if (price && (!product.isAuction || product.bids.length === 0)) {
      product.price = price;
    }

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// Delete product (Sellers only - own products)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership
    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({ 
        message: 'You can only delete your own products' 
      });
    }

    // Cannot delete if there are bids
    if (product.isAuction && product.bids.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete auction with existing bids' 
      });
    }

    // Soft delete - change status instead of actual deletion
    product.status = 'removed';
    await product.save();

    res.json({
      message: 'Product deleted successfully',
      productId: product._id
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};
// Get available product categories (from enum)
exports.getCategories = async (req, res) => {
  try {
    const categories = Product.schema.path('category').enumValues;

    res.json({
      message: 'Categories retrieved successfully',
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
};

// Place bid on auction (Buyers only)
exports.placeBid = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.accountType !== 'buyer') {
      return res.status(403).json({ 
        message: 'Only buyer accounts can place bids' 
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isAuction) {
      return res.status(400).json({ message: 'This product is not an auction' });
    }

    if (product.status !== 'active') {
      return res.status(400).json({ message: 'Auction is not active' });
    }

    // Check if auction has ended
    if (new Date() > product.auctionEnd) {
      product.status = 'expired';
      await product.save();
      return res.status(400).json({ message: 'Auction has ended' });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid bid amount' });
    }

    // Bid must be higher than current bid
    const minBid = product.currentBid > 0 ? product.currentBid : product.price;
    if (amount <= minBid) {
      return res.status(400).json({ 
        message: `Bid must be higher than current bid of $${minBid}` 
      });
    }

    // Add bid
    product.bids.push({
      userId: user._id,
      amount,
      timestamp: new Date()
    });

    product.currentBid = amount;

    // Auto-extend auction if bid placed in last 5 minutes
    const timeRemaining = product.auctionEnd - new Date();
    const fiveMinutes = 5 * 60 * 1000;
    if (timeRemaining < fiveMinutes) {
      product.auctionEnd = new Date(product.auctionEnd.getTime() + fiveMinutes);
      console.log(`Auction ${product._id} extended by 5 minutes`);
    }

    await product.save();

    console.log(`Bid placed: $${amount} on ${product.name} by ${user.email}`);

    res.json({
      message: 'Bid placed successfully',
      product: {
        id: product._id,
        name: product.name,
        currentBid: product.currentBid,
        totalBids: product.bids.length,
        auctionEnd: product.auctionEnd
      }
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Server error while placing bid' });
  }
};

// Purchase product (Buyers only) - WITH ORDER CREATION
exports.purchaseProduct = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.accountType !== 'buyer') {
      return res.status(403).json({ 
        message: 'Only buyer accounts can purchase products' 
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.status !== 'active') {
      return res.status(400).json({ message: 'Product is not available' });
    }

    // For auctions, can only use "Buy Now" price
    if (product.isAuction) {
      // Check if auction hasn't ended
      if (new Date() > product.auctionEnd) {
        return res.status(400).json({ 
          message: 'Cannot buy now, auction has ended' 
        });
      }
    }

    // Mark product as sold
    product.status = 'sold';
    product.soldTo = user._id;
    product.soldDate = new Date();
    await product.save();

    // CREATE ORDER RECORD
    const order = new Order({
      buyerId: user._id,
      buyerName: `${user.firstName} ${user.lastName}`,
      buyerEmail: user.email,
      productId: product._id,
      productName: product.name,
      productImage: product.images && product.images.length > 0 ? product.images[0] : '',
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      orderType: 'purchase',
      price: product.price,
      status: 'completed',
      orderDate: new Date()
    });
    await order.save();

    console.log(`Product purchased: ${product.name} by ${user.email}`);
    console.log(`Order created: ${order._id}`);

    res.json({
      message: 'Purchase successful',
      order: {
        orderId: order._id,
        productName: order.productName,
        price: order.price,
        orderDate: order.orderDate
      },
      product: {
        id: product._id,
        name: product.name,
        price: product.price,
        soldDate: product.soldDate
      }
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Server error while processing purchase' });
  }
};

// Helper function to finalize auction (when it ends)
exports.finalizeAuction = async (productId) => {
  try {
    const product = await Product.findById(productId);
    
    if (!product || !product.isAuction) {
      return;
    }
    
    if (product.status !== 'active') {
      return;
    }
    
    if (new Date() < product.auctionEnd) {
      return;
    }
    
    // Check if reserve price met
    if (product.reservePrice && product.currentBid < product.reservePrice) {
      product.status = 'expired';
      await product.save();
      console.log(`Auction expired (reserve not met): ${product.name}`);
      return;
    }
    
    // If there are bids, create order for highest bidder
    if (product.bids.length > 0) {
      const highestBid = product.bids[product.bids.length - 1];
      const winner = await User.findById(highestBid.userId);
      
      if (!winner) {
        console.error(`Winner user not found for auction: ${product.name}`);
        product.status = 'expired';
        await product.save();
        return;
      }
      
      product.status = 'sold';
      product.soldTo = winner._id;
      product.soldDate = new Date();
      await product.save();
      
      // Create order for auction winner
      const order = new Order({
        buyerId: winner._id,
        buyerName: `${winner.firstName} ${winner.lastName}`,
        buyerEmail: winner.email,
        productId: product._id,
        productName: product.name,
        productImage: product.images && product.images.length > 0 ? product.images[0] : '',
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        orderType: 'auction_win',
        price: product.price,
        finalBid: highestBid.amount,
        status: 'completed',
        orderDate: new Date()
      });
      await order.save();
      
      console.log(`Auction won: ${product.name} by ${winner.email} for $${highestBid.amount}`);
      console.log(`Order created: ${order._id}`);
    } else {
      // No bids, mark as expired
      product.status = 'expired';
      await product.save();
      console.log(`Auction expired (no bids): ${product.name}`);
    }
  } catch (error) {
    console.error('Error finalizing auction:', error);
  }
};

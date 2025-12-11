const Order = require('../models/order.model');
const SearchHistory = require('../models/search-history.model');
const User = require('../models/user.model');

// Get buyer's order history
exports.getOrderHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.accountType !== 'buyer') {
      return res.status(403).json({ 
        message: 'Only buyer accounts can view order history' 
      });
    }

    const orders = await Order.find({ buyerId: req.userId })
      .sort({ orderDate: -1 })
      .limit(50); // Last 50 orders

    res.json({
      message: 'Order history retrieved successfully',
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get order history error:', error);
    res.status(500).json({ message: 'Server error while fetching order history' });
  }
};

// Get single order details
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('productId', 'name description images')
      .populate('sellerId', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify ownership
    if (order.buyerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      message: 'Order retrieved successfully',
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order' });
  }
};

// Save search query
exports.saveSearch = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.accountType !== 'buyer') {
      return res.status(403).json({ 
        message: 'Only buyer accounts can save search history' 
      });
    }

    const { searchQuery, filters, resultsCount } = req.body;

    if (!searchQuery || searchQuery.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Check if similar search exists recently (within last hour)
    const recentSearch = await SearchHistory.findOne({
      userId: req.userId,
      searchQuery: searchQuery.trim(),
      timestamp: { $gte: new Date(Date.now() - 3600000) } // 1 hour ago
    });

    if (recentSearch) {
      // Update existing search
      recentSearch.resultsCount = resultsCount || 0;
      recentSearch.timestamp = new Date();
      if (filters) recentSearch.filters = filters;
      await recentSearch.save();
      
      return res.json({
        message: 'Search updated',
        search: recentSearch
      });
    }

    // Create new search record
    const search = new SearchHistory({
      userId: req.userId,
      searchQuery: searchQuery.trim(),
      filters: filters || {},
      resultsCount: resultsCount || 0,
      timestamp: new Date()
    });

    await search.save();

    res.status(201).json({
      message: 'Search saved successfully',
      search
    });
  } catch (error) {
    console.error('Save search error:', error);
    res.status(500).json({ message: 'Server error while saving search' });
  }
};

// Get search history
exports.getSearchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.accountType !== 'buyer') {
      return res.status(403).json({ 
        message: 'Only buyer accounts can view search history' 
      });
    }

    const searches = await SearchHistory.find({ userId: req.userId })
      .sort({ timestamp: -1 })
      .limit(20); // Last 20 searches

    res.json({
      message: 'Search history retrieved successfully',
      count: searches.length,
      searches
    });
  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({ message: 'Server error while fetching search history' });
  }
};

// Clear search history
exports.clearSearchHistory = async (req, res) => {
  try {
    await SearchHistory.deleteMany({ userId: req.userId });
    
    res.json({
      message: 'Search history cleared successfully'
    });
  } catch (error) {
    console.error('Clear search history error:', error);
    res.status(500).json({ message: 'Server error while clearing search history' });
  }
};

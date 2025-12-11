const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  searchQuery: {
    type: String,
    required: true,
    trim: true
  },
  filters: {
    category: String,
    rarity: String,
    sortBy: String
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries and automatic cleanup
searchHistorySchema.index({ userId: 1, timestamp: -1 });
searchHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // Auto-delete after 90 days

module.exports = mongoose.model('SearchHistory', searchHistorySchema);

const mongoose = require('mongoose');

const readHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
}, {
  timestamps: true, 
});

readHistorySchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model('ReadHistory', readHistorySchema);
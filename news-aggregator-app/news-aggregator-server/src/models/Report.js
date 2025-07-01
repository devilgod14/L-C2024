const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

reportSchema.index({ articleId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
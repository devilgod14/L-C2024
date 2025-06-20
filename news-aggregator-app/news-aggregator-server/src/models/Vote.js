const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
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
  
  vote: {
    type: String,
    enum: ['like', 'dislike'],
    required: true,
  },
}, {
  timestamps: true,
});

voteSchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
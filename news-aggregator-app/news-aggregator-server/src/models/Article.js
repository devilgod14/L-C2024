const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true // Prevents us from storing the same article multiple times
  },
  publishedAt: {
    type: Date,
    required: true
  },
   likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExternalAPISource',
    required: true
  }
}, {
  timestamps: true
});

articleSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Article', articleSchema);
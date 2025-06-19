const mongoose = require('mongoose');

const externalAPISourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  apiKey: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Not Active'],
    required: true,
    default: 'Active'
  },
  lastAccessed: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ExternalAPISource', externalAPISourceSchema);
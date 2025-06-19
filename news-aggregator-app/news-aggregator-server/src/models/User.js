const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true 
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['User', 'Admin'], // The role can only be one of these two values
    default: 'User' // New users will have this role by default
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
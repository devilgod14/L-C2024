const mongoose = require('mongoose');

const notificationSettingSchema = new mongoose.Schema({
  // Reference to the User these settings belong to.
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  enabledCategories: {
    type: [String], 
    default: [] 
  },
  keywords: {
    type: [String],
    default: []
  }
});
module.exports = mongoose.model('NotificationSetting', notificationSettingSchema);
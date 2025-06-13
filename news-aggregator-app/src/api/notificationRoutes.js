const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.use(isAuthenticated);

router.get('/settings', async (req, res) => {
  try {
    const settings = await notificationService.getSettings(req.user.id);
    res.json(settings);
  } catch (error) {
       console.error('Error setting configuration:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const updatedSettings = await notificationService.updateSettings(req.user.id, req.body);
    res.json(updatedSettings);
  } catch (error) {
    console.error('Error setting configuration:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
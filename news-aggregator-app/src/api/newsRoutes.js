const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.post('/fetch', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const result = await newsService.fetchAndStoreNews();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in fetch route:', error);
    res.status(500).json({ message: 'Server error during news fetch.' });
  }
});

module.exports = router;
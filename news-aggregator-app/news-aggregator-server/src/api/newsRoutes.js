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

router.get('/headlines', isAuthenticated, async (req, res) => {
    try {
        const articles = await newsService.getHeadlines({ 
            filters: req.query, 
            userId: req.user.id 
        });
        res.json(articles);
    } catch (error) {
        console.error('Error getting headlines:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/search', isAuthenticated, async (req, res) => {
    try {
        const articles = await newsService.searchArticles({ 
            filters: req.query, 
            userId: req.user.id 
        });
        res.json(articles);
    } catch (error) {
        console.error('Error searching articles:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
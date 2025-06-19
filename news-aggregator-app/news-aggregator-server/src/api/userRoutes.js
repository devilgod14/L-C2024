const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/me/saved-articles', isAuthenticated, async (req, res) => {
  try {
    const articles = await userService.getSavedArticles(req.user.id);
    res.json(articles);
  } catch (error) {
    console.error('Error getting saved articles:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/me/saved-articles', isAuthenticated, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({ message: 'Article ID is required.' });
    }

    const savedArticle = await userService.saveArticle(req.user.id, articleId);
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/me/saved-articles/:id', isAuthenticated, async (req, res) => {
  try {
    await userService.deleteSavedArticle(req.user.id, req.params.id);
    res.json({ message: 'Article removed from saved list' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


module.exports = router;
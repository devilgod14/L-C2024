const express = require('express');
const router = express.Router();
const articleService = require('../services/articleService');
const { isAuthenticated } = require('../middleware/authMiddleware');
const ReadHistory = require('../models/ReadHistory');

router.post('/:id/vote', isAuthenticated, async (req, res) => {
  try {
    const { vote } = req.body; 
    if (!['like', 'dislike'].includes(vote)) {
      return res.status(400).json({ message: 'Invalid vote type.' });
    }

    const voteData = {
      userId: req.user.id,
      articleId: req.params.id,
      voteType: vote,
    };

    const updatedCounts = await articleService.handleVote(voteData);
    res.json(updatedCounts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/report', isAuthenticated, async (req, res) => {
  try {
    const result = await articleService.reportArticle({
      userId: req.user.id,
      articleId: req.params.id,
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/:id/read', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;

    await ReadHistory.findOneAndUpdate(
      { userId, articleId },
      { $set: { userId, articleId } },
      { upsert: true }
    );
    
    res.status(200).json({ message: 'Article read status logged.' });
  } catch (error) {
    console.error('Error logging read status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
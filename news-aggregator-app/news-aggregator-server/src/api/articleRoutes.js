
const express = require('express');
const router = express.Router();
const articleService = require('../services/articleService');
const { isAuthenticated } = require('../middleware/authMiddleware');

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

module.exports = router;
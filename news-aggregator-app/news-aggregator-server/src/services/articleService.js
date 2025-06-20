const Article = require('../models/Article');
const Vote = require('../models/Vote');

class ArticleService {
  /**
   * Handles a user's vote on an article (like or dislike).
   * @param {object} voteData - Contains userId, articleId, and voteType ('like' or 'dislike')
   */
  async handleVote({ userId, articleId, voteType }) {

    const article = await Article.findById(articleId);
    if (!article) {
      throw new Error('Article not found.');
    }

    const voteFilter = { userId, articleId };
    const existingVote = await Vote.findOne(voteFilter);

    let likeChange = 0;
    let dislikeChange = 0;

    if (existingVote) {

      if (existingVote.vote === voteType) {
        await Vote.deleteOne(voteFilter);
        if (voteType === 'like') likeChange = -1;
        if (voteType === 'dislike') dislikeChange = -1;
      } else {
        if (voteType === 'like') {
          likeChange = 1;
          dislikeChange = -1;
        } else { 
          likeChange = -1;
          dislikeChange = 1;
        }
        existingVote.vote = voteType;
        await existingVote.save();
      }
    } else {
      await Vote.create({ userId, articleId, vote: voteType });
      if (voteType === 'like') likeChange = 1;
      if (voteType === 'dislike') dislikeChange = 1;
    }

    if (likeChange !== 0 || dislikeChange !== 0) {
      await Article.updateOne(
        { _id: articleId },
        { $inc: { likes: likeChange, dislikes: dislikeChange } }
      );
    }
    
    return Article.findById(articleId).select('likes dislikes');
  }
}

module.exports = new ArticleService();
const Article = require('../models/Article');
const Report = require('../models/Report');
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

async reportArticle({ userId, articleId }) {

    const article = await Article.findById(articleId);
    if (!article) {
      throw new Error('Article not found.');
    }

    const existingReport = await Report.findOne({ userId, articleId });
    if (existingReport) {
      throw new Error('You have already reported this article.');
    }

    await Report.create({ userId, articleId });

    const updatedArticle = await Article.findByIdAndUpdate(
      articleId,
      { $inc: { reportCount: 1 } },
      { new: true } 
    );

    const reportThreshold = parseInt(process.env.REPORT_THRESHOLD, 10) || 5;
    if (updatedArticle.reportCount >= reportThreshold) {
      updatedArticle.isHidden = true;
      await updatedArticle.save();
      console.log(`Article ${articleId} automatically hidden due to exceeding report threshold.`);
      
    }
    
    return { message: 'Article reported successfully.' };
 }
}

module.exports = new ArticleService();
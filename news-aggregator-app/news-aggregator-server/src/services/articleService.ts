import logger from "../config/logger";
import Report from "../models/Report";
import articleRepository from "../repositories/articleRepository";
import readHistoryRepository from "../repositories/readHistoryRepository";
import voteRepository from "../repositories/voteRepository";
import { BadRequestError, NotFoundError } from "../utils/error";


class ArticleService {
  public async handleVote({ userId, articleId, voteType }: { userId: string; articleId: string; voteType: 'like' | 'dislike' }) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw new NotFoundError('Article not found.');

    const existingVote = await voteRepository.findOne(userId, articleId);
    let likeChange = 0;
    let dislikeChange = 0;

    if (existingVote) {
      if (existingVote.vote === voteType) {
        await voteRepository.deleteOne(userId, articleId);
        if (voteType === 'like') likeChange = -1;
        else dislikeChange = -1;
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
      await voteRepository.create(userId, articleId, voteType);
      if (voteType === 'like') likeChange = 1;
      else dislikeChange = 1;
    }

    if (likeChange !== 0 || dislikeChange !== 0) {
      await articleRepository.updateVoteCounts(articleId, likeChange, dislikeChange);
    }
    return articleRepository.findById(articleId);
  }

   public async logArticleRead({ userId, articleId }: { userId: string; articleId: string }) {
    await readHistoryRepository.createOrFind(userId, articleId);
    return { message: 'Article read status logged.' };
  }

   public async reportArticle({ userId, articleId }: { userId: string; articleId: string }) {
    const article = await articleRepository.findById(articleId);
    if (!article) throw new NotFoundError('Article not found.');

    const existingReport = await Report.findOne({ userId, articleId });
    if (existingReport) throw new BadRequestError('You have already reported this article.');

    await Report.create({ userId, articleId });

    const updatedArticle = await articleRepository.incrementReportCount(articleId);

    const reportThreshold = parseInt(process.env.REPORT_THRESHOLD || '5', 10);
    if (updatedArticle && updatedArticle.reportCount >= reportThreshold) {
      updatedArticle.isHidden = true;
      await updatedArticle.save();
      logger.info(`Article ${articleId} automatically hidden due to report threshold.`);
    }

    return { message: 'Article reported successfully.' };
  }
}

export default new ArticleService();
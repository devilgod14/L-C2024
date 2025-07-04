import voteRepository from '../repositories/voteRepository';
import savedArticleRepository from '../repositories/savedArticleRepository';
import readHistoryRepository from '../repositories/readHistoryRepository';
import notificationRepository from '../repositories/notificationRepository';
import { IArticleDocument } from '../types/news.types';

class RecommendationService {
  private weights = {
    SAVED_CATEGORY: 15,
    LIKED_CATEGORY: 10,
    READ_CATEGORY: 5,
    NOTIFICATION_CATEGORY: 20,
    NOTIFICATION_KEYWORD: 25,
  };

  public async scoreArticlesForUser({ userId, articles }: { userId: string; articles: IArticleDocument[] }) {
    if (!userId || !articles || articles.length === 0) {
      return articles.map(a => ({ ...a.toObject(), relevanceScore: 0 }));
    }

    const [settings, likedVotes, saved, readHistory] = await Promise.all([
      notificationRepository.findSettingsForUser(userId),
      voteRepository.findAllByUserId(userId, 'like'),
      savedArticleRepository.findByUserId(userId),
      readHistoryRepository.findByUserId(userId),
    ]);

    const categoryInterest: Record<string, number> = {};
    const addInterest = (categoryId: any, weight: number) => {
      if (!categoryId) return;
      const id = categoryId.toString();
      categoryInterest[id] = (categoryInterest[id] || 0) + weight;
    };

    likedVotes.forEach((vote:any) => addInterest(vote.articleId?.categoryId, this.weights.LIKED_CATEGORY));
    saved.forEach((item:any) => addInterest(item.articleId?.categoryId, this.weights.SAVED_CATEGORY));
    readHistory.forEach((item:any) => addInterest(item.articleId?.categoryId, this.weights.READ_CATEGORY));
    
    const notificationKeywords = settings?.keywords || [];
    const notificationCategories = settings?.enabledCategories || [];

    const scoredArticles = articles.map(article => {
      let relevanceScore = 0;
      const articleText = `${article.title} ${article.description}`.toLowerCase();
      const articleCategoryId = (article.categoryId as any)._id.toString();
      const articleCategoryName = (article.categoryId as any).name;
      
      if (notificationCategories.includes(articleCategoryName)) {
        relevanceScore += this.weights.NOTIFICATION_CATEGORY;
      }
      notificationKeywords.forEach((keyword:any) => {
        if (articleText.includes(keyword.toLowerCase())) {
          relevanceScore += this.weights.NOTIFICATION_KEYWORD;
        }
      });
      if (categoryInterest[articleCategoryId]) {
        relevanceScore += categoryInterest[articleCategoryId];
      }
      
      return { ...article.toObject(), relevanceScore };
    });
    
    return scoredArticles;
  }
}

export default new RecommendationService();
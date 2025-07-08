import ReadHistory, { IReadHistory } from '../models/ReadHistory';
import { IArticleDocument } from '../types/news.types';

class ReadHistoryRepository {
  public async createOrFind(userId: string, articleId: string) {

    return ReadHistory.findOneAndUpdate(
      { userId, articleId },
      { $set: { userId, articleId } },
      { upsert: true, new: true }
    );
  }

  public async findByUserId(userId: string): Promise<IReadHistory[]> {
    return ReadHistory.find({ userId }).populate<{ articleId: IArticleDocument }>('articleId', 'categoryId');
  }
}

export default new ReadHistoryRepository();
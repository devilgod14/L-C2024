import Vote from "../models/Vote";
import { IVoteDocument } from "../types/articles.types";
import { IArticleDocument } from "../types/news.types";

class VoteRepository {
  public async findOne(userId: string, articleId: string): Promise<IVoteDocument | null> {
    return Vote.findOne({ userId, articleId });
  }

  public async create(userId: string, articleId: string, voteType: 'like' | 'dislike'): Promise<IVoteDocument> {
    return Vote.create({ userId, articleId, vote: voteType });
  }

  public async deleteOne(userId: string, articleId: string): Promise<any> {
    return Vote.deleteOne({ userId, articleId });
  }

  public async findAllByUserId(userId: string, voteType: 'like' | 'dislike'): Promise<IVoteDocument[]> {
    return Vote.find({ userId, vote: voteType }).populate<{ articleId: IArticleDocument }>('articleId', 'categoryId');
  }
}

export default new VoteRepository();
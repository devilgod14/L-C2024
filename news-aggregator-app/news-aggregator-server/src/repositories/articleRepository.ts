import Article from "../models/Article";
import { IArticleDocument } from "../types/news.types";

class ArticleRepository {
  public async findById(id: string): Promise<IArticleDocument | null> {
    return Article.findById(id);
  }

  public async updateVoteCounts(articleId: string, likeChange: number, dislikeChange: number): Promise<any> {
    return Article.updateOne(
      { _id: articleId },
      { $inc: { likes: likeChange, dislikes: dislikeChange } }
    );
  }

  public async incrementReportCount(articleId: string): Promise<IArticleDocument | null> {
    return Article.findByIdAndUpdate(
        articleId,
        { $inc: { reportCount: 1 } },
        { new: true }
    );
}
}

export default new ArticleRepository();
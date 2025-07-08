import SavedArticle from '../models/SavedArticle';
import { IArticleDocument } from '../types/news.types';
import { ISavedArticleDocument } from '../types/user.types';

class SavedArticleRepository {
    public async findByUserId(userId: string): Promise<ISavedArticleDocument[]> {
        return SavedArticle.find({ userId })
            .sort({ createdAt: -1 })
            .populate<{ articleId: IArticleDocument }>({
                path: 'articleId',
                populate: {
                    path: 'categoryId sourceId',
                    select: 'name'
                }
            });
    }

    public async findOne(userId: string, articleId: string): Promise<ISavedArticleDocument | null> {
        return SavedArticle.findOne({ userId, articleId });
    }

    public async create(userId: string, articleId: string): Promise<ISavedArticleDocument> {
        return SavedArticle.create({ userId, articleId });
    }

    public async findById(id: string): Promise<ISavedArticleDocument | null> {
        return SavedArticle.findById(id);
    }

    public async deleteById(id: string): Promise<any> {
        return SavedArticle.findByIdAndDelete(id);
    }
}

export default new SavedArticleRepository();
import savedArticleRepository from '../repositories/savedArticleRepository';
import articleRepository from '../repositories/articleRepository';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/error';

class UserService {
    public async getSavedArticles(userId: string) {
        return savedArticleRepository.findByUserId(userId);
    }

    public async saveArticle(userId: string, articleId: string) {
        const article = await articleRepository.findById(articleId);
        if (!article) throw new NotFoundError('Article not found.');

        const existingSave = await savedArticleRepository.findOne(userId, articleId);
        if (existingSave) throw new BadRequestError('Article has already been saved.');

        return savedArticleRepository.create(userId, articleId);
    }

    public async deleteSavedArticle(userId: string, savedArticleId: string) {
        const savedArticle = await savedArticleRepository.findById(savedArticleId);
        if (!savedArticle) throw new NotFoundError('Saved article entry not found.');
        if (savedArticle.userId.toString() !== userId) {
            throw new UnauthorizedError('User not authorized to delete this.');
        }
        return savedArticleRepository.deleteById(savedArticleId);
    }
}

export default new UserService();
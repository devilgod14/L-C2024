
import { categoryApi, newsApi, userApi } from '../api';
import logger from '../config/logger';
import { IArticleApiResponse, ISavedArticleApiResponse } from '../types';
import { CommonPrompts } from '../ui/commonPrompts';
import { InteractionPrompts } from '../ui/interactionPrompts';
import { NewsPrompts } from '../ui/newsPrompts';
import lm from '../utils/localizationManager';

export class UserFlows {
  private newsPrompts = new NewsPrompts();
  private interactionPrompts = new InteractionPrompts();
  private commonPrompts = new CommonPrompts();

  private async displayAndInteractWithArticles(articles: IArticleApiResponse[]): Promise<void> {
    if (articles.length === 0) {
      logger.info(lm.get('noResults', { item: 'articles' }));
      return;
    }

    logger.info('\n--- Articles Found ---');
    articles.forEach((article) => {
      logger.info(`\n----------------------------------------`);
      logger.info(`  ID:          ${article._id}`);
      logger.info(`  Title:       ${article.title}`);
      logger.info(`  Category:    ${article.categoryId.name}`);
      logger.info(`  Likes:       ${article.likes} | Dislikes: ${article.dislikes}`);
    });
    logger.info(`----------------------------------------`);

    while (true) {
      const choice = await this.interactionPrompts.forArticleAction();
      const action = choice.split(' ')[0].toUpperCase();
      if (choice === lm.get('headlines.goBack')) break;

      const articleId = await this.interactionPrompts.forArticleId(action);
      try {
        switch (choice) {
          case lm.get('articleActions.like'): await userApi.voteOnArticle(articleId, 'like'); logger.info('\n✅ Vote registered!'); break;
          case lm.get('articleActions.dislike'): await userApi.voteOnArticle(articleId, 'dislike'); logger.info('\n✅ Vote registered!'); break;
          case lm.get('articleActions.save'): await userApi.saveArticle(articleId); logger.info(lm.get('articleActions.saveSuccess')); break;
          case lm.get('articleActions.report'): await userApi.reportArticle(articleId); logger.info('\n✅ Article reported.'); break;
        }
      } catch (error) { /* API layer logs */ }
      await this.commonPrompts.toContinue();
    }
  }

  public async handleHeadlines(): Promise<void> {
    logger.info(lm.get('headlines.title'));
    let filters: any = {};
    const dateChoice = await this.newsPrompts.forDateOption();
    if (dateChoice === lm.get('headlines.today')) {
        const today = new Date().toISOString().split('T')[0];
        filters.startDate = today;
        filters.endDate = today;
    } else if (dateChoice === lm.get('headlines.dateRange')) {
        filters.startDate = await this.newsPrompts.forDate('promptStartDate');
        filters.endDate = await this.newsPrompts.forDate('promptEndDate');
    } else { return; }
    const categories = await categoryApi.getAll();
        const categoryNames = categories.map((c: any) => c.name);
        const categoryChoice = await this.newsPrompts.forCategory(categoryNames);
    if (categoryChoice !== lm.get('headlines.allCategories')) { filters.category = categoryChoice; }
    
    try {
        logger.info(lm.get('fetching', { item: 'headlines' }));
        const articles = await newsApi.getHeadlines(filters);
        await this.displayAndInteractWithArticles(articles);
    } catch (error) { /* API layer logs */ }
  }

  public async handleSearch(): Promise<void> {
    logger.info(lm.get('search.title'));
    const query = await this.newsPrompts.forSearchQuery();
    if (!query) { logger.warn('Search query cannot be empty.'); return; }
    const sortBy = await this.newsPrompts.forSortOption();
    const filters: any = { query };
    if (sortBy !== 'publishedAt') { filters.sortBy = sortBy; }

    try {
        logger.info(lm.get('fetching', { item: 'search results' }));
        const articles = await newsApi.searchArticles(filters);
        await this.displayAndInteractWithArticles(articles);
    } catch (error) { /* API layer logs */ }
  }

  public async handleSavedArticles(): Promise<void> {
    logger.info(lm.get('saved.title'));
    try {
      const savedArticles = await userApi.getSavedArticles();
      if (savedArticles.length === 0) { logger.info(lm.get('saved.none')); return; }

      savedArticles.forEach((saved: ISavedArticleApiResponse) => {
        logger.info(`\n----------------------------------------`);
        logger.info(`  Saved Entry ID:  ${saved._id}`);
        logger.info(`  Title:           ${saved.articleId.title}`);
      });
      logger.info(`----------------------------------------`);
      
      const choice = await this.interactionPrompts.forSavedArticleAction();
      if (choice === lm.get('saved.delete')) {
        const idToDelete = await this.interactionPrompts.forSavedArticleIdToDelete();
        await userApi.deleteSavedArticle(idToDelete);
        logger.info('\n✅ Article successfully deleted.');
      }
    } catch (error) { /* API layer logs */ }
  }
}
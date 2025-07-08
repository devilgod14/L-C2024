import { adminApi, categoryApi } from '../api';
import logger from '../config/logger';
import { AdminMenuPrompts } from '../ui/adminMenuPrompts';
import { CommonPrompts } from '../ui/commonPrompts';
import lm from '../utils/localizationManager';


const maskApiKey = (key: string): string => {
  if (!key || key.length <= 8) return '****';
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};
export class AdminFlows {
  private prompts = new AdminMenuPrompts();
  private commonPrompts = new CommonPrompts();

   public async handleViewServers(): Promise<void> {
    while (true) {
        logger.info(lm.get('admin.sourcesTitle'));
        try {
            const sources = await adminApi.getSources();
            if (sources.length === 0) {
                logger.info(lm.get('admin.noSources'));
                return;
            }
            console.table(sources.map((s: any) => ({ ID: s._id, Name: s.name, Status: s.status })));
            
            const choice = await this.prompts.forServerAction();
            
            if (choice === lm.get('headlines.goBack')) break;

            if (choice === lm.get('admin.viewDetails')) {
                const sourceId = await this.prompts.forSourceId('view details for');
                const details = await adminApi.getSourceDetails(sourceId);
                logger.info(lm.get('admin.detailsTitle'));
                console.table([
                    { Label: 'ID', Value: details._id },
                    { Label: 'Name', Value: details.name },
                    { Label: 'API Key', Value: maskApiKey(details.apiKey) },
                    { Label: 'Status', Value: details.status },
                ]);
            } else if (choice === lm.get('admin.updateKey')) {
                const { sourceId, apiKey } = await this.prompts.forSourceUpdate();
                await adminApi.updateSourceApiKey(sourceId, apiKey);
                logger.info(lm.get('admin.updateSuccess'));
            }

        } catch (error: any) { /* The API layer handles logging */ }
        await this.commonPrompts.toContinue();
    }
  }


  public async handleManageReports(): Promise<void> {
    logger.info(lm.get('admin.reportsTitle'));
    try {
      const articles = await adminApi.getReportedArticles();
      if (articles.length === 0) {
        logger.info(lm.get('admin.noReports'));
        return;
      }
      console.table(articles.map((a: any) => ({ ID: a._id, Title: a.title, Reports: a.reportCount })));

      const choice = await this.prompts.forReportAction();
      if (choice === lm.get('admin.hideArticle')) {
        const articleId = await this.prompts.forArticleIdToHide();
        await adminApi.hideArticle(articleId);
        logger.info(lm.get('admin.hideSuccess'));
      }
    } catch (error: any) { /* The API layer handles logging */ }
  }

  public async handleManageCategories(): Promise<void> {
    logger.info(lm.get('admin.categoriesTitle'));
    try {
        const categories = await categoryApi.getAll();
        console.table(categories.map((c: any) => ({ ID: c._id, Name: c.name, Is_Hidden: c.isHidden })));

        const choice = await this.prompts.forCategoryManagement();
        if (choice === lm.get('headlines.goBack')) return;

        const categoryId = await this.prompts.forCategoryId(choice.split(' ')[0].toUpperCase());

        if (choice === lm.get('admin.hideCategory')) {
            await adminApi.hideCategory(categoryId);
            logger.info(lm.get('admin.hideCatSuccess'));
        } else if (choice === lm.get('admin.unhideCategory')) {
            await adminApi.unhideCategory(categoryId);
            logger.info(lm.get('admin.unhideCatSuccess'));
        }
    } catch (error: any) { /* The API layer handles logging */ }
  }

  public async handleManageKeywords(): Promise<void> {
    logger.info(lm.get('admin.keywordsTitle'));
    const choice = await this.prompts.forKeywordManagement();
    try {
        switch (choice) {
            case lm.get('admin.viewKeywords'):
                const keywords = await adminApi.getBlockedKeywords();
                if (keywords.length === 0) logger.info(lm.get('admin.noKeywords'));
                else console.table(keywords.map((k: any) => ({ ID: k._id, Keyword: k.keyword })));
                break;
            case lm.get('admin.addKeyword'):
                const newKeyword = await this.prompts.forNewKeyword();
                await adminApi.addBlockedKeyword(newKeyword);
                logger.info(lm.get('admin.addKeywordSuccess', { keyword: newKeyword }));
                break;
            case lm.get('admin.removeKeyword'):
                const keywordId = await this.prompts.forKeywordIdToRemove();
                await adminApi.removeBlockedKeyword(keywordId);
                logger.info(lm.get('admin.removeKeywordSuccess'));
                break;
            case lm.get('headlines.goBack'):
                return;
        }
    } catch (error: any) { /* The API layer handles logging */ }
  }

  public async handleAddCategory(): Promise<void> {
    logger.info(lm.get('admin.addCatTitle'));
    try {
      const categoryName = await this.prompts.forNewCategory();
      if (!categoryName) return;
      
      const newCategory = await adminApi.addCategory(categoryName);
      logger.info(lm.get('admin.addCatSuccess', { name: newCategory.name }));
    } catch (error: any) { /* The API layer handles logging */ }
  }
}
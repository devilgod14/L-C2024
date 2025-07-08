import adminRepository from '../repositories/adminRepository';
import { BadRequestError, NotFoundError } from '../utils/error';

class AdminService {
  public async getAllSources() {
    return adminRepository.findAllSources();
  }

  public async getSourceById(sourceId: string) {
    const source = await adminRepository.findSourceById(sourceId);
    if (!source) {
        throw new NotFoundError('Source not found.');
    }
    return source;
}

  public async updateSourceApiKey(sourceId: string, newApiKey: string) {
    const source = await adminRepository.findSourceById(sourceId);
    if (!source) throw new NotFoundError('Source not found.');
    return adminRepository.updateSource(sourceId, { apiKey: newApiKey });
  }

  public async addCategory(categoryName: string) {
    const standardCategoryName = categoryName.trim().charAt(0).toUpperCase() + categoryName.trim().slice(1).toLowerCase();
    const existingCategory = await adminRepository.findCategoryByName(standardCategoryName);
    if (existingCategory) throw new BadRequestError('Category already exists.');
    return adminRepository.createCategory(standardCategoryName);
  }

  public async getReportedArticles() {
    return adminRepository.findReportedArticles();
  }

  public async hideArticle(articleId: string) {
    return adminRepository.setArticleVisibility(articleId, true);
  }

  public async unhideArticle(articleId: string) {
    return adminRepository.setArticleVisibility(articleId, false);
  }
  
  public async hideCategory(categoryId: string) {
    return adminRepository.setCategoryVisibility(categoryId, true);
  }

  public async unhideCategory(categoryId: string) {
    return adminRepository.setCategoryVisibility(categoryId, false);
  }

  public async getBlockedKeywords() {
    return adminRepository.findAllBlockedKeywords();
  }

  public async addBlockedKeyword({ keyword, adminId }: { keyword: string; adminId: string; }) {
    const keywordStr = keyword.trim().toLowerCase();
    const existing = await adminRepository.findBlockedKeyword(keywordStr);
    if (existing) throw new BadRequestError('Keyword already exists in the blocklist.');
    return adminRepository.createBlockedKeyword(keywordStr, adminId);
  }

  public async removeBlockedKeyword(keywordId: string) {
    const result = await adminRepository.deleteBlockedKeyword(keywordId);
    if (!result) throw new NotFoundError('Keyword not found.');
    return result;
  }
}

export default new AdminService();
import Article from "../models/Article";
import BlockedKeywords, { IBlockedKeyword } from "../models/BlockedKeywords";
import Category from "../models/Category";
import ExternalAPISource from "../models/ExternalAPISource";
import { IArticleDocument, ICategoryDocument, IExternalAPISourceDocument } from "../types/news.types";

class AdminRepository {

  public async findAllSources(): Promise<IExternalAPISourceDocument[]> {
    return ExternalAPISource.find({});
  }
  public async findSourceById(id: string): Promise<IExternalAPISourceDocument | null> {
    return ExternalAPISource.findById(id);
  }
  public async updateSource(id: string, data: { apiKey: string }): Promise<IExternalAPISourceDocument | null> {
    return ExternalAPISource.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async createCategory(name: string): Promise<ICategoryDocument> {
    return Category.create({ name });
  }
  public async findCategoryByName(name: string): Promise<ICategoryDocument | null> {
    return Category.findOne({ name });
  }
  public async setCategoryVisibility(id: string, isHidden: boolean): Promise<ICategoryDocument | null> {
    return Category.findByIdAndUpdate(id, { isHidden }, { new: true });
  }

  public async findReportedArticles(): Promise<IArticleDocument[]> {
    return Article.find({ reportCount: { $gt: 0 }, isHidden: false }).sort({ reportCount: -1 });
  }
  public async setArticleVisibility(id: string, isHidden: boolean): Promise<IArticleDocument | null> {
    return Article.findByIdAndUpdate(id, { isHidden }, { new: true });
  }

  public async findAllBlockedKeywords(): Promise<IBlockedKeyword[]> {
    return BlockedKeywords.find({}).sort({ keyword: 1 });
  }
  public async createBlockedKeyword(keyword: string, adminId: string): Promise<IBlockedKeyword> {
    return BlockedKeywords.create({ keyword, addedBy: adminId });
  }
  public async findBlockedKeyword(keyword: string): Promise<IBlockedKeyword | null> {
    return BlockedKeywords.findOne({ keyword });
  }
  public async deleteBlockedKeyword(id: string): Promise<any> {
    return BlockedKeywords.findByIdAndDelete(id);
  }
}

export default new AdminRepository();
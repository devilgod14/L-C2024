import { FilterQuery } from 'mongoose';
import { IArticle, IArticleDocument, ICategoryDocument, IExternalAPISourceDocument } from '../types/news.types';
import Article from '../models/Article';
import ExternalAPISource from '../models/ExternalAPISource';
import Category from '../models/Category';
import BlockedKeywords from '../models/BlockedKeywords';

class NewsRepository {

  public async findActiveSources(): Promise<IExternalAPISourceDocument[]> {
    return ExternalAPISource.find({ status: 'Active' });
  }

  public async findCategoryByName(name: string): Promise<ICategoryDocument | null> {
    return Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
  }

  public async findOrCreateCategory(name: string): Promise<ICategoryDocument> {
    const standardName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
    return Category.findOneAndUpdate(
      { name: { $regex: `^${standardName}$`, $options: 'i' } },
      { $set: { name: standardName } },
      { upsert: true, new: true }
    );
  }

   public async findAllCategories(): Promise<ICategoryDocument[]> {
    return Category.find({ }).sort({ name: 1 });
  }

  public async findHiddenCategoryIds(): Promise<string[]> {
    const hiddenCategories = await Category.find({ isHidden: true }).select('_id');
    return hiddenCategories.map((c:any) => c._id.toString());
  }

  public async findAllBlockedKeywords(): Promise<string[]> {
    const keywords = await BlockedKeywords.find({});
    return keywords.map( (kw:any) => kw.keyword);
  }

  public async findArticles(query: FilterQuery<IArticleDocument>, sort: any = { publishedAt: -1 }): Promise<IArticleDocument[]> {
    return Article.find(query)
      .sort(sort)
      .populate<{ categoryId: ICategoryDocument }>('categoryId', 'name')
      .populate<{ sourceId: IExternalAPISourceDocument }>('sourceId', 'name');
  }

  public async updateArticleWithUpsert(url: string, data: Partial<IArticle>): Promise<any> {
    return Article.updateOne({ url }, { $setOnInsert: data }, { upsert: true });
  }
}

export default new NewsRepository();
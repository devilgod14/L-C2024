import newsService from '../../services/newsService';
import newsRepository from '../../repositories/newsRepository';
import axios from 'axios';
import { IArticleDocument } from '../../types/news.types';

jest.mock('../../repositories/newsRepository');
jest.mock('axios');

const mockedNewsRepository = newsRepository as jest.Mocked<typeof newsRepository>;
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('NewsService - fetchAndStoreNews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch from multiple sources, normalize the data, and save it to the database', async () => {

    mockedNewsRepository.findActiveSources.mockResolvedValue([
      { name: 'NewsAPI', apiKey: 'key1' },
      { name: 'The News API', apiKey: 'key2' },
    ] as any);

    const newsApiResponse = {
      data: { articles: [{ title: 'Article from NewsAPI', url: 'http://test.com/1', publishedAt: new Date() }] },
    };
    const theNewsApiResponse = {
      data: { data: [{ title: 'Article from The News API', url: 'http://test.com/2', published_at: new Date(), categories: ['Tech'] }] },
    };
    
    mockedAxios.get
      .mockResolvedValueOnce(newsApiResponse)
      .mockResolvedValueOnce(theNewsApiResponse);

    mockedNewsRepository.findOrCreateCategory
      .mockResolvedValueOnce({ _id: 'business_id', name: 'Business' } as any)
      .mockResolvedValueOnce({ _id: 'tech_id', name: 'Technology' } as any);

    mockedNewsRepository.updateArticleWithUpsert.mockResolvedValue({ upsertedCount: 1, upsertedId: 'new_article_id' });
    
    mockedNewsRepository.findArticles.mockResolvedValue([
        { title: 'Article from NewsAPI' },
        { title: 'Article from The News API' }
    ] as IArticleDocument[]);

    const newArticles = await newsService.fetchAndStoreNews();

    expect(mockedAxios.get).toHaveBeenCalledTimes(2); 
    expect(mockedNewsRepository.updateArticleWithUpsert).toHaveBeenCalledTimes(2);
    expect(newArticles).toHaveLength(2); 

    expect(mockedNewsRepository.updateArticleWithUpsert).toHaveBeenCalledWith(
      'http://test.com/1',
      expect.objectContaining({
        title: 'Article from NewsAPI',
        categoryId: 'business_id',
      })
    );

    expect(mockedNewsRepository.updateArticleWithUpsert).toHaveBeenCalledWith(
        'http://test.com/2',
        expect.objectContaining({
          title: 'Article from The News API',
          categoryId: 'tech_id',
        })
      );
  });
});
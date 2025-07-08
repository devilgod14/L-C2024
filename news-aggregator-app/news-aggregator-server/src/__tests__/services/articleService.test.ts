import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import articleService from '../../services/articleService';
import User from '../../models/User';
import Article from '../../models/Article';
import Vote from '../../models/Vote';
import Category from '../../models/Category';
import ExternalAPISource from '../../models/ExternalAPISource';
import { IUserDocument } from '../../types/auth.types';
import { IArticleDocument } from '../../types/news.types';

let mongoServer: MongoMemoryServer;
let testUser: IUserDocument;
let testArticle: IArticleDocument;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  testUser = await User.create({ username: 'voteuser', email: 'vote@test.com', password: 'password' });
  const testCategory = await Category.create({ name: 'Voting Category' });
  const testSource = await ExternalAPISource.create({ name: 'Voting Source', apiKey: '123' });
  testArticle = await Article.create({
    title: 'Article to Vote On',
    description: 'A test article.',
    url: 'http://test.com/vote',
    publishedAt: new Date(),
    categoryId: testCategory._id,
    sourceId: testSource._id,
  });
});

afterAll(async () => {
  await mongoServer.stop();
});

afterEach(async () => {
  await Vote.deleteMany({});
  await Article.findByIdAndUpdate(testArticle._id, { likes: 0, dislikes: 0 });
});


describe('ArticleService - handleVote', () => {

  it('should correctly add a "like" to an article for the first time', async () => {

    await articleService.handleVote({
      userId: testUser.id,
      articleId: testArticle.id,
      voteType: 'like',
    });

    const updatedArticle = await Article.findById(testArticle.id);
    const voteInDb = await Vote.findOne({ userId: testUser.id, articleId: testArticle.id });

    expect(updatedArticle?.likes).toBe(1);
    expect(updatedArticle?.dislikes).toBe(0);
    expect(voteInDb).toBeDefined();
    expect(voteInDb?.vote).toBe('like');
  });

  it('should correctly change a "like" to a "dislike"', async () => {
    await articleService.handleVote({ userId: testUser.id, articleId: testArticle.id, voteType: 'like' });

    await articleService.handleVote({ userId: testUser.id, articleId: testArticle.id, voteType: 'dislike' });

    const updatedArticle = await Article.findById(testArticle.id);
    const voteInDb = await Vote.findOne({ userId: testUser.id, articleId: testArticle.id });

    expect(updatedArticle?.likes).toBe(0);
    expect(updatedArticle?.dislikes).toBe(1);
    expect(voteInDb?.vote).toBe('dislike');
  });

  it('should correctly remove a "like" when the like button is pressed a second time', async () => {

    await articleService.handleVote({ userId: testUser.id, articleId: testArticle.id, voteType: 'like' });

    await articleService.handleVote({ userId: testUser.id, articleId: testArticle.id, voteType: 'like' });
    
    const updatedArticle = await Article.findById(testArticle.id);
    const voteInDb = await Vote.findOne({ userId: testUser.id, articleId: testArticle.id });

    expect(updatedArticle?.likes).toBe(0);
    expect(voteInDb).toBeNull();
  });
});
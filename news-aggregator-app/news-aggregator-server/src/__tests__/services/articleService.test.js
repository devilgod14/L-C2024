const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const articleService = require('../../services/articleService');
const User = require('../../models/User');
const Article = require('../../models/Article');
const Vote = require('../../models/Vote');
const Category = require('../../models/Category'); 
const ExternalAPISource = require('../../models/ExternalAPISource'); 

let mongoServer;
let testUser, testArticle;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  testUser = await new User({ username: 'test', email: 'test@test.com', password: 'password' }).save();
  const testCategory = await new Category({ name: 'Test Category' }).save();
  const testSource = await new ExternalAPISource({ name: 'Test Source', apiKey: '123', status: 'Active' }).save();
  testArticle = await new Article({
    title: 'Test Article',
    description: 'A test article.',
    url: 'https://test.com/article',
    publishedAt: new Date(),
    categoryId: testCategory._id,
    sourceId: testSource._id,
  }).save();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


afterEach(async () => {
  await Vote.deleteMany({});
  await Article.updateOne({ _id: testArticle._id }, { likes: 0, dislikes: 0 });
});

describe('ArticleService - handleVote', () => {

  it('should correctly register a first-time "like"', async () => {
    await articleService.handleVote({
      userId: testUser._id,
      articleId: testArticle._id,
      voteType: 'like',
    });

    const voteRecord = await Vote.findOne({ userId: testUser._id, articleId: testArticle._id });
    expect(voteRecord).toBeDefined();
    expect(voteRecord.vote).toBe('like');

    const updatedArticle = await Article.findById(testArticle._id);
    expect(updatedArticle.likes).toBe(1);
    expect(updatedArticle.dislikes).toBe(0);
  });

  it('should change a "like" to a "dislike"', async () => {
    await articleService.handleVote({ userId: testUser._id, articleId: testArticle._id, voteType: 'like' });
    await articleService.handleVote({ userId: testUser._id, articleId: testArticle._id, voteType: 'dislike' });

    const voteRecord = await Vote.findOne({ userId: testUser._id, articleId: testArticle._id });
    expect(voteRecord.vote).toBe('dislike');

    const updatedArticle = await Article.findById(testArticle._id);
    expect(updatedArticle.likes).toBe(0);
    expect(updatedArticle.dislikes).toBe(1);
  });

  it('should remove a "like" if the user likes an already-liked article', async () => {
    await articleService.handleVote({ userId: testUser._id, articleId: testArticle._id, voteType: 'like' });
    let article = await Article.findById(testArticle._id);
    expect(article.likes).toBe(1); 
    await articleService.handleVote({ userId: testUser._id, articleId: testArticle._id, voteType: 'like' });

    const voteRecord = await Vote.findOne({ userId: testUser._id, articleId: testArticle._id });
    expect(voteRecord).toBeNull();

    const updatedArticle = await Article.findById(testArticle._id);
    expect(updatedArticle.likes).toBe(0);
  });
});
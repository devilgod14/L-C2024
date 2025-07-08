import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import Article from '../../models/Article';
import SavedArticle from '../../models/SavedArticle';
import Category from '../../models/Category';
import ExternalAPISource from '../../models/ExternalAPISource';

let mongoServer: MongoMemoryServer;
let authToken: string;
let testArticle: any;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await request(app).post('/api/auth/signup').send({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });
  const res = await request(app).post('/api/auth/login').send({
    email: 'test@example.com',
    password: 'password123',
  });
  authToken = res.body.token;

  const testCategory = await Category.create({ name: 'Test' });
  const testSource = await ExternalAPISource.create({ name: 'Test', apiKey: '123' });
  testArticle = await Article.create({
    title: 'Test Article for Saving',
    description: 'A test.',
    url: 'http://test.com/save1',
    publishedAt: new Date(),
    categoryId: testCategory._id,
    sourceId: testSource._id,
  });
});

afterAll(async () => {
  await mongoServer.stop();
});

afterEach(async () => {
  await SavedArticle.deleteMany({});
});

describe('User Saved Articles API (/api/users/me/saved-articles)', () => {
  it('should initially return an empty array of saved articles', async () => {
    const response = await request(app)
      .get('/api/users/me/saved-articles')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should allow a user to save an article', async () => {
    const response = await request(app)
      .post('/api/users/me/saved-articles')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ articleId: testArticle._id });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('articleId', testArticle._id.toString());
  });

  it('should allow a user to view their saved articles', async () => {
   
    await request(app).post('/api/users/me/saved-articles').set('Authorization', `Bearer ${authToken}`).send({ articleId: testArticle._id });
    const response = await request(app)
      .get('/api/users/me/saved-articles')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].articleId.title).toBe('Test Article for Saving');
  });

  it('should allow a user to delete a saved article', async () => {
    
    const saveResponse = await request(app).post('/api/users/me/saved-articles').set('Authorization', `Bearer ${authToken}`).send({ articleId: testArticle._id });
    const savedArticleId = saveResponse.body._id;

    const deleteResponse = await request(app)
      .delete(`/api/users/me/saved-articles/${savedArticleId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(deleteResponse.statusCode).toBe(200);
    expect(deleteResponse.body.message).toBe('Article removed from saved list');

    const finalListResponse = await request(app).get('/api/users/me/saved-articles').set('Authorization', `Bearer ${authToken}`);
    expect(finalListResponse.body.length).toBe(0);
  });
});
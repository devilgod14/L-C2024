const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../../app'); 
const User = require('../../models/User');
const Article = require('../../models/Article');
const Category = require('../../models/Category');
const ExternalAPISource = require('../../models/ExternalAPISource'); 

let mongoServer;
let authToken;
let testCategory, testSource; 

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

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

  testCategory = await new Category({ name: 'Technology' }).save();
  testSource = await new ExternalAPISource({ name: 'Test Source', apiKey: '123', status: 'Active' }).save();
  
  await Article.create({
    title: 'Tech Article 1',
    description: 'A test article about tech.',
    url: 'http://test.com/tech1',
    publishedAt: new Date(),
    categoryId: testCategory._id,
    sourceId: testSource._id, 
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /api/news/headlines', () => {

  it('should return 401 Unauthorized if no token is provided', async () => {
    const res = await request(app).get('/api/news/headlines');
    expect(res.statusCode).toBe(401);
  });

  it('should return 200 and a list of articles if a valid token is provided', async () => {
    const res = await request(app)
      .get('/api/news/headlines')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter articles by category', async () => {
    const res = await request(app)
      .get('/api/news/headlines?category=Technology')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].categoryId.name).toBe('Technology');
  });
});
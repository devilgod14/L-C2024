import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import User from '../../models/User';
import Article from '../../models/Article';
import Category from '../../models/Category';
import ExternalAPISource from '../../models/ExternalAPISource';

let mongoServer: MongoMemoryServer;
let authToken: string;

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

  const testCategory = await Category.create({ name: 'Technology' });
  const testSource = await ExternalAPISource.create({ name: 'Test Source', apiKey: '123' });
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
  await mongoServer.stop();
});

describe('News API (/api/news)', () => {

  describe('GET /headlines', () => {

    it('should return a 401 Unauthorized error if no token is provided', async () => {
      const response = await request(app).get('/api/news/headlines');
      expect(response.statusCode).toBe(401);
    });

    it('should return a 200 OK status and a list of articles for an authenticated user', async () => {
      const response = await request(app)
        .get('/api/news/headlines')
        .set('Authorization', `Bearer ${authToken}`); 

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should correctly filter articles by category', async () => {
      const response = await request(app)
        .get('/api/news/headlines?category=Technology')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body[0]).toHaveProperty('title', 'Tech Article 1');
    });
  });
});
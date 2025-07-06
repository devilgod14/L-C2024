import request from 'supertest';
import app from '../../app';
import User from '../../models/User';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
});

afterAll(async () => {
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Authentication API (/api/auth)', () => {
  describe('POST /signup', () => {
    it('should create a new user and return status 201', async () => {
      const newUser = { username: 'testuser', email: 'test@example.com', password: 'password123' };
      const response = await request(app).post('/api/auth/signup').send(newUser);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/signup').send({ username: 'loginuser', email: 'login@example.com', password: 'password123' });
    });

    it('should log in an existing user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'password123' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});
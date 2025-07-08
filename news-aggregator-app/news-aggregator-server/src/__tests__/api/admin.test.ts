import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import User from '../../models/User';
import Category from '../../models/Category';

let mongoServer: MongoMemoryServer;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await User.create({
    username: 'admin', email: 'admin@example.com',
    password: await require('bcryptjs').hash('password123', 10),
    role: 'Admin'
  });
  const adminRes = await request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'password123' });
  adminToken = adminRes.body.token;

  await request(app).post('/api/auth/signup').send({ username: 'user', email: 'user@example.com', password: 'password123' });
  const userRes = await request(app).post('/api/auth/login').send({ email: 'user@example.com', password: 'password123' });
  userToken = userRes.body.token;
});


afterAll(async () => {
  await mongoServer.stop();
});

afterEach(async () => {
  await Category.deleteMany({});
});


describe('Admin API (/api/admin)', () => {

  describe('POST /categories', () => {

    it('should allow an admin to add a new category and return 201', async () => {
      const response = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`) 
        .send({ name: 'New Admin Category' });
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('name', 'New admin category');
    });

    it('should prevent a regular user from adding a category and return 401', async () => {
      const response = await request(app)
        .post('/api/admin/categories')
        .set('Authorization', `Bearer ${userToken}`) 
        .send({ name: 'User Category Attempt' });

      expect(response.statusCode).toBe(401);
    });

    it('should prevent adding a category if no token is provided and return 401', async () => {
        const response = await request(app)
          .post('/api/admin/categories')
          .send({ name: 'No Token Category' });
  
        expect(response.statusCode).toBe(401);
    });
  });
  
});
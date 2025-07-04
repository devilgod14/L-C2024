const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const User = require('../../../dist/models/User').default; 
const Category = require('../../../dist/models/Category').default; 

let mongoServer;
let adminToken;
let userToken;

// Setup
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Manually create an Admin user in the test DB
  const adminPassword = await require('bcryptjs').hash('password123', 10);
  await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password: adminPassword,
    role: 'Admin',
  });
  
  const adminRes = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'password123',
  });
  adminToken = adminRes.body.token;

  // Create a regular user
  await request(app).post('/api/auth/signup').send({
    username: 'user',
    email: 'user@example.com',
    password: 'password123',
  });
  const userRes = await request(app).post('/api/auth/login').send({
    email: 'user@example.com',
    password: 'password123',
  });
  userToken = userRes.body.token;
});

// Teardown
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Category.deleteMany({});
});

describe('POST /api/admin/categories', () => {
  it('should allow an admin to add a new category', async () => {
    const res = await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Admin Category' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Admin Category');
  });

  it('should prevent a regular user from adding a category', async () => {
    const res = await request(app)
      .post('/api/admin/categories')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'User Category' });
      
    expect(res.statusCode).toBe(403);
  });
});
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app'); 
const User = require('../../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('POST /api/auth/signup', () => {

  it('should create a new user and return status 201', async () => {

    const newUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const res = await request(app)
      .post('/api/auth/signup')
      .send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).not.toHaveProperty('password'); 
  });

  it('should return status 400 if email already exists', async () => {

    const existingUser = {
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123',
    };
    await request(app).post('/api/auth/signup').send(existingUser);

    const duplicateUser = {
        username: 'anotheruser',
        email: 'existing@example.com',
        password: 'password456',
    };
    const res = await request(app)
      .post('/api/auth/signup')
      .send(duplicateUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already exists with that email');
  });

});

describe('POST /api/auth/login', () => {

  it('should log in an existing user and return a token', async () => {

    const userData = { username: 'loginuser', email: 'login@example.com', password: 'password123' };
    await request(app).post('/api/auth/signup').send(userData);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should return 401 for incorrect password', async () => {

    const userData = { username: 'loginuser2', email: 'login2@example.com', password: 'password123' };
    await request(app).post('/api/auth/signup').send(userData);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should return 401 for a non-existent user', async () => {
 
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nouser@example.com', password: 'password123' });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

});
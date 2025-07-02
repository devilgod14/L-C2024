const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { registerUser, loginUser } = require('../../services/authService');
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

describe('AuthService - registerUser', () => {

  it('should register a new user successfully with a hashed password', async () => {

    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const newUser = await registerUser(userData);

    expect(newUser).toBeDefined();
    expect(newUser.email).toBe(userData.email);

    const userInDb = await User.findById(newUser._id);
    expect(userInDb).toBeDefined();

    expect(userInDb.password).toBeDefined();
    expect(userInDb.password).not.toBe(userData.password);
  });

  it('should throw an error if the email is already in use', async () => {

    const existingUserData = {
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123',
    };
    await registerUser(existingUserData);

    const duplicateUserData = {
      username: 'anotheruser',
      email: 'existing@example.com', 
      password: 'password456',
    };

    await expect(registerUser(duplicateUserData))
      .rejects
      .toThrow('User already exists with that email');
  });
});
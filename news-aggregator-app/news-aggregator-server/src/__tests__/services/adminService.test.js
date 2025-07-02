const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const adminService = require('../../services/adminService');
const Category = require('../../models/Category');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Category.deleteMany({});
});

describe('AdminService', () => {
  
  it('should add a new category successfully', async () => {
    const newCategory = await adminService.addCategory('Technology');

    expect(newCategory).toBeDefined();
    expect(newCategory.name).toBe('Technology');
    const foundCategory = await Category.findOne({ name: 'Technology' });
    expect(foundCategory).not.toBeNull();
  });

  it('should throw an error if the category already exists', async () => {
    await adminService.addCategory('Business');
    await expect(adminService.addCategory('Business'))
      .rejects
      .toThrow('Category already exists.');
  });
  
});
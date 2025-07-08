import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../app';
import NotificationSetting from '../../models/NotificationSetting';

let mongoServer: MongoMemoryServer;
let authToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
    
  await request(app).post('/api/auth/signup').send({ username: 'notifuser', email: 'notif@example.com', password: 'password123' });
  const res = await request(app).post('/api/auth/login').send({ email: 'notif@example.com', password: 'password123' });
  authToken = res.body.token;
});

afterAll(async () => {
  await mongoServer.stop();
});

afterEach(async () => {
  await NotificationSetting.deleteMany({});
});

describe('Notification Settings API (/api/notifications/settings)', () => {
  
  it('should get default settings for a new user', async () => {
    const response = await request(app)
      .get('/api/notifications/settings')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.enabledCategories).toEqual([]);
    expect(response.body.keywords).toEqual([]);
  });

  it('should allow a user to update their settings', async () => {
    const newSettings = {
      enabledCategories: ['Business', 'Sports'],
      keywords: ['Tesla', 'World Cup'],
    };

    const response = await request(app)
      .put('/api/notifications/settings')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newSettings);

    expect(response.statusCode).toBe(200);
    expect(response.body.enabledCategories).toEqual(['Business', 'Sports']);
    expect(response.body.keywords).toEqual(['Tesla', 'World Cup']);
  });

});
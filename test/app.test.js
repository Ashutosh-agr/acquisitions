import app from '#src/app.js';
import request from 'supertest';

describe('API Endpoint', () => {
  describe('GET /health', () => {
    it('Should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api', () => {
    it('Should return api message', async () => {
      const response = await request(app).get('/api').expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
    });
  });

  describe('GET /nonexistent', () => {
    it('Should return nonexistent route', async () => {
      const response = await request(app).get('/nonexistent').expect(404);

      expect(response.body).toHaveProperty('message', 'Route Not Found');
    });
  });
});

const request = require('supertest');
const { app } = require('../server');

describe('Server', () => {
  it('should respond with 404 for unknown route', async () => {
    const res = await request(app).get('/randomroute');
    expect(res.status).toBe(404);
  });

  it('should respond with 200 for root route', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  it('should respond with 200 for users route', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
  });

  it('should respond with 200 for animals route', async () => {
    const res = await request(app).get('/animals');
    expect(res.status).toBe(200);
  });
});

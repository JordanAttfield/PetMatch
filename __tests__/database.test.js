const mongoose = require('mongoose');
const { app, server } = require('../server');
const request = require('supertest');
const Animal = require('../models/animal');

let token;

beforeAll(async () => {
  const userData = {
    username: 'jordanattfield',
    password: '123',
  };
  const response = await request(app).post('/users/login').send(userData);
  token = response.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Get all animals', () => {
  beforeAll(async () => {
    await Animal.deleteMany();
    await Animal.create([
      {
        animalType: 'Dog',
        name: 'Lucy',
        age: 2,
        sex: 'Female',
        medications: 'None',
        notes: 'None',
        adopted: false,
      },
      {
        animalType: 'Cat',
        name: 'Tom',
        age: 3,
        sex: 'Male',
        medications: 'None',
        notes: 'Friendly and playful',
        adopted: true,
      },
    ]);
  });

  it('gets all animals', async () => {
    const response = await request(app)
      .get('/animals')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('returns 404 if there are no animals', async () => {
    await Animal.deleteMany();

    const response = await request(app)
      .get('/animals')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'No animals were found');
  });
});

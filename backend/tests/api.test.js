const request = require('supertest');
const app = require('../server'); // Make sure you export your Express app from app.js

const testUser = {
  users_name: 'Test User',
  phone_number: '+96171123456',
  description: 'Testing',
  operator_name: 'Touch',
  country_name: 'Lebanon',
  country_code: '+961',
};

describe('Mobile System API', () => {
  it('should add a new user', async () => {
    const response = await request(app).post('/adduser').send(testUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.user.phone_nbr).toBe(testUser.phone_number);
  });

  it('should get all users', async () => {
    const response = await request(app).get('/getallusers');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  it('should update a user', async () => {
    const updatedUser = { ...testUser, description: 'Updated' };
    const response = await request(app).put(`/edituser/${testUser.phone_number}`).send(updatedUser);
    expect(response.statusCode).toBe(200);
  });

  it('should delete a user', async () => {
    const response = await request(app).delete(`/deleteuser/${testUser.phone_number}`);
    expect(response.statusCode).toBe(200);
  });
});

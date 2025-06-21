const request = require('supertest');
const express = require('express');
const cloudinaryRoute = require('../routes/cloudinary');

const app = express();
app.use(express.json());
app.use('/api/cloudinary', cloudinaryRoute);

describe('POST /api/cloudinary/delete', () => {
  it('requires publicId', async () => {
    const res = await request(app).post('/api/cloudinary/delete').send({});
    expect(res.status).toBe(400);
  });
});

const request = require('supertest');
const express = require('express');

jest.mock('../models/products', () => {
  return {
    Product: {
      countDocuments: jest.fn().mockResolvedValue(1),
      find: jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([{ _id: '1', name: 'Product1' }])
      })
    }
  };
});

const productRoute = require('../routes/products');

const app = express();
app.use(express.json());
app.use('/api/products', productRoute);

describe('GET /api/products', () => {
  it('returns product list', async () => {
    const res = await request(app).get('/api/products?page=1&perPage=1');
    expect(res.status).toBe(200);
    expect(res.body.products).toEqual([{ _id: '1', name: 'Product1' }]);
  });
});

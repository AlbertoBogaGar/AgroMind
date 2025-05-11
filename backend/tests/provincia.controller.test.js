const request = require('supertest');
const express = require('express');

jest.mock('../models/Provincia', () => ({
  findAll: jest.fn()
}));

const Provincia = require('../models/Provincia');
const parcelaRouter = require('../routes/parcelaRoutes');

const app = express();
app.use(express.json());
app.use('/api/parcela', parcelaRouter);
describe('GET /api/parcela/provincias', () => {
    test('devuelve la lista de provincias correctamente', async () => {
      Provincia.findAll.mockResolvedValue([
        { id: 1, nombre: 'Ávila' },
        { id: 2, nombre: 'Salamanca' }
      ]);
  
      const res = await request(app).get('/api/parcela/provincias');
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(res.body[0].nombre).toBe('Ávila');
    });
  
    test('devuelve 500 si ocurre un error al obtener provincias', async () => {
      Provincia.findAll.mockRejectedValue(new Error('Fallo en la base de datos'));
  
      const res = await request(app).get('/api/parcela/provincias');
  
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Error en el servidor');
    });
  });
  
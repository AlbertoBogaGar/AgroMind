const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

jest.mock('../models/Parcela', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock('../models/Provincia', () => ({}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => ({ id: 1 }))
}));

jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
  req.usuario = { id: 1 };
  next();
});

const Parcela = require('../models/Parcela');
const parcelaRouter = require('../routes/parcelaRoutes');

const app = express();
app.use(express.json());
app.use('/api/parcela', parcelaRouter);

describe('ParcelaController', () => {
  describe('GET /api/parcela', () => {
    test('devuelve la parcela del usuario', async () => {
      Parcela.findOne.mockResolvedValue({
        id: 1,
        tamaño: 100,
        latitud: '40.41',
        longitud: '-3.70',
        Provincia: { nombre: 'Ávila' }
      });

      const res = await request(app)
        .get('/api/parcela')
        .set('Authorization', 'Bearer faketoken');

      expect(res.statusCode).toBe(200);
      expect(res.body.parcela.tamaño).toBe(100);
    });
  });

  describe('POST /api/parcela', () => {
    test('crea una nueva parcela si los datos son válidos', async () => {
      Parcela.create.mockResolvedValue({
        id: 1,
        idUsuario: 1,
        tamaño: 200,
        latitud: '41.38',
        longitud: '-5.43',
        idProvincia: 10
      });

      const res = await request(app).post('/api/parcela').send({
        tamaño: 200,
        latitud: '41.38',
        longitud: '-5.43',
        idProvincia: 10
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Parcela registrada correctamente');
    });

    test('devuelve 400 si faltan campos', async () => {
      const res = await request(app).post('/api/parcela').send({
        tamaño: 200
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Todos los campos son obligatorios.');
    });
  });

  describe('PUT /api/parcela/ubicacion', () => {
    test('actualiza ubicación si la parcela existe', async () => {
      const mockSave = jest.fn().mockResolvedValue();
      Parcela.findOne.mockResolvedValue({
        id: 1,
        latitud: '0',
        longitud: '0',
        save: mockSave
      });

      const res = await request(app).put('/api/parcela/ubicacion').send({
        latitud: '42.0',
        longitud: '-5.0'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Ubicación de la parcela actualizada correctamente.');
      expect(mockSave).toHaveBeenCalled();
    });

    test('devuelve 404 si la parcela no existe', async () => {
      Parcela.findOne.mockResolvedValue(null);

      const res = await request(app).put('/api/parcela/ubicacion').send({
        latitud: '42.0',
        longitud: '-5.0'
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Parcela no encontrada para este usuario.');
    });

    test('devuelve 400 si faltan latitud o longitud', async () => {
      const res = await request(app).put('/api/parcela/ubicacion').send({
        latitud: ''
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Latitud y longitud son requeridas.');
    });
  });
});

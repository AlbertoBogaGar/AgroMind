const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

jest.mock('../models/Actividad', () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn()
}));

jest.mock('../models/Parcela', () => ({
  findOne: jest.fn()
}));

jest.mock('../models/Cultivo', () => ({
  findAll: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => ({ id: 1 }))
}));

jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
  req.usuario = { id: 1 };
  next();
});

const Actividad = require('../models/Actividad');
const Parcela = require('../models/Parcela');
const Cultivo = require('../models/Cultivo');
const actividadRouter = require('../routes/actividadRoutes');

const app = express();
app.use(express.json());
app.use('/api/actividad', actividadRouter);
describe('POST /api/actividad/crear', () => {
    test('crea una nueva actividad', async () => {
      Actividad.create.mockResolvedValue({ id: 1, titulo: 'Riego' });
  
      const res = await request(app).post('/api/actividad/crear').send({
        idCultivo: 1,
        titulo: 'Riego',
        descripcion: 'Regar el cultivo',
        fechaSugerida: '2025-05-10'
      });
  
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Actividad creada');
    });
  
    test('devuelve 400 si faltan datos', async () => {
      const res = await request(app).post('/api/actividad/crear').send({
        titulo: 'Faltan datos'
      });
  
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Faltan datos obligatorios');
    });
  });
  describe('GET /api/actividad/cultivo/:idCultivo', () => {
    test('devuelve actividades del cultivo', async () => {
      Parcela.findOne.mockResolvedValue({ id: 1 });
      Cultivo.findAll.mockResolvedValue([{ id: 1 }]);
      Actividad.findAll.mockResolvedValue([{ id: 1, titulo: 'Riego' }]);
  
      const res = await request(app).get('/api/actividad/cultivo/1').set('Authorization', 'Bearer faketoken');
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  
    test('devuelve 404 si no hay parcela', async () => {
      Parcela.findOne.mockResolvedValue(null);
  
      const res = await request(app).get('/api/actividad/cultivo/1').set('Authorization', 'Bearer faketoken');
  
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Parcela no encontrada');
    });
  });
  describe('PUT /api/actividad/:id/completar', () => {
    test('marca actividad como completada', async () => {
      const mockSave = jest.fn().mockResolvedValue();
      Actividad.findByPk.mockResolvedValue({ id: 1, estado: 'pendiente', save: mockSave });
  
      const res = await request(app).put('/api/actividad/1/completar');
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Actividad completada');
    });
  
    test('devuelve 404 si no existe', async () => {
      Actividad.findByPk.mockResolvedValue(null);
  
      const res = await request(app).put('/api/actividad/1/completar');
  
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Actividad no encontrada.');
    });
  });
  describe('GET /api/actividad', () => {
    test('devuelve todas las actividades pendientes del usuario', async () => {
      Parcela.findOne.mockResolvedValue({ id: 1 });
      Cultivo.findAll.mockResolvedValue([{ id: 1 }]);
      Actividad.findAll.mockResolvedValue([{ id: 1, titulo: 'Revisión' }]);
  
      const res = await request(app).get('/api/actividad').set('Authorization', 'Bearer faketoken');
  
      expect(res.statusCode).toBe(200);
      expect(res.body[0].titulo).toBe('Revisión');
    });
  });
  describe('DELETE /api/actividad/:idActividad', () => {
    test('elimina la actividad', async () => {
      Actividad.destroy.mockResolvedValue(1);
  
      const res = await request(app).delete('/api/actividad/1');
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Actividad eliminada correctamente.');
    });
  
    test('devuelve 404 si la actividad no existe', async () => {
      Actividad.destroy.mockResolvedValue(0);
  
      const res = await request(app).delete('/api/actividad/1');
  
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Actividad no encontrada.');
    });
  });
  

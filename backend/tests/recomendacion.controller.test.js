const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => ({ id: 1 }))
}));

jest.mock('../models/Parcela', () => ({
  findOne: jest.fn()
}));

jest.mock('../models/Cultivo', () => ({
  findAll: jest.fn()
}));

jest.mock('../models/TipoCultivo', () => ({}));

jest.mock('../models/MeteorologiaProvincias', () => ({
  findOne: jest.fn()
}));

jest.mock('../models/Recomendaciones', () => ({
  findAll: jest.fn(),
  create: jest.fn()
}));

jest.mock('../services/geminiServices', () => ({
  generarRecomendacionesCultivo: jest.fn()
}));

jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
  req.usuario = { id: 1 };
  next();
});

const Parcela = require('../models/Parcela');
const Cultivo = require('../models/Cultivo');
const Meteorologia = require('../models/MeteorologiaProvincias');
const Recomendaciones = require('../models/Recomendaciones');
const { generarRecomendacionesCultivo } = require('../services/geminiServices');

const recomendacionRouter = require('../routes/recomendacionRoutes');
const app = express();
app.use(express.json());
app.use('/api/recomendacion', recomendacionRouter);
describe('GET /api/recomendacion', () => {
    test('devuelve 404 si no hay parcela', async () => {
      Parcela.findOne.mockResolvedValue(null);
  
      const res = await request(app).get('/api/recomendacion');
  
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Parcela no encontrada');
    });
  
    test('devuelve 404 si no hay cultivos activos', async () => {
      Parcela.findOne.mockResolvedValue({ id: 1 });
      Cultivo.findAll.mockResolvedValue([]);
  
      const res = await request(app).get('/api/recomendacion');
  
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('No hay cultivos');
    });
  
    test('devuelve recomendaciones existentes si ya hay', async () => {
      Parcela.findOne.mockResolvedValue({ id: 1 });
      Cultivo.findAll.mockResolvedValue([{ id: 1, tipoCultivo: { nombre: 'Tomate' } }]);
      Recomendaciones.findAll.mockResolvedValue([{ id: 1, titulo: 'Evita riego' }]);
  
      const res = await request(app).get('/api/recomendacion');
  
      expect(res.statusCode).toBe(200);
      expect(res.body.recomendaciones.length).toBe(1);
      expect(res.body.recomendaciones[0].titulo).toBe('Evita riego');
    });
  
    test('genera nuevas recomendaciones si no hay previas', async () => {
      Parcela.findOne.mockResolvedValue({ id: 1, idProvincia: 47 });
      Cultivo.findAll.mockResolvedValue([{ id: 1, tipoCultivo: { nombre: 'Lechuga' } }]);
      Recomendaciones.findAll.mockResolvedValue([]);
      Meteorologia.findOne.mockResolvedValue({ temperatura: 22 });
      generarRecomendacionesCultivo.mockResolvedValue([
        {
          idCultivo: 1,
          tipo: 'riego',
          titulo: 'Recomendación de riego',
          descripcion: 'Riega en la mañana'
        }
      ]);
      Recomendaciones.create.mockResolvedValue({
        id: 1,
        titulo: 'Recomendación de riego'
      });
  
      const res = await request(app).get('/api/recomendacion');
  
      expect(res.statusCode).toBe(200);
      expect(res.body.recomendaciones[0].titulo).toBe('Recomendación de riego');
    });
  });
  describe('GET /api/recomendacion/cultivo/:idCultivo', () => {
    test('devuelve recomendaciones del cultivo', async () => {
      Recomendaciones.findAll.mockResolvedValue([
        { id: 1, idCultivo: 1, titulo: 'Riego controlado' }
      ]);
  
      const res = await request(app).get('/api/recomendacion/cultivo/1');
  
      expect(res.statusCode).toBe(200);
      expect(res.body.recomendaciones[0].titulo).toBe('Riego controlado');
    });
  
    test('devuelve vacío si no hay recomendaciones', async () => {
      Recomendaciones.findAll.mockResolvedValue([]);
  
      const res = await request(app).get('/api/recomendacion/cultivo/99');
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.recomendaciones)).toBe(true);
      expect(res.body.recomendaciones.length).toBe(0);
    });
  });
  
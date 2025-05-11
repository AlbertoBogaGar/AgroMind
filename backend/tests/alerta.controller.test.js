const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

jest.mock('axios');
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => ({ id: 1 }))
}));
jest.mock('../services/geminiServices', () => ({
  generarAlertasClima: jest.fn()
}));
jest.mock('../models/Parcela', () => ({
  findOne: jest.fn()
}));
jest.mock('../models/Alerta', () => ({
  findAll: jest.fn(),
  create: jest.fn()
}));
jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
  req.usuario = { id: 1 };
  next();
});

const Parcela = require('../models/Parcela');
const Alerta = require('../models/Alerta');
const { generarAlertasClima } = require('../services/geminiServices');
const weatherRouter = require('../routes/weatherRoutes');

const app = express();
app.use(express.json());
app.use('/api/weather', weatherRouter);
describe('GET /api/weather/alertas-clima', () => {
    test('devuelve 404 si no hay parcela', async () => {
      Parcela.findOne.mockResolvedValue(null);
  
      const res = await request(app)
        .get('/api/weather/alertas-clima')
        .set('Authorization', 'Bearer faketoken');
  
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Parcela no encontrada');
    });
  
    test('devuelve alertas existentes si ya hay', async () => {
      Parcela.findOne.mockResolvedValue({ id: 1 });
      Alerta.findAll.mockResolvedValue([{ id: 1, titulo: 'Lluvia fuerte' }]);
  
      const res = await request(app)
        .get('/api/weather/alertas-clima')
        .set('Authorization', 'Bearer faketoken');
  
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.alertas)).toBe(true);
      expect(res.body.alertas[0].titulo).toBe('Lluvia fuerte');
    });
  
    test('genera nuevas alertas si no hay previas', async () => {
      Parcela.findOne.mockResolvedValue({ id: 1, latitud: 40.4, longitud: -3.7 });
      Alerta.findAll.mockResolvedValue([]);
      axios.get.mockResolvedValue({
        data: {
          daily: {
            temperature_2m_max: [25],
            temperature_2m_min: [12],
            precipitation_probability_max: [90],
            fecha: ['2025-05-10']
          }
        }
      });
  
      generarAlertasClima.mockResolvedValue([
        {
          tipo: 'lluvia',
          titulo: 'Probabilidad de lluvia',
          mensaje: 'Alta probabilidad de lluvia',
          fechaInicio: '2025-05-10',
          fechaFin: '2025-05-10'
        }
      ]);
  
      Alerta.create.mockResolvedValue({
        id: 1,
        titulo: 'Probabilidad de lluvia'
      });
  
      const res = await request(app)
        .get('/api/weather/alertas-clima')
        .set('Authorization', 'Bearer faketoken');
  
      expect(res.statusCode).toBe(200);
      expect(res.body.alertas.length).toBeGreaterThan(0);
      expect(res.body.alertas[0].titulo).toBe('Probabilidad de lluvia');
    });
  });
  
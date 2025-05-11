const request = require('supertest');
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');

jest.mock('axios');
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => ({ id: 1 }))
}));
jest.mock('../models/Parcela', () => ({
  findOne: jest.fn()
}));
jest.mock('../models/MeteorologiaProvincias', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));
jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
  req.usuario = { id: 1 };
  next();
});

const Parcela = require('../models/Parcela');
const Meteorologia = require('../models/MeteorologiaProvincias');
const weatherRouter = require('../routes/weatherRoutes');

const app = express();
app.use(express.json());
app.use('/api/weather', weatherRouter);
describe('GET /api/weather/current-live', () => {
    test('devuelve clima actual con estado interpretado', async () => {
      Parcela.findOne.mockResolvedValue({ latitud: 40, longitud: -4 });
      axios.get.mockResolvedValue({
        data: {
          current: {
            temperature_2m: 20,
            relative_humidity_2m: 50,
            wind_speed_10m: 10,
            cloud_cover: 60
          }
        }
      });
  
      const res = await request(app).get('/api/weather/current-live');
      expect(res.statusCode).toBe(200);
      expect(res.body.estado).toBe('Nublado');
    });
  });
  describe('GET /api/weather/daily', () => {
    test('clima diario ya registrado', async () => {
      Parcela.findOne.mockResolvedValue({ idProvincia: 1 });
      Meteorologia.findOne.mockResolvedValue({});
  
      const res = await request(app).get('/api/weather/daily');
      expect(res.statusCode).toBe(200);
      expect(res.body.mensaje).toBe('Clima diario ya registrado.');
    });
  
    test('guarda clima diario si no existe', async () => {
      Parcela.findOne.mockResolvedValue({
        idProvincia: 1,
        latitud: 40,
        longitud: -4
      });
      Meteorologia.findOne.mockResolvedValue(null);
      axios.get.mockResolvedValue({
        data: {
          daily: {
            temperature_2m_min: [10],
            temperature_2m_max: [20],
            relative_humidity_2m_mean: [50],
            showers_sum: [2],
            precipitation_hours: [1],
            wind_speed_10m_max: [12],
            precipitation_probability_max: [80],
            sunrise: ['06:00'],
            sunset: ['20:00'],
            daylight_duration: [840],
            sunshine_duration: [600]
          }
        }
      });
  
      const res = await request(app).get('/api/weather/daily');
      expect(res.statusCode).toBe(201);
      expect(res.body.mensaje).toBe('Clima diario guardado correctamente.');
    });
  });
  describe('GET /api/weather/sol-info/:idProvincia', () => {
    test('devuelve hora de salida y puesta del sol', async () => {
      Meteorologia.findOne.mockResolvedValue({
        salida_sol: '06:30',
        puesta_sol: '20:45'
      });
  
      const res = await request(app).get('/api/weather/sol-info/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.salidaSol).toBe('06:30');
    });
  
    test('404 si no hay datos solares', async () => {
      Meteorologia.findOne.mockResolvedValue(null);
      const res = await request(app).get('/api/weather/sol-info/1');
      expect(res.statusCode).toBe(404);
    });
  });
  
const request = require('supertest');
const express = require('express');

jest.mock('../services/geminiServices', () => ({
  generarRespuestaLibreIA: jest.fn()
}));
jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
  req.usuario = { id: 1 };
  next();
});

const { generarRespuestaLibreIA } = require('../services/geminiServices');
const asistenteRouter = require('../routes/asistenteRoutes');

const app = express();
app.use(express.json());
app.use('/api/asistente', asistenteRouter);
describe('POST /api/asistente/preguntar', () => {
    test('devuelve una respuesta generada por la IA', async () => {
      generarRespuestaLibreIA.mockResolvedValue('Claro, puedo ayudarte con eso.');
  
      const res = await request(app)
        .post('/api/asistente/preguntar')
        .send({ pregunta: '¿Qué puedo plantar en mayo?' });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.respuesta).toBe('Claro, puedo ayudarte con eso.');
    });
  
    test('devuelve 400 si la pregunta está vacía', async () => {
      const res = await request(app)
        .post('/api/asistente/preguntar')
        .send({ pregunta: '   ' });
  
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('La pregunta no puede estar vacía.');
    });
  
    test('devuelve 500 si hay error en Gemini', async () => {
      generarRespuestaLibreIA.mockRejectedValue(new Error('Fallo en IA'));
  
      const res = await request(app)
        .post('/api/asistente/preguntar')
        .send({ pregunta: '¿Qué puedo plantar en mayo?' });
  
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Error al generar la respuesta con Gemini.');
    });
  });
  
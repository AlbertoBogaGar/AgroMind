const request = require('supertest');
const express = require('express');

jest.mock('../models/TipoCultivo', () => ({
  findAll: jest.fn()
}));

const TipoCultivo = require('../models/TipoCultivo');
const tipoCultivoRouter = require('../routes/tipoCultivoRoutes');

const app = express();
app.use(express.json());
app.use('/api/tipoCultivo', tipoCultivoRouter);
describe('GET /api/tipoCultivo', () => {
  test('devuelve lista de tipos de cultivo', async () => {
    TipoCultivo.findAll.mockResolvedValue([
      { id: 1, nombre: 'Tomate' },
      { id: 2, nombre: 'Lechuga' }
    ]);

    const res = await request(app).get('/api/tipoCultivo');

    expect(res.statusCode).toBe(200);
    expect(res.body.tipoCultivo.length).toBe(2);
    expect(res.body.tipoCultivo[0].nombre).toBe('Tomate');
  });

  test('devuelve 500 si ocurre un error', async () => {
    TipoCultivo.findAll.mockRejectedValue(new Error('Error de DB'));

    const res = await request(app).get('/api/tipoCultivo');

    expect(res.statusCode).toBe(500); 
  });
});
const obtenerTipoCultivo = async (req, res) => {
  try {
    const tipoCultivo = await TipoCultivo.findAll();
    res.json({ tipoCultivo });
  } catch (error) {
    console.error("Error al obtener tipos de cultivo:", error.message);
    res.status(500).json({ error: "Error al obtener tipos de cultivo" });
  }
};

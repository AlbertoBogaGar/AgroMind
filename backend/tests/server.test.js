const request = require('supertest');
const app = require("../server"); 

jest.mock('../config/database', () => ({
  authenticate: jest.fn().mockResolvedValue(),
  sync: jest.fn().mockResolvedValue()
}));


jest.mock('../routes/authRoutes', () => require('express').Router());
jest.mock('../routes/parcelaRoutes', () => require('express').Router());
jest.mock('../routes/cultivoRoutes', () => require('express').Router());
jest.mock('../routes/tipoCultivoRoutes', () => require('express').Router());
jest.mock('../routes/weatherRoutes', () => require('express').Router());
jest.mock('../routes/recomendacionRoutes', () => require('express').Router());
jest.mock('../routes/asistenteRoutes', () => require('express').Router());
jest.mock('../routes/actividadRoutes', () => require('express').Router());

jest.mock('../models/associations', () => {}); 


describe("Archivo server.js", () => {
  test("GET / debería devolver mensaje de estado", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("API AgroMind funcionando");
  });
});

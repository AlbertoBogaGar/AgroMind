const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const cultivoRouter = require("../routes/cultivoRoutes");

// Mocks globales de modelos y servicios
jest.mock("../services/unsplashServices", () => ({
  getRandomImageByQuery: jest
    .fn()
    .mockResolvedValue("https://fakeimage.com/image.jpg"),
}));

jest.mock("../models/Cultivo", () => ({
  create: jest.fn().mockResolvedValue({ id: 1 }),
  destroy: jest.fn().mockResolvedValue(1),
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("../models/TipoCultivo", () => ({
  findByPk: jest.fn().mockResolvedValue({ id: 1, nombre: "Tomate" }),
}));

jest.mock("../models/Parcela", () => ({
  findOne: jest.fn().mockResolvedValue({ id: 99, idUsuario: 1 }),
}));

jest.mock("../models/Actividad", () => ({
  destroy: jest.fn().mockResolvedValue(1),
}));

jest.mock("../models/Recomendaciones", () => ({
  destroy: jest.fn().mockResolvedValue(1),
}));

// App global para la mayoría de tests
const app = express();
app.use(express.json());

// Middleware simulado para autenticación
app.use((req, res, next) => {
  req.header = () => "Bearer faketoken";
  jwt.verify = () => ({ id: 1 });
  req.usuario = { id: 1 };
  next();
});

app.use("/api/cultivo", cultivoRouter);

// Tests
describe("CultivoController", () => {
  test("POST /api/cultivo debe crear un cultivo", async () => {
    const res = await request(app).post("/api/cultivo").send({
      idTipoCultivo: 1,
      fechaSiembra: "2024-05-25",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(1);
  });

  test("DELETE /api/cultivo/eliminar/:id debe eliminar un cultivo", async () => {
    const res = await request(app).delete("/api/cultivo/eliminar/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Cultivo eliminado correctamente.");
  });

  test("GET /api/cultivo debe devolver cultivos con imagen", async () => {
    const mockCultivos = [
      {
        toJSON: () => ({
          id: 1,
          idTipoCultivo: 1,
          idParcela: 99,
          fechaSiembra: "2024-05-01",
          tipoCultivo: { nombre: "Tomate", cicloVida: "Corto" },
        }),
        tipoCultivo: { nombre: "Tomate" },
      },
    ];

    const { findAll } = require("../models/Cultivo");
    findAll.mockResolvedValue(mockCultivos);

    const res = await request(app).get("/api/cultivo");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("imagen");
  });

  test("PUT /api/cultivo/:id/cosechar debe marcar el cultivo como cosechado", async () => {
    const mockSave = jest.fn().mockResolvedValue();
    const mockCultivo = {
      id: 1,
      estado: "activo",
      save: mockSave,
    };

    const Cultivo = require("../models/Cultivo");
    Cultivo.findByPk.mockResolvedValue(mockCultivo);

    const res = await request(app).put("/api/cultivo/1/cosechar");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Cultivo cosechado correctamente");
    expect(mockCultivo.estado).toBe("cosechado");
    expect(mockSave).toHaveBeenCalled();
  });
});

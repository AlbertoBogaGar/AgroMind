const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usuarioRouter = require('../routes/authRoutes');

jest.mock('../models/Usuario', () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn()
}));

jest.mock('../models/Parcela', () => ({
  findOne: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock-token'),
  verify: jest.fn(() => ({ id: 1 }))
}));

const Usuario = require('../models/Usuario');
const Parcela = require('../models/Parcela');

// App simulada
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.header = () => 'Bearer faketoken';
  req.usuario = { id: 1 }; // simula usuario autenticado
  next();
});

app.use('/api/usuario', usuarioRouter);

describe('UsuarioController', () => {
  describe('POST /api/usuario/register', () => {
    test('devuelve 400 si el correo ya está registrado', async () => {
      Usuario.findOne.mockResolvedValue({ id: 1 });

      const res = await request(app).post('/api/usuario/register').send({
        nombre: 'Test',
        email: 'test@mail.com',
        password: '123456'
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('El correo ya está registrado');
    });

    test('registra correctamente al usuario', async () => {
      Usuario.findOne.mockResolvedValue(null);
      Usuario.create.mockResolvedValue({ id: 1 });

      const res = await request(app).post('/api/usuario/register').send({
        nombre: 'Nuevo',
        email: 'nuevo@mail.com',
        password: '123456'
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Usuario registrado correctamente');
    });
  });

  describe('POST /api/usuario/login', () => {
    test('devuelve 401 si las credenciales son incorrectas', async () => {
      Usuario.findOne.mockResolvedValue({ password: 'hash123' });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post('/api/usuario/login').send({
        email: 'x@mail.com',
        password: 'wrongpass'
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Credenciales incorrectas');
    });

    test('devuelve token y usuario si el login es correcto', async () => {
      Usuario.findOne.mockResolvedValue({
        id: 1,
        nombre: 'Usuario',
        email: 'user@mail.com',
        password: 'hashed-password'
      });

      Parcela.findOne.mockResolvedValue({ id: 88 });
      bcrypt.compare.mockResolvedValue(true);

      const res = await request(app).post('/api/usuario/login').send({
        email: 'user@mail.com',
        password: '123456'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBe('mock-token');
      expect(res.body.usuario.email).toBe('user@mail.com');
      expect(res.body.tieneParcela).toBe(true);
    });
  });

  describe('GET /api/usuario/perfil', () => {
    test('devuelve perfil si existe', async () => {
      Usuario.findByPk.mockResolvedValue({
        id: 1,
        nombre: 'Usuario',
        email: 'user@mail.com'
      });

      const res = await request(app).get('/api/usuario/perfil');

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe('user@mail.com');
    });

    test('devuelve 404 si no existe', async () => {
      Usuario.findByPk.mockResolvedValue(null);

      const res = await request(app).get('/api/usuario/perfil');

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Usuario no encontrado');
    });
  });

  describe('PUT /api/usuario/perfil/actualizar', () => {
    test('actualiza nombre y email del usuario', async () => {
        jest.mock('../middleware/authMiddleware', () => (req, res, next) => {
            req.usuario = { id: 1 };
            next();
          });
      const mockSave = jest.fn().mockResolvedValue();
      Usuario.findByPk.mockResolvedValue({
        id: 1,
        nombre: 'Antiguo',
        email: 'old@mail.com',
        save: mockSave
      });

      const res = await request(app).put('/api/usuario/perfil/actualizar').send({
        nombre: 'NuevoNombre',
        email: 'nuevo@mail.com'
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Perfil actualizado correctamente');
      expect(res.body.usuario.nombre).toBe('NuevoNombre');
    });

    test('devuelve 404 si no encuentra al usuario', async () => {
      Usuario.findByPk.mockResolvedValue(null);

      const res = await request(app).put('/api/usuario/perfil/actualizar').send({
        nombre: 'Otro'
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Usuario no encontrado');
    });
  });
});
test('devuelve 400 si el nombre es inválido', async () => {
  const res = await request(app).post('/api/usuario/register').send({
    nombre: 'A',
    email: 'test@mail.com',
    password: '123456'
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe('El nombre debe tener al menos 2 caracteres');
});
test('devuelve 400 si el email es inválido', async () => {
  const res = await request(app).post('/api/usuario/register').send({
    nombre: 'Usuario',
    email: 'correo-malo',
    password: '123456'
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe('El email no es válido');
});
test('devuelve 400 si la contraseña es demasiado corta', async () => {
  const res = await request(app).post('/api/usuario/register').send({
    nombre: 'Usuario',
    email: 'test@mail.com',
    password: '123'
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe('La contraseña debe tener al menos 6 caracteres');
});
test('devuelve 500 si hay un error interno en login', async () => {
  Usuario.findOne.mockImplementation(() => {
    throw new Error('fallo interno');
  });

  const res = await request(app).post('/api/usuario/login').send({
    email: 'fallo@mail.com',
    password: '123456'
  });

  expect(res.statusCode).toBe(500);
  expect(res.body.message).toBe('Error en el servidor');
});
test('devuelve 500 si hay un error en obtener perfil', async () => {
  Usuario.findByPk.mockImplementation(() => {
    throw new Error('Error de BD');
  });

  const res = await request(app).get('/api/usuario/perfil');

  expect(res.statusCode).toBe(500);
  expect(res.body.message).toBe('Error en el servidor');
});
test('devuelve 500 si hay un error al actualizar perfil', async () => {
  Usuario.findByPk.mockImplementation(() => {
    throw new Error('fallo actualización');
  });

  const res = await request(app).put('/api/usuario/perfil/actualizar').send({
    nombre: 'Fallido'
  });

  expect(res.statusCode).toBe(500);
  expect(res.body.message).toBe('Error en el servidor');
});
test('devuelve 401 si no se proporciona token', async () => {
  const res = await request(app)
    .get('/api/usuario/verificar-token') // agrega la ruta en tu router si no está
    .set('Authorization', '');

  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe('Token no proporcionado');
});
test('devuelve 401 si el token es inválido', async () => {
  jwt.verify.mockImplementation(() => {
    throw new Error('token inválido');
  });

  const res = await request(app)
    .get('/api/usuario/verificar-token')
    .set('Authorization', 'Bearer token-falso');

  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe('Token inválido');
});

test('devuelve 401 si el usuario del token no existe', async () => {
  jwt.verify.mockReturnValue({ id: 999 });
  Usuario.findByPk.mockResolvedValue(null);

  const res = await request(app)
    .get('/api/usuario/verificar-token')
    .set('Authorization', 'Bearer token-valido');

  expect(res.statusCode).toBe(401);
  expect(res.body.message).toBe('Usuario no válido');
});

const express = require('express');
const router = express.Router();
const { guardarClimaDiario, getClimaActual } = require('../controllers/WeatherController');
const authMiddleware = require("../middleware/authMiddleware");

router.get('/daily',authMiddleware, guardarClimaDiario);
router.get('/current-live',authMiddleware, getClimaActual); // <--- NUEVA RUTA

module.exports = router; 
const express = require('express');
const router = express.Router();
const { guardarClimaDiario, getClimaActual,getSolInfo,generarAlertasClima } = require('../controllers/WeatherController');
const authMiddleware = require("../middleware/authMiddleware");
const { obtenerAlertasClimaticas } = require("../controllers/AlertaController");


router.get('/daily',authMiddleware, guardarClimaDiario);
router.get('/current-live',authMiddleware, getClimaActual); 
router.get('/sol-info/:idProvincia',authMiddleware, getSolInfo);
router.get("/alertas-clima", authMiddleware, obtenerAlertasClimaticas);



module.exports = router; 
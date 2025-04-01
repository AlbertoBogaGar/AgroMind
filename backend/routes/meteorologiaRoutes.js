const express = require('express');
const router = express.Router();
const MeteorologiaController = require('../controllers/MeteorologiaController');
const {actualizarDatosMeteorologicos, obtenerUltimoRegistroProvincia} = require('../controllers/MeteorologiaController');

router.get('/probar/:id', MeteorologiaController.probarApi);
router.get("/actualizar", actualizarDatosMeteorologicos);
router.get("/meteorologia/:id",obtenerUltimoRegistroProvincia );

module.exports = router;

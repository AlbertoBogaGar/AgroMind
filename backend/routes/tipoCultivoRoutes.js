const express = require('express');
const router = express.Router();
const obtenerTipoCultivo = require('../controllers/TipoCultivoController');

router.get('/', obtenerTipoCultivo);
module.exports = router;
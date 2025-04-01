const express = require('express');
const router = express.Router();
const { crearCultivo, obtenerCultivos } = require('../controllers/CultivoController');
const authMiddleware  = require('../middleware/authMiddleware');

router.post('/', authMiddleware, crearCultivo);
router.get('/',authMiddleware,obtenerCultivos);

module.exports = router;
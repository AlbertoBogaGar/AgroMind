const express = require('express');
const router = express.Router();
const { crearCultivo, obtenerCultivos,obtenerCultivoPorId } = require('../controllers/CultivoController');
const authMiddleware  = require('../middleware/authMiddleware');

router.post('/', authMiddleware, crearCultivo);
router.get('/',authMiddleware,obtenerCultivos);
router.get('/:id', authMiddleware, obtenerCultivoPorId);


module.exports = router;
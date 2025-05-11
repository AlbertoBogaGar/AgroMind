const express = require('express');
const router = express.Router();
const { crearCultivo, obtenerCultivos,obtenerCultivoPorId,cosecharCultivo,eliminar } = require('../controllers/CultivoController');
const authMiddleware  = require('../middleware/authMiddleware');

router.post('/', authMiddleware, crearCultivo);
router.get('/',authMiddleware,obtenerCultivos);
router.get('/:id', authMiddleware, obtenerCultivoPorId);
router.put("/:id/cosechar", authMiddleware, cosecharCultivo);
router.delete("/eliminar/:id", authMiddleware,eliminar)


module.exports = router;
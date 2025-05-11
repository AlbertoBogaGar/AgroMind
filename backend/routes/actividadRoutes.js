const express = require("express");
const router = express.Router();
const {
  obtenerActividadesPorCultivo,
  completarActividad,
  crearActividad,
  obtenerTodasActividades,
  eliminar,
} = require("../controllers/ActividadController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/crear", authMiddleware, crearActividad);
router.get("/cultivo/:idCultivo", authMiddleware, obtenerActividadesPorCultivo);
router.put("/:idActividad/completar", authMiddleware, completarActividad);
router.get("/", obtenerTodasActividades);
router.delete("/:idActividad", eliminar);

module.exports = router;

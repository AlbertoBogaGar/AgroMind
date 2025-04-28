// routes/actividadRoutes.js

const express = require("express");
const router = express.Router();
const {
  generarActividades,
  obtenerActividadesPorCultivo,
  completarActividad,
  crearActividad
} = require("../controllers/ActividadController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/crear", authMiddleware, crearActividad);
router.get("/cultivo/:idCultivo", authMiddleware, obtenerActividadesPorCultivo);
router.put("/:idActividad/completar", authMiddleware, completarActividad);

module.exports = router;

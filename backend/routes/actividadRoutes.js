const express = require("express");
const router = express.Router();
const {
  obtenerActividadesPorCultivo,
  completarActividad,
  crearActividad,
  obtenerTodasActividades
} = require("../controllers/ActividadController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/crear", authMiddleware, crearActividad);
router.get("/cultivo/:idCultivo", authMiddleware, obtenerActividadesPorCultivo);
router.put("/:idActividad/completar", authMiddleware, completarActividad);
router.get('/',obtenerTodasActividades);

module.exports = router;

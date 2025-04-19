const express = require("express");
const router = express.Router();
const { obtenerRecomendaciones, obtenerRecomendacionesPorCultivo } = require("../controllers/RecomendacionIAController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, obtenerRecomendaciones);
router.get("/cultivo/:idCultivo", authMiddleware, obtenerRecomendacionesPorCultivo);

module.exports = router;

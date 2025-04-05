const express = require("express");
const router = express.Router();
const { obtenerRecomendaciones } = require("../controllers/RecomendacionIAController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, obtenerRecomendaciones);

module.exports = router;

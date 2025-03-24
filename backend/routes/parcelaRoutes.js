const express = require("express");
const router = express.Router();
const { obtenerParcela, registrarParcela } = require("../controllers/ParcelaController");
const { obtenerProvincias} = require("../controllers/ProvinciaController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware,obtenerParcela);

router.post("/",authMiddleware, registrarParcela);

router.get("/provincias", obtenerProvincias);




module.exports = router;

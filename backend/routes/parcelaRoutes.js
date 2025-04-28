const express = require("express");
const router = express.Router();
const { obtenerParcela, registrarParcela,actualizarUbicacionParcela } = require("../controllers/ParcelaController");
const { obtenerProvincias} = require("../controllers/ProvinciaController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware,obtenerParcela);

router.post("/",authMiddleware, registrarParcela);

router.get("/provincias", obtenerProvincias);


router.put("/ubicacion", authMiddleware, actualizarUbicacionParcela); 




module.exports = router;

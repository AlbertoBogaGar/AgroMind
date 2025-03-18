const express = require("express");
const router = express.Router();
const { obtenerParcela, registrarParcela } = require("../controllers/ParcelaController");

router.get("/", obtenerParcela);


router.post("/", registrarParcela);




module.exports = router;

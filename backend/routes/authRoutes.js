const express = require("express");
const router = express.Router();
const { register, login, actualizarPerfil, obtenerPerfil} = require("../controllers/UsuarioController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/register", register);
router.post("/login", login);
router.put("/perfil/actualizar",authMiddleware,actualizarPerfil);
router.get("/perfil",authMiddleware, obtenerPerfil);

module.exports = router;

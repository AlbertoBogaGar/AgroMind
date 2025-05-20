const express = require("express");
const router = express.Router();
const { register, login, actualizarPerfil, obtenerPerfil,verificarToken} = require("../controllers/UsuarioController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/register", register);
router.post("/login", login);
router.put("/perfil/actualizar",authMiddleware,actualizarPerfil);
router.get("/perfil",authMiddleware, obtenerPerfil);
router.get("/verificar-token", verificarToken);

module.exports = router;

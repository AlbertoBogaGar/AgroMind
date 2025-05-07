const express = require("express");
const router = express.Router();
const { preguntarIA } = require("../controllers/AsistenteController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/preguntar", authMiddleware, preguntarIA);

module.exports = router;

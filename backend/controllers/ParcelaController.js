const  Parcela  = require("../models/Parcela");
const jwt = require("jsonwebtoken");


const obtenerParcela = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No autorizado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const parcela = await Parcela.findOne({ where: { idUsuario: decoded.id } });

    res.json({ parcela });
  } catch (error) {
    console.error("Error al obtener parcela:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


const registrarParcela = async (req, res) => {
  try {
    console.log("Se recibió una petición para registrar una parcela.");
    console.log("Datos recibidos:", req.body);

    const { tamaño, latitud, longitud } = req.body;

    const idUsuario = 2; 
    const idProvincia = 1; 

    const nuevaParcela = await Parcela.create({
      idUsuario,
      idProvincia,
      latitud,
      longitud,
      tamaño,
    });

    console.log("Parcela registrada en la base de datos:", nuevaParcela);
    res.status(201).json({ message: "Parcela registrada correctamente", parcela: nuevaParcela });
  } catch (error) {
    console.error("Error al registrar parcela:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = { obtenerParcela, registrarParcela };

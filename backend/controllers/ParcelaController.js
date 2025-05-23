const  Parcela  = require("../models/Parcela");
const Provincia = require("../models/Provincia");
const jwt = require("jsonwebtoken");


const obtenerParcela = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const idUsuario = req.usuario.id;

    if (!token) {
      return res.status(401).json({ message: "No autorizado." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const parcela = await Parcela.findOne({ where: { idUsuario: decoded.id },include:[{model:Provincia,attributes:["nombre"]}] });

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

    const {idProvincia, tamaño, latitud, longitud } = req.body;
    const idUsuario = req.usuario.id;

    if (!tamaño || !latitud || !longitud || !idProvincia) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }



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

const actualizarUbicacionParcela = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { latitud, longitud } = req.body;

    if (!latitud || !longitud) {
      return res.status(400).json({ message: "Latitud y longitud son requeridas." });
    }

    const parcela = await Parcela.findOne({ where: { idUsuario } });
    if (!parcela) {
      return res.status(404).json({ message: "Parcela no encontrada para este usuario." });
    }

    parcela.latitud = latitud;
    parcela.longitud = longitud;
    await parcela.save();

    res.json({ message: "Ubicación de la parcela actualizada correctamente.", parcela });
  } catch (error) {
    console.error("Error al actualizar ubicación de parcela:", error.message);
    res.status(500).json({ message: "Error al actualizar ubicación." });
  }
};

module.exports = { obtenerParcela, registrarParcela,actualizarUbicacionParcela };

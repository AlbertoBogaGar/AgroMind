const TipoCultivo = require("../models/TipoCultivo");

const obtenerTipoCultivo = async (req, res) => {
  try {
    const tipoCultivo = await TipoCultivo.findAll();
    res.json({ tipoCultivo });
  } catch (error) {
    console.error("Error al obtener tipos de cultivo:", error.message);
    res.status(500).json({ error: "Error al obtener tipos de cultivo" });
  }
};

module.exports = obtenerTipoCultivo;

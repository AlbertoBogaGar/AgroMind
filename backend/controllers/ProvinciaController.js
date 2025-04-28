const Provincia = require("../models/Provincia");


const obtenerProvincias = async (req, res) => {
    try {
      const provincias = await Provincia.findAll({ attributes: ['id', 'nombre'] });
      res.json(provincias);
    } catch (error) {
      console.error("Error al obtener provincias:", error);
      res.status(500).json({ message: "Error en el servidor" });
    }
  };
  
  module.exports = {
    obtenerProvincias
  };
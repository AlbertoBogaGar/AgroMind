const MeteorologiaProvincia = require('../models/MeteorologiaProvincias');
const Provincia = require('../models/Provincia');
const { obtenerDatosMeteorologicosYGuardar } = require("../services/aemetService");

const obtenerUltimoRegistroProvincia = async (req, res) => {
  const idProvincia = req.params.id;

  try {
    const registro = await MeteorologiaProvincia.findOne({
      where: { idProvincia },
      order: [['fecha', 'DESC']],
      include: [{ model: Provincia, as: 'provincia' }]
    });

    if (!registro) {
      return res.status(404).json({ message: 'No se encontraron datos meteorológicos' });
    }

    res.json(registro);
  } catch (error) {
    console.error("Error al obtener meteorología:", error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// controllers/MeteorologiaController.js
const { obtenerDatosProvincia } = require("../services/aemetService");

const probarApi = async (req, res) => {
  try {
    const idProvincia = req.params.id; // por ejemplo, "05" para Ávila
    const datos = await obtenerDatosProvincia(idProvincia);
    res.json(datos);
  } catch (error) {
    res.status(500).json({ message: "Error al conectar con AEMET" });
  }
};


const actualizarDatosMeteorologicos = async (req, res) => {
    try {
      await obtenerDatosMeteorologicosYGuardar();
      res.status(200).json({ message: "Datos meteorológicos actualizados correctamente" });
    } catch (error) {
      console.error("❌ Error al actualizar meteorología manualmente:", error.message);
      res.status(500).json({ message: "Error al actualizar los datos meteorológicos" });
    }
  };

  module.exports = {obtenerUltimoRegistroProvincia,probarApi,actualizarDatosMeteorologicos};

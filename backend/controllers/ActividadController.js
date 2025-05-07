const Actividad = require("../models/Actividad");

const obtenerActividadesPorCultivo = async (req, res) => {
  try {
    const { idCultivo } = req.params;

    const actividades = await Actividad.findAll({
      where: { idCultivo },
      where:{estado:'pendiente'},
      order: [['fechaSugerida', 'ASC']]
    });

    res.json(actividades);
  } catch (error) {
    console.error("Error al obtener actividades:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const crearActividad = async (req, res) => {
  try {
    const { idCultivo, titulo, descripcion, fechaSugerida } = req.body;

    if (!idCultivo || !titulo || !descripcion || !fechaSugerida) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const nuevaActividad = await Actividad.create({
      idCultivo,
      titulo,
      descripcion,
      fechaSugerida,
      estado: "pendiente" 
    });

    res.status(201).json({ message: "Actividad creada", actividad: nuevaActividad });

  } catch (error) {
    console.error("Error al crear actividad:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


const completarActividad = async (req, res) => {
  try {
    const { idActividad } = req.params;

    const actividad = await Actividad.findByPk(idActividad);
    if (!actividad) {
      return res.status(404).json({ message: "Actividad no encontrada." });
    }

    actividad.estado = "completada";
    await actividad.save();

    res.json({ message: "Actividad completada", actividad });
  } catch (error) {
    console.error("❌ Error al completar actividad:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
const obtenerTodasActividades = async (req, res) => {
  try {
    const actividades = await Actividad.findAll({
      where:{estado:'pendiente'},
      order: [['fechaSugerida', 'ASC']]
    });

    res.json(actividades);
  } catch (error) {
    console.error("❌ Error al obtener todas las actividades:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  obtenerActividadesPorCultivo,
  crearActividad,
  completarActividad,
  obtenerTodasActividades
};

const Actividad = require("../models/Actividad");
const jwt = require("jsonwebtoken");
const  Parcela  = require("../models/Parcela");
const Cultivo = require("../models/Cultivo");

const obtenerActividadesPorCultivo = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idUsuario = decoded.id;
    const { idCultivo } = req.params;
    

    const parcela = await Parcela.findOne({ where: { idUsuario } });
    if (!parcela)
      return res.status(404).json({ error: "Parcela no encontrada" });

    const cultivos = await Cultivo.findAll({
      where: { idParcela: parcela.id },
    });
    const idsCultivosUsuario = cultivos.map((c) => c.id);

    const actividades = await Actividad.findAll({
      where: { idCultivo: idCultivo, estado: "pendiente" },
      order: [["fechaSugerida", "ASC"]],
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
      estado: "pendiente",
    });

    res
      .status(201)
      .json({ message: "Actividad creada", actividad: nuevaActividad });
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
    console.error("Error al completar actividad:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
const obtenerTodasActividades = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idUsuario = decoded.id;

    const parcela = await Parcela.findOne({ where: { idUsuario } });
    if (!parcela)
      return res.status(404).json({ error: "Parcela no encontrada" });
    const cultivos = await Cultivo.findAll({ where: { idParcela: parcela.id } });
    const idsCultivosUsuario = cultivos.map((c) => c.id);
    const actividades = await Actividad.findAll({
      where: {
        idCultivo: idsCultivosUsuario,
        estado: "pendiente",
      },
      order: [["fechaSugerida", "ASC"]],
    });

    res.json(actividades);
  } catch (error) {
    console.error("Error al obtener todas las actividades:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
const eliminar = async (req, res) => {
  try {
    const { idActividad } = req.params;
    const eliminada = await Actividad.destroy({ where: { id: idActividad } });

    if (!eliminada) {
      return res.status(404).json({ message: "Actividad no encontrada." });
    }

    res.json({ message: "Actividad eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar actividad:", error.message);
    res.status(500).json({ message: "Error al eliminar actividad." });
  }
};

module.exports = {
  obtenerActividadesPorCultivo,
  crearActividad,
  completarActividad,
  obtenerTodasActividades,
  eliminar
};

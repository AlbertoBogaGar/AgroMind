const Cultivo = require("../models/Cultivo");
const Parcela = require("../models/Parcela");
const TipoCultivo = require("../models/TipoCultivo");
const Recomendacion = require("../models/Recomendaciones")
const Actividad = require("../models/Actividad")
const { getRandomImageByQuery } = require("../services/unsplashServices");

const formatTime = (timeStr) => {
  if (!timeStr) return null;
  
  if (timeStr.includes('T')) {
    return timeStr.split('T')[1].substring(0, 8);
  }
  
  return timeStr;
};

const crearCultivo = async (req, res) => {
  try {
    const { idTipoCultivo, fechaSiembra, fechaRecoleccion, estado } = req.body;
    const idUsuario = req.usuario.id;

    const parcela = await Parcela.findOne({ where: { idUsuario } });
    if (!parcela) {
      return res.status(404).json({ message: "No se encontró una parcela para este usuario" });
    }

    const nuevoCultivo = await Cultivo.create({
      idTipoCultivo,
      idParcela: parcela.id,
      fechaSiembra: formatTime(fechaSiembra),
      fechaRecoleccion: formatTime(fechaRecoleccion),
      estado: estado
    });

    res.status(201).json(nuevoCultivo);
  } catch (error) {
    console.error("Error al crear cultivo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const obtenerCultivos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const parcela = await Parcela.findOne({ where: { idUsuario: usuarioId } });
    if (!parcela) {
      return res.status(404).json({ message: "No se encontró la parcela para este usuario." });
    }

    const cultivos = await Cultivo.findAll({
      where: { idParcela: parcela.id },
      include: [
        {
          model: TipoCultivo,
          as: "tipoCultivo",
          attributes: ["nombre", "cicloVida"]
        }
      ]
    });

    const cultivosConImagen = await Promise.all(cultivos.map(async (cultivo) => {
      const nombreCultivo = cultivo.tipoCultivo?.nombre;
      const imagen = await getRandomImageByQuery(nombreCultivo);
      return {
        ...cultivo.toJSON(),
        fechaSiembra: formatTime(cultivo.fechaSiembra),
        fechaRecoleccion: formatTime(cultivo.fechaRecoleccion),
        imagen
      };
    }));

    res.json(cultivosConImagen);
  } catch (error) {
    console.error("Error al obtener cultivos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

const obtenerCultivoPorId = async (req, res) => {
  try {
    const cultivo = await Cultivo.findByPk(req.params.id, {
      include: [
        { model: TipoCultivo, as: 'tipoCultivo' },
        { model: Parcela }
      ]
    });

    if (!cultivo) return res.status(404).json({ error: "Cultivo no encontrado" });
    res.json(cultivo);
  } catch (error) {
    console.error("Error al obtener cultivo:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const cosecharCultivo = async (req, res) => {
  try {
    const { id } = req.params;

    const cultivo = await Cultivo.findByPk(id);
    if (!cultivo) {
      return res.status(404).json({ message: "Cultivo no encontrado" });
    }

    cultivo.estado = "cosechado";
    cultivo.fechaRecoleccion = formatTime(new Date().toISOString());

    await cultivo.save();

    res.json({ message: "Cultivo cosechado correctamente", cultivo });
  } catch (error) {
    console.error("Error al cosechar cultivo:", error);
    res.status(500).json({ message: "Error al cosechar cultivo" });
  }
};
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    await Actividad.destroy({ where: { idCultivo: id } });

    await Recomendacion.destroy({ where: { idCultivo: id } });


    const eliminado = await Cultivo.destroy({ where: { id } });

    if (!eliminado) {
      return res.status(404).json({ message: "Cultivo no encontrado." });
    }

    res.json({ message: "Cultivo eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar cultivo:", error.message);
    res.status(500).json({ message: "Error al eliminar cultivo." });
  }
};

module.exports = {
  obtenerCultivos,
  crearCultivo,
  obtenerCultivoPorId,
  cosecharCultivo,
  eliminar
};

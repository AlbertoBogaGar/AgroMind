
const Cultivo = require("../models/Cultivo");
const Parcela = require("../models/Parcela");
const TipoCultivo = require("../models/TipoCultivo");
const { getRandomImageByQuery } = require("../services/unsplashServices");

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
      fechaSiembra,
      fechaRecoleccion,
      estado,
    });

    res.status(201).json({ message: "Cultivo registrado", cultivo: nuevoCultivo });
  } catch (error) {
    console.error("Error al crear cultivo:", error);
    res.status(500).json({ message: "Error en el servidor" });
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
    cultivo.fechaRecoleccion = new Date(); 

    await cultivo.save();

    res.json({ message: "Cultivo cosechado correctamente", cultivo });
  } catch (error) {
    console.error("Error al cosechar cultivo:", error);
    res.status(500).json({ message: "Error al cosechar cultivo" });
  }
};

module.exports = {
  obtenerCultivos,
  crearCultivo,
  obtenerCultivoPorId,
  cosecharCultivo
};

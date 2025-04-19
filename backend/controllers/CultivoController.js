const Cultivo = require("../models/Cultivo");
const  Parcela  = require("../models/Parcela");
const TipoCultivo = require("../models/TipoCultivo")

const jwt = require("jsonwebtoken");
const crearCultivo = async (req, res) => {
  try {
    const { idTipoCultivo, fechaSiembra, fechaRecoleccion, estado } = req.body;
    const idUsuario = req.usuario.id;

    // Buscar la parcela del usuario
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
          as: 'tipoCultivo',
          attributes: ["nombre", "cicloVida"]
        }
      ]
    });

    res.json(cultivos);
  } catch (error) {
    console.error("Error al obtener cultivos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
const obtenerCultivoPorId = async (req, res) => {
  try {
    const cultivo = await Cultivo.findByPk(req.params.id, {
      include: [
        { model: TipoCultivo, as: 'tipoCultivo' }, // 👈 esto es clave
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



module.exports = {obtenerCultivos,crearCultivo,obtenerCultivoPorId}

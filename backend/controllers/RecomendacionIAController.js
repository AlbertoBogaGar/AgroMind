const jwt = require("jsonwebtoken");
const Cultivo = require("../models/Cultivo");
const TipoCultivo = require("../models/TipoCultivo");
const Parcela = require("../models/Parcela");
const Meteorologia = require("../models/MeteorologiaProvincias");
const Recomendaciones = require("../models/Recomendaciones");
const { generarRecomendacionesCultivo } = require("../services/geminiServices");

const obtenerRecomendaciones = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idUsuario = decoded.id;

    // Obtener parcela del usuario
    const parcela = await Parcela.findOne({ where: { idUsuario } });
    if (!parcela) return res.status(404).json({ error: "Parcela no encontrada" });

    // Obtener cultivos asociados a esa parcela
    const cultivos = await Cultivo.findAll({
      where: { idParcela: parcela.id },
      include: { model: TipoCultivo, as: "tipoCultivo" }
    });

    if (cultivos.length === 0) return res.status(404).json({ error: "No hay cultivos" });

    // Obtener clima del día según la provincia de la parcela
    const hoy = new Date().toISOString().split("T")[0];
    const existentes = await Recomendaciones.findAll({
      where: { fechaGeneracion: hoy },
      include: {
        model: Cultivo,
        include: {
          model: Parcela,
          as: "parcela",
          where: { idUsuario }
        }
      }
    });
    if (existentes.length > 0) {
      return res.json({ recomendaciones: existentes });
    }
    const clima = await Meteorologia.findOne({
      where: { idProvincia: parcela.idProvincia, fecha: hoy }
    });

    if (!clima) return res.status(404).json({ error: "No hay datos del clima" });

    // Preparar datos para Gemini
    const recomendaciones = await generarRecomendacionesCultivo(cultivos, clima);

    // Guardar y devolver
    const registros = await Promise.all(
      recomendaciones.map(r =>
        Recomendaciones.create({
          idCultivo: r.idCultivo,
          fechaGeneracion: hoy,
          tipo: r.tipo,
          titulo: r.titulo,
          descripcion: r.descripcion
        })
      )
    );

    res.json(registros);
  } catch (error) {
    console.error("❌ Error al generar recomendaciones IA:", error.message);
    res.status(500).json({ error: "Error al generar recomendaciones IA" });
  }
};

module.exports = { obtenerRecomendaciones };

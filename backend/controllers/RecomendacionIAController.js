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

 
    const parcela = await Parcela.findOne({ where: { idUsuario } });
    if (!parcela) return res.status(404).json({ error: "Parcela no encontrada" });

   
    const cultivos = await Cultivo.findAll({
      where: { idParcela: parcela.id },
      include: { model: TipoCultivo, as: "tipoCultivo" }
    });

    if (cultivos.length === 0) return res.status(404).json({ error: "No hay cultivos" });


    const hoy = new Date().toISOString().split("T")[0];
    const existentes = await Recomendaciones.findAll({
      where: {
        fechaGeneracion: hoy,
        idUsuario: idUsuario 
      },
      include: {
        model: Cultivo,
        include: {
          model: TipoCultivo,
          as: "tipoCultivo"
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

   
    const recomendaciones = await generarRecomendacionesCultivo(cultivos, clima);

  
    const registros = await Promise.all(
      recomendaciones.map(r =>
        Recomendaciones.create({
          idCultivo: r.idCultivo,
          idUsuario: idUsuario,
          fechaGeneracion: hoy,
          tipo: r.tipo,
          titulo: r.titulo,
          descripcion: r.descripcion
        })
      )
    );
    

    res.json({ recomendaciones: registros });
  } catch (error) {
    console.error("Error al generar recomendaciones IA:", error.message);
    res.status(500).json({ error: "Error al generar recomendaciones IA" });
  }
};
const obtenerRecomendacionesPorCultivo = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idUsuario = decoded.id;

    const { idCultivo } = req.params;
    const hoy = new Date().toISOString().split("T")[0];

    const recomendaciones = await Recomendaciones.findAll({
      where: {
        idUsuario,
        idCultivo,
        fechaGeneracion: hoy
      }
    });

    res.json({ recomendaciones });
  } catch (error) {
    console.error("Error al obtener recomendaciones del cultivo:", error.message);
    res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
};

module.exports = { obtenerRecomendaciones,obtenerRecomendacionesPorCultivo };

const jwt = require("jsonwebtoken");
const axios = require("axios");
const Parcela = require("../models/Parcela");
const Alerta = require("../models/Alerta");
const { generarAlertasClima } = require("../services/geminiServices");

const obtenerAlertasClimaticas = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const idUsuario = decoded.id;

    
    const parcela = await Parcela.findOne({ where: { idUsuario } });
    if (!parcela) return res.status(404).json({ error: "Parcela no encontrada" });

    const hoy = new Date().toISOString().split("T")[0];


    const alertasExistentes = await Alerta.findAll({
      where: {
        idParcela: parcela.id,
        fecha: hoy
      }
    });

    if (alertasExistentes.length > 0) {
      return res.json({ alertas: alertasExistentes });
    }

    
    const { latitud, longitud } = parcela;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&daily=weather_code,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration,precipitation_hours,rain_sum,showers_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,relative_humidity_2m_mean&forecast_days=3&timezone=auto`;

    const response = await axios.get(url);
    const forecastData = response.data.daily;


    const alertasGeneradas = await generarAlertasClima(forecastData);


    const registros = await Promise.all(
      alertasGeneradas.map(a =>
        Alerta.create({
          idParcela: parcela.id,
          tipo: a.tipo,
          titulo: a.titulo,
          mensaje: a.mensaje,
          fecha_inicio: a.fechaInicio,
          fecha_fin: a.fechaFin,
          fecha: hoy
        })
      )
    );
    console.log("Alertas generadas:", registros);


    res.json({ alertas: registros });

  } catch (error) {
    console.error("Error al generar o guardar alertas climáticas:", error.message);
    res.status(500).json({ error: "Error al generar alertas climáticas" });
  }
};

module.exports = { obtenerAlertasClimaticas };

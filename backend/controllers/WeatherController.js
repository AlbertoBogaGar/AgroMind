const axios = require('axios');
const Meteorologia = require('../models/MeteorologiaProvincias');
const Parcela = require('../models/Parcela');
const jwt = require("jsonwebtoken");

const formatTime = (timeStr) => {
  if (!timeStr) return null;
  // If the time is in ISO format (contains T), extract just the time part
  if (timeStr.includes('T')) {
    return timeStr.split('T')[1].substring(0, 8);
  }
  // If it's already in HH:mm:ss format, return as is
  return timeStr;
};

const getClimaActual = async (req, res) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const parcela = await Parcela.findOne({ where: { idUsuario: decoded.id } });
      if (!parcela) return res.status(404).json({ error: 'Parcela no encontrada' });
  
      const { latitud, longitud } = parcela;
  
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,cloud_cover&forecast_days=1`;
      const response = await axios.get(url);
  
      const current = response.data.current;
  
      let estado;
      const nubosidad = current.cloud_cover;
      if (nubosidad <= 25) estado = 'Soleado';
      else if (nubosidad <= 50) estado = 'Parcialmente nublado';
      else if (nubosidad <= 75) estado = 'Nublado';
      else estado = 'Muy nublado';
  
      return res.json({
        temperatura: current.temperature_2m,
        humedad: current.relative_humidity_2m,
        viento: current.wind_speed_10m,
        nubosidad: current.cloud_cover,
        estado
      });
  
    } catch (error) {
      console.error("Error al obtener el clima actual:", error.message);
      return res.status(500).json({ error: "Error al obtener el clima actual" });
    }
  };

const guardarClimaDiario = async (req, res) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const parcela = await Parcela.findOne({ where: { idUsuario: decoded.id } });
  
      if (!parcela) return res.status(404).json({ error: 'Parcela no encontrada' });
  
      const hoy = new Date().toISOString().split('T')[0];
  
      const existe = await Meteorologia.findOne({
        where: {
          idProvincia: parcela.idProvincia,
          fecha: hoy
        }
      });
  
      if (existe) {
        return res.status(200).json({ mensaje: 'Clima diario ya registrado.' });
      }
  
      const { latitud, longitud } = parcela;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,showers_sum,precipitation_hours,wind_speed_10m_max,precipitation_probability_max,relative_humidity_2m_mean&forecast_days=1&timezone=auto`;
  
      const response = await axios.get(url);
      const daily = response.data.daily;
  
      await Meteorologia.create({
        idProvincia: parcela.idProvincia,
        fecha: hoy,
        temperatura_min: daily.temperature_2m_min[0],
        temperatura_max: daily.temperature_2m_max[0],
        humedad: daily.relative_humidity_2m_mean[0],
        lluvia: daily.showers_sum[0],
        horas_precipitacion: daily.precipitation_hours[0],
        viento: daily.wind_speed_10m_max[0],
        prob_precipitacion: daily.precipitation_probability_max[0],
        salida_sol: formatTime(daily.sunrise[0]),
        puesta_sol: formatTime(daily.sunset[0]),
        duracion_luz: daily.daylight_duration[0],
        duracion_sol: daily.sunshine_duration[0]
      });
  
      res.status(201).json({ mensaje: 'Clima diario guardado correctamente.' });
    } catch (error) {
      console.error('Error guardando clima diario:', error.message);
      res.status(500).json({ error: 'Error al guardar clima diario' });
    }
  };

const getSolInfo = async (req, res) => {
    try {
      const idProvincia = req.params.idProvincia;
      const hoy = new Date().toISOString().split('T')[0];
  
      const datos = await Meteorologia.findOne({
        where: {
          idProvincia,
          fecha: hoy
        },
        attributes: ['salida_sol', 'puesta_sol']
      });
  
      if (!datos) {
        return res.status(404).json({ error: 'Datos no encontrados para hoy.' });
      }
  
      res.json({
        salidaSol: formatTime(datos.salida_sol),
        puestaSol: formatTime(datos.puesta_sol)
      });
    } catch (error) {
      console.error("Error al obtener info del sol:", error.message);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

const getClimaHoy = async (req, res) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const parcela = await Parcela.findOne({ where: { idUsuario: decoded.id } });
      if (!parcela) return res.status(404).json({ error: 'Parcela no encontrada' });
  
      const hoy = new Date().toISOString().split('T')[0];
  
      const datos = await Meteorologia.findOne({
        where: {
          idProvincia: parcela.idProvincia,
          fecha: hoy
        }
      });
  
      if (!datos) {
        return res.status(404).json({ error: 'No hay datos meteorológicos para hoy.' });
      }
  
      res.json({
        temperatura_min: datos.temperatura_min,
        temperatura_max: datos.temperatura_max,
        humedad: datos.humedad,
        lluvia: datos.lluvia,
        horas_precipitacion: datos.horas_precipitacion,
        viento: datos.viento,
        prob_precipitacion: datos.prob_precipitacion,
        salida_sol: formatTime(datos.salida_sol),
        puesta_sol: formatTime(datos.puesta_sol),
        duracion_luz: datos.duracion_luz,
        duracion_sol: datos.duracion_sol,
        provincia: parcela.idProvincia
      });
    } catch (error) {
      console.error("Error al obtener clima desde BD:", error.message);
      res.status(500).json({ error: "Error interno al obtener clima desde la base de datos" });
    }
  };

module.exports = {
    guardarClimaDiario,
    getClimaActual,
    getSolInfo,
    getClimaHoy
}; 
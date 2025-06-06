const axios = require('axios');
const Meteorologia = require('../models/MeteorologiaProvincias');
const Parcela = require('../models/Parcela');
const jwt = require("jsonwebtoken");

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
  
      // Interpretar estado del cielo según la nubosidad
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
  
      // ✅ Verificar si ya existen datos para hoy
      const existe = await Meteorologia.findOne({
        where: {
          idProvincia: parcela.idProvincia,
          fecha: hoy
        }
      });
  
      if (existe) {
        return res.status(200).json({ mensaje: '⏩ Clima diario ya registrado.' });
      }
  
      // ⬇️ Si no existe, hacer petición y guardar
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
        salida_sol: daily.sunrise[0],
        puesta_sol: daily.sunset[0],
        duracion_luz: daily.daylight_duration[0],
        duracion_sol: daily.sunshine_duration[0]
      });
  
      res.status(201).json({ mensaje: '✅ Clima diario guardado correctamente.' });
    } catch (error) {
      console.error('❌ Error guardando clima diario:', error.message);
      res.status(500).json({ error: 'Error al guardar clima diario' });
    }
  };
  

module.exports = {
    guardarClimaDiario,getClimaActual
}; 
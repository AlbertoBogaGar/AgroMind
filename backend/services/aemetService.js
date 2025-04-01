const axios = require('axios');
const MeteorologiaProvincia = require('../models/MeteorologiaProvincias');
const Provincia = require('../models/Provincia');
const { limpiarTexto, parseTemperaturas } = require('../utils/aemetUtils');
require("dotenv").config();

const API_KEY = process.env.AEMET_API_KEY;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function obtenerDatosMeteorologicosYGuardar() {
  console.log("🚀 Entrando en obtenerDatosMeteorologicosYGuardar");

  const provincias = await Provincia.findAll();
  console.log(`📌 Provincias obtenidas: ${provincias.length}`);

  for (const provincia of provincias) {
    await delay(5000);

    try {
      const idFormateado = provincia.idAemet.toString().padStart(2, '0');
      console.log(`🌍 Procesando ${provincia.nombre} (ID: ${idFormateado})`);

      const urlInfo = `https://opendata.aemet.es/opendata/api/prediccion/provincia/hoy/${idFormateado}?api_key=${API_KEY}`;
      const infoResponse = await axios.get(urlInfo, { headers: { 'Accept': 'application/json' } });
      const urlDatos = infoResponse.data.datos;

      // ⚠️ Descargar contenido como texto con codificación latin1
      const datosResponse = await axios.get(urlDatos, {
        responseType: 'arraybuffer',
        reponseEncoding: 'binary'
      });
      const texto = Buffer.from(datosResponse.data, 'binary').toString('latin1');

      const textoLimpio = limpiarTexto(texto);
      const temperaturas = parseTemperaturas(textoLimpio);

      console.log(`📝 Contenido bruto de ${provincia.nombre}:\n`, texto);
      console.log(`🌡️ Temperaturas parseadas de ${provincia.nombre}:`, temperaturas);

      if (!temperaturas) {
        console.warn(`⚠️ No se encontraron temperaturas para ${provincia.nombre}`);
        continue;
      }

      const fechaHoy = new Date().toISOString().split("T")[0];
      const temperaturaActual = Math.round((temperaturas.minima + temperaturas.maxima) / 2);

await MeteorologiaProvincia.create({
  idProvincia: provincia.id,
  fecha: fechaHoy,
  temperatura_actual: temperaturaActual,
  temperatura_min: temperaturas.minima,
  temperatura_max: temperaturas.maxima,
  humedad: 0,
  lluvia: 0
});


      console.log(`✅ Guardado: ${provincia.nombre} | Mín: ${temperaturas.minima} | Máx: ${temperaturas.maxima}`);
    } catch (err) {
      console.error(`❌ Error en ${provincia.nombre}:`, err.message);
    }
  }
}

module.exports = { obtenerDatosMeteorologicosYGuardar };

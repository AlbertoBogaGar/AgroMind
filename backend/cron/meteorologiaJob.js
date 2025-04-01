const cron = require("node-cron");
const { obtenerDatosMeteorologicosYGuardar } = require("../services/aemetService");

// Ejecutar todos los días a las 06:00 AM
cron.schedule("0 6 * * *", async () => {
  console.log("⏰ Ejecutando tarea de meteorología diaria...");
  await obtenerDatosMeteorologicosYGuardar();
}, {
  timezone: "Europe/Madrid"
});

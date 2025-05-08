
const { generarRespuestaLibreIA } = require("../services/geminiServices");

const preguntarIA = async (req, res) => {
  try {
    const { pregunta } = req.body;
    if (!pregunta || pregunta.trim() === "") {
      return res.status(400).json({ error: "La pregunta no puede estar vacía." });
    }

    const respuesta = await generarRespuestaLibreIA(pregunta);
    res.json({ respuesta });
  } catch (error) {
    console.error("Error al consultar a Gemini:", error.message);
    res.status(500).json({ error: "Error al generar la respuesta con Gemini." });
  }
};

module.exports = { preguntarIA };
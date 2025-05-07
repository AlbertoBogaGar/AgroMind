const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generarRecomendacionesCultivo = async (cultivos, clima) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-pro",
    });

    const prompt = `
Eres un asistente agrícola experto. Te voy a pasar un JSON con una lista de cultivos y los datos climáticos actuales.

Quiero que analices la situación y generes recomendaciones personalizadas, directas y variadas (máximo 2 por cultivo), con distintos enfoques y sin repetir estructuras. No uses siempre "Se recomienda..." o "Está por debajo de...".

Cada recomendación debe seguir esta estructura:
{
  "idCultivo": (id del cultivo),
  "tipo": "Grave" | "Media" | "Leve",
  "titulo": (breve, directo, sin repetir palabras),
  "descripcion": (máx. 2 frases, lenguaje natural, claro y sin repeticiones)
}

Este es el JSON de entrada:

Cultivos:
${JSON.stringify(cultivos, null, 2)}

Clima:
${JSON.stringify(clima, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    const jsonClean = text.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonClean);
  } catch (error) {
    console.error("Error al generar contenido con Gemini:", error.message);
    throw error;
  }
};
const generarAlertasClima = async (forecastData) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-pro",
    });

    const prompt = `
Eres un meteorólogo experto. A continuación, recibirás un JSON con la predicción climática de los próximos 3 días para una ubicación agrícola.

Tu tarea es generar alertas concisas y útiles para agricultores. Devuelve como máximo 3 alertas, cada una en este formato:

{
  "tipo": "grave" | "media" | "leve",
  "titulo": "breve y directo",
  "mensaje": "máximo 2 frases, lenguaje claro",
  "fechaInicio": "YYYY-MM-DD",
  "fechaFin": "YYYY-MM-DD"
}

Este es el JSON del clima:

${JSON.stringify(forecastData, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    const jsonClean = text.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonClean);
  } catch (error) {
    console.error("Error al generar alertas con Gemini:", error.message);
    return [];
  }
};

const generarRespuestaLibreIA = async (pregunta) => {
  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

    const contexto = `Eres un asistente agrícola experto llamado AgroMind. Ayudas a agricultores a resolver dudas sobre cultivos, clima, técnicas agrícolas, productividad, enfermedades, y todo lo relacionado con el trabajo en el campo. Responde de manera clara, profesional y directa. Si el usuario pregunta algo que no tenga relación con la agricultura, responde amablemente que no puedes ayudar en ese tema.
Responde siempre de forma clara, profesional y directa.`;

    const prompt = `${contexto}\n\nPregunta del usuario: ${pregunta}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(
      "Error al generar respuesta libre con Gemini:",
      error.message
    );
    throw error;
  }
};


module.exports = {
  generarRecomendacionesCultivo,
  generarAlertasClima,
  generarRespuestaLibreIA,
};

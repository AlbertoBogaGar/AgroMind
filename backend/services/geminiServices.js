// services/geminiService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generarRecomendacionesCultivo = async (cultivos, clima) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-pro",
    });

    const prompt = `
Eres un asistente agrícola inteligente. Con base en los siguientes datos de cultivos y clima, devuelve un array en JSON con recomendaciones personalizadas para cada cultivo. Formato: 
[
  {
    "idCultivo": número,
    "tipo": "grave" | "media" | "leve",
    "titulo": "título breve",
    "descripcion": "descripción clara"
  }
]

Cultivos:
${JSON.stringify(cultivos)}

Clima:
${JSON.stringify(clima)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Limpiar respuesta si viene con triple backticks
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]");
    const jsonClean = text.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonClean);
  } catch (error) {
    console.error("❌ Error al generar contenido con Gemini:", error.message);
    throw error;
  }
};

module.exports = { generarRecomendacionesCultivo };

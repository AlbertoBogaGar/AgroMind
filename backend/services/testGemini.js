// testGemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hola, ¿puedes generar una recomendación agrícola?");
    const response = await result.response;
    console.log("✅ Respuesta de Gemini:\n", response.text());
  } catch (error) {
    console.error("❌ Error al llamar a Gemini:", error.message);
    console.error("Detalles:", error);
  }
}

testGemini();

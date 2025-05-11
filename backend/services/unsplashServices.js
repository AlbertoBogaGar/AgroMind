const axios = require("axios");
require("dotenv").config();

const DEFAULT_IMAGE = "https://source.unsplash.com/featured/?plant"; 

const getRandomImageByQuery = async (query) => {
  try {
    const response = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        query: query,
        orientation: "landscape"
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
      }
    });

    return response.data.urls.regular;
  } catch (error) {
    console.warn(`No se encontró imagen para "${query}". Probando con 'plant'...`);
    try {
      const fallbackResponse = await axios.get("https://api.unsplash.com/photos/random", {
        params: {
          query: "plant",
          orientation: "landscape"
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      });

      return fallbackResponse.data.urls.regular;
    } catch (fallbackError) {
      console.error("Error con la búsqueda fallback:", fallbackError.message);
      return DEFAULT_IMAGE;
    }
  }
};

module.exports = { getRandomImageByQuery };

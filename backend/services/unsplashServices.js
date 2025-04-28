const axios = require("axios");
require("dotenv").config();

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
    console.error("Error al obtener imagen de Unsplash:", error.message);
    return null;
  }
};

module.exports = { getRandomImageByQuery };

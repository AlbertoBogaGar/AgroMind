const axios = require('axios');

const getCurrentWeather = async (req, res) => {
    try {
        // Por defecto usaremos las coordenadas de Madrid
        const latitude = req.query.lat || 40.4168;
        const longitude = req.query.lon || -3.7038;

        const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover_total,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto`
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Error al obtener datos del clima' });
    }
};

module.exports = {
    getCurrentWeather
}; 
const express = require('express');
const router = express.Router();
const { getCurrentWeather } = require('../controllers/WeatherController');

router.get('/current', getCurrentWeather);

module.exports = router; 
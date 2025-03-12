const express = require('express');

const router = express.Router();

const InfoControllers = require('../../controllers/info-controller');

const airplaneRoutes = require('./airplane-routes');
const cityRoutes = require('./city-routes');
const airportRoutes = require('./airport-routes');
const flightRoutes = require('./flight-routes')

router.get('/info',InfoControllers.info);

router.use('/airplanes',airplaneRoutes);

router.use('/cities',cityRoutes);

router.use('/airports', airportRoutes);

router.use('/flights', flightRoutes);

module.exports = router;
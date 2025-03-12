const express = require('express');

const router = express.Router();

const {airportControllers} = require('../../controllers');
const {airportMiddlewares} = require('../../middlewares')
router.post('/',airportMiddlewares.validateCreateRequest,airportControllers.createAirport);

router.get('/', airportControllers.getAirports);

router.get('/:id', airportControllers.getAirport);

router.delete('/:id', airportControllers.destroyAirport);

router.patch('/:id', airportControllers.updateAirport);

module.exports = router;

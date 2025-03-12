const express = require('express');

const router = express.Router();

const {flightControllers} = require('../../controllers');
const {flightMiddlewares} = require('../../middlewares')

router.post('/',flightMiddlewares.validateCreateRequest,flightControllers.createFlight);

router.get('/',flightControllers.getAllFlights);

router.get('/:id',flightControllers.getFlightByid);


router.patch('/:id/seats', flightMiddlewares.validateUpdateSeatsRequest, flightControllers.updateSeats);

module.exports = router;

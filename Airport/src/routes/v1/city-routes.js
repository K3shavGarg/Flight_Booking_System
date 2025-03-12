const express = require('express');

const router = express.Router();

const {cityControllers} = require('../../controllers');
const {cityMiddlewares} = require('../../middlewares')

router.post('/',cityMiddlewares.validateCreateRequest,cityControllers.createCity);

router.delete('/:id', cityControllers.destroyCity);

router.patch('/:id', cityControllers.updateCity);

module.exports = router;

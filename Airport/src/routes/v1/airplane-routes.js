const express = require('express');

const router = express.Router();

const {airplaneControllers} = require('../../controllers');
const {airplaneMiddlewares} = require('../../middlewares');

router.post('/',airplaneMiddlewares.validateCreateRequest ,airplaneControllers.createAirplane);

router.get('/', airplaneControllers.getAirplanes);

router.get('/:id', airplaneControllers.getAirplane);

// api/v1/airplane/2  here id = 2
router.delete('/:id', airplaneControllers.destroyAirplane);

router.patch('/:id', airplaneControllers.updateAirplane);
module.exports = router;
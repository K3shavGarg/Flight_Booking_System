const express = require('express');

const router = express.Router();

const {emailController} = require('../../controllers');

router.post('/tickets',emailController.createTicket);

module.exports = router;
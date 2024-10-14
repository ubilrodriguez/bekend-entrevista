const express = require('express');
const rabbitmqController = require('../controllers/rabbitmqController');

const router = express.Router();

router.post('/send', rabbitmqController.sendMessage);
router.get('/receive', rabbitmqController.receiveMessages);

module.exports = router;

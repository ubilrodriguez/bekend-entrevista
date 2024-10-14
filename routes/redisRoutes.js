const express = require('express');
const redisController = require('../controllers/redisController');

const router = express.Router();

router.get('/register-params', redisController.registerParams);
router.get('/params', redisController.getParams);

module.exports = router;

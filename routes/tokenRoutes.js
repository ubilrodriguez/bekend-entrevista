const express = require('express');
const tokenController = require('../controllers/tokenController');

const router = express.Router();

router.post('/token', tokenController.generateToken);
router.post('/token/validate', tokenController.validateToken);
router.get('/tokens', tokenController.getAllTokens);

module.exports = router;
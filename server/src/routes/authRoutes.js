const express = require('express');
const { register, activate } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.get('/activate/:token', activate);

module.exports = router;

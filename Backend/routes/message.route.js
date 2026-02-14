const express = require('express');
const router = express.Router();
const { getMessage } = require('../controllers/message.controller');

router.get('/message', getMessage);

module.exports = router;

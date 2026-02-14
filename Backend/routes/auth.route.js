const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/auth.controller');
const { validateRequest, schemas } = require('../middleware/validation.middleware');

router.post('/signup', validateRequest(schemas.signup), signup);
router.post('/login', validateRequest(schemas.login), login);
router.post('/logout', logout);

module.exports = router;

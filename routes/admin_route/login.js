const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const AdminController = require('../../controller/adminController/index');

router.post('/login',[validator.login], AdminController.LogIn.login);

router.post('/token',AdminController.LogIn.token);

module.exports = router;
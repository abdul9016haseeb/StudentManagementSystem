const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const AdminController = require('../../controller/adminController/index');

router.post('/signup',[validator.signup], AdminController.SignUp.signUp);

module.exports = router;
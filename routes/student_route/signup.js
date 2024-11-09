const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const StudentController = require('../../controller/studentController/index');

//student signup
router.post('/signup',[validator.signup], StudentController.SignUp.signUp);

module.exports = router;
const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const TeacherController = require('../../controller/teacherController/index');

//teacher signup
router.post('/signup',[validator.signup], TeacherController.SignUp.signUp);

module.exports = router;
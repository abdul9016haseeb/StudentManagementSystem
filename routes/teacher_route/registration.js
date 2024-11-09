const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const TeacherController = require('../../controller/teacherController/index');
const AuthenticateJWT  = require('../../middleware/jwtMiddleware');

//registration for student
router.post('/register',[validator.teacherRegistration],TeacherController.Registration.teacherRegistration);

//get details for student
router.get('/register',[AuthenticateJWT.authTeacher()],TeacherController.Registration.getRegisteration);

//update details
router.put('/register/update',[validator.teacherRegistration,AuthenticateJWT.authTeacher()],TeacherController.Registration.updateRegisterion)


module.exports = router;
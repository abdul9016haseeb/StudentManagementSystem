const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const StudentController = require('../../controller/studentController/index');
const AuthenticateJWT  = require('../../middleware/jwtMiddleware');



//registration for student
router.post('/register',[validator.studentRegistration],StudentController.Registration.studentRegisteration);

//get details for student
router.get('/register',[AuthenticateJWT.authStudent()],StudentController.Registration.getRegisteration);

//update details
router.put('/register/update',[validator.studentRegistration,AuthenticateJWT.authStudent()],StudentController.Registration.updateRegisteration)


module.exports = router;
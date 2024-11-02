const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const studentController = require('../../controller/student_controller');
const commonController = require('../../controller/commonController');
const { authenticatJWT } = require('../../middleware/jwtMiddleware');

const passport = require('../../middleware/Oauth')

router.use(passport.initialize());

//student signup
router.post('/signup',[validator.signup], studentController.signUp);

//verifying the otp via email
router.post('/verifyOtp',[validator.otp],commonController.verifyOtp);

//registration for student
router.post('/register',[validator.studentRegistration],studentController.register);

//get details for student
router.get('/register',[authenticatJWT],studentController.getRegister);

//update details
router.put('/register/update',[validator.studentRegistration,authenticatJWT],studentController.putRegister)



//via SSO (SINGLE SIGN ON)
router.get('/auth/google/signup',passport.authenticate('google-student-signup',{scope:['profile','email']}));

//callback path
router.get('/signup/callback',passport.authenticate('google-student-signup', { failureRedirect: '/failure' ,session:false}),studentController.callback);



module.exports = router;
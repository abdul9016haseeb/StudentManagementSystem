const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const teacherController = require('../../controller/teacherController');
const commonController = require('../../controller/commonController');
const { authenticatJWT } = require('../../middleware/jwtMiddleware');

const passport = require('../../middleware/Oauth')

router.use(passport.initialize());

//teacher signup
router.post('/signup',[validator.signup], teacherController.signUp);

//verifying the otp via email
router.post('/verifyOtp',[validator.otp],commonController.verifyOtp);

//registration for teacher
router.post('/register',[validator.teacherRegistration],teacherController.register);

//get details for teacher
router.get('/register',[authenticatJWT],teacherController.getRegister);

//update details
router.put('/register/update',[validator.teacherRegistration,authenticatJWT],teacherController.putRegister)



//via SSO (SINGLE SIGN ON)
router.get('/auth/google/signup',passport.authenticate('google-teacher-signup',{scope:['profile','email']}));

//callback path
router.get('/signup/callback',passport.authenticate('google-teacher-signup', { failureRedirect: '/failure' ,session:false}),teacherController.callback);



module.exports = router;
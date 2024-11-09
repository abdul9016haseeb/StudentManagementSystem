const express = require('express');
const router = express.Router();
const StudentController = require('../../controller/studentController/index');
const passport = require('../../middleware/Oauth')
router.use(passport.initialize());

//via SSO (SINGLE SIGN ON)
router.get('/auth/google/signup',passport.authenticate('google-student-signup',{scope:['profile','email']}));

//callback path
router.get('/signup/callback',passport.authenticate('google-student-signup', { failureRedirect: '/failure' ,session:false}),StudentController.SsoSignUp.ssoSignUp);

module.exports = router;
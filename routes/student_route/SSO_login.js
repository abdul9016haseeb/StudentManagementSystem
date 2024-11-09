const express = require('express');
const router = express.Router();
const StudentController = require('../../controller/studentController/index');
const passport = require('../../middleware/Oauth')

router.use(passport.initialize());

router.get('/auth/google/login',passport.authenticate('google-student-login',{scope:['profile','email']}));

router.get('/login/callback',passport.authenticate('google-student-login', { failureRedirect: '/failure' ,session:false}),StudentController.SsoLogIn.ssoLogin);


module.exports = router;
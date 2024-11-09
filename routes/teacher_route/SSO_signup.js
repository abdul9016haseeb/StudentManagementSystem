const express = require('express');
const router = express.Router();
const TeacherController = require('../../controller/teacherController/index');
const passport = require('../../middleware/Oauth')
router.use(passport.initialize());

//via SSO (SINGLE SIGN ON)
router.get('/auth/google/signup',passport.authenticate('google-teacher-signup',{scope:['profile','email']}));

//callback path
router.get('/signup/callback',passport.authenticate('google-teacher-signup', { failureRedirect: '/failure' ,session:false}),TeacherController.SsoSignUp.ssoSignUp);

module.exports = router;
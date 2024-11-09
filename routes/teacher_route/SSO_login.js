const express = require('express');
const router = express.Router();
const TeacherController = require('../../controller/teacherController/index');
const passport = require('../../middleware/Oauth');

router.use(passport.initialize());


router.get('/auth/google/signup',passport.authenticate('google-teacher-login',{scope:['profile','email']}));

//callback path
router.get('/login/callback',passport.authenticate('google-teacher-login', { failureRedirect: '/failure' ,session:false}),TeacherController.SsoLogIn.ssoLogin);

module.exports = router;
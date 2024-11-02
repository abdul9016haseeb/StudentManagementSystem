const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const studentController = require('../../controller/student_controller');
const commonController = require('../../controller/commonController');
const { authenticatJWT } = require('../../middleware/jwtMiddleware');
const passport = require('../../middleware/Oauth')



router.post('/login',validator.login,commonController.login );


router.get('/auth/google/login',passport.authenticate('google-student-login',{scope:['profile','email']}));

router.get('/login/callback',passport.authenticate('google-student-login', { failureRedirect: '/failure' ,session:false}),studentController.loginCallback);


router.post('/token',commonController.token);

router.post('/logout',[authenticatJWT],commonController.logout);



module.exports = router;
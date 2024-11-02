const express= require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const teacherController = require('../../controller/teacherController');
const commonController = require('../../controller/commonController')
const { authenticatJWT } = require('../../middleware/jwtMiddleware');
const passport = require('../../middleware/Oauth')


router.post('/login',validator.login,commonController.login );

router.post('/token',commonController.token);


router.get('/auth/google/login',passport.authenticate('google-teacher-login',{scope:['profile','email']}));

router.get('/login/callback',passport.authenticate('google-teacher-login', { failureRedirect: '/failure' ,session:false}),teacherController.loginCallback);


router.post('/logout',[authenticatJWT],commonController.logout);



module.exports = router;
const express = require('express');
const router = express.Router();
const CommonController = require('../../controller/commonController/index')
const AuthenticateJWT  = require('../../middleware/jwtMiddleware');

router.post('/logout',[AuthenticateJWT.authTeacher()],CommonController.LogOut.logOut);

module.exports = router;
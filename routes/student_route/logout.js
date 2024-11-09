const express = require('express');
const router = express.Router();
const CommonController = require('../../controller/commonController/index');
const AuthenticateJWT  = require('../../middleware/jwtMiddleware');

router.post('/logout',[AuthenticateJWT.authStudent()],CommonController.LogOut.logout);

module.exports = router;
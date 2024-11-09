const express = require('express');
const router = express.Router();
const AdminController = require('../../controller/adminController/index');
const AuthenticateJWT = require('../../middleware/jwtMiddleware');

router.post('/logout',[AuthenticateJWT.authAdmin()],AdminController.LogOut.logOut);

module.exports = router;
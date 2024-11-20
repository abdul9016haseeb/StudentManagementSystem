const express = require('express');
const router = express.Router();
const AuthenticateJWT = require('../../middleware/jwtMiddleware');
const ForgotPassword = require('../../controller/commonController/forgotPassword');
const validator = require('../../utils/userValidation');

router.post('/submitResetEmail',[validator.submitResetEmail], ForgotPassword.submitResetEmail );


module.exports = router;
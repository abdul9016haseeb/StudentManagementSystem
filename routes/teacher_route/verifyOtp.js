const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const CommonController = require('../../controller/commonController/index');


//verifying the otp via email
router.post('/verifyOtp',[validator.otp],CommonController.VerifyOtp.verifyOtp);


module.exports = router;
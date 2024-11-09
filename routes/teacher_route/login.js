const express= require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const CommonController = require('../../controller/commonController/index');


router.post('/login',validator.login,CommonController.LogIn.login);

router.post('/token',CommonController.LogIn.token);


module.exports = router;
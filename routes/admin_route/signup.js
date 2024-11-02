const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const adminController = require('../../controller/adminController');
const { authenticatJWT } = require('../../middleware/jwtMiddleware');


router.post('/signup',[validator.signup], adminController.signUp);


module.exports = router;
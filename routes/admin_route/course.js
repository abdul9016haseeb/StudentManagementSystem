const express =  require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const AdminController = require('../../controller/adminController/index');
const AuthenticateJWT = require('../../middleware/jwtMiddleware');

router.post('/course',[AuthenticateJWT.authAdmin(),validator.course],AdminController.Course.newCourseSyllabus);

module.exports = router;

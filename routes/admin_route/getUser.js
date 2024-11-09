const express = require('express');
const router = express.Router();
const AdminController = require('../../controller/adminController/index');
const AuthenticateJWT = require('../../middleware/jwtMiddleware');

// router.get('/getStudents',adminController.getStudents)
router.get('/getStudents',[AuthenticateJWT.authAdmin()],AdminController.GetUser.getStudents);

router.get('/getTeachers',[AuthenticateJWT.authAdmin()],AdminController.GetUser.getTeachers);

module.exports = router;
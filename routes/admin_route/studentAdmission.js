const express = require('express');
const router = express.Router();
const AdminController = require('../../controller/adminController/index');
const AuthenticateJWT = require('../../middleware/jwtMiddleware');

router.get('/student-admission',[AuthenticateJWT.authAdmin()],AdminController.StudentAddmission.studentAddmission);

router.put('/student-admission',[AuthenticateJWT.authAdmin()],AdminController.StudentAddmission.approveStudent);

module.exports = router;
const express = require('express');
const router = express.Router();
const AdminController = require('../../controller/adminController/index');
const AuthenticateJWT = require('../../middleware/jwtMiddleware');

router.get('/teacher-approvals',[AuthenticateJWT.authAdmin()],AdminController.TeacherApproval.teacherRegistration);

router.put('/teacher-approvals/accept',[AuthenticateJWT.authAdmin()],AdminController.TeacherApproval.approveTeacher);

module.exports = router;
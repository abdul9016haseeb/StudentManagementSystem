const express = require('express');
const router = express.Router();
const admin_router = express.Router({mergeParams:true});
const teacher_router = express.Router({mergeParams:true});
const student_router = express.Router({mergeParams:true});

//admin route
const adminSignup = require('./admin_route/signup');
const adminLogin = require('./admin_route/login');
const adminLogout = require('./admin_route/logout');
const teacherApproval = require('./admin_route/teacherApprovals');
const studentAdmission = require('./admin_route/studentAdmission');
const batch     = require('./admin_route/batch');
const getUser = require('./admin_route/getUser');
const course = require('./admin_route/course');

admin_router.use('/admin',adminSignup);
admin_router.use('/admin',adminLogin);
admin_router.use('/admin',adminLogout);
admin_router.use('/admin',teacherApproval);
admin_router.use('/admin',studentAdmission);
admin_router.use('/admin',batch);
admin_router.use('/admin',getUser);
admin_router.use('/admin',course);

//teacher route
const teacherSignup = require('./teacher_route/signup');
const teacherLogin = require('./teacher_route/login');
const teacherLogout = require('./teacher_route/logout');
const teacherRegistration = require('./teacher_route/registration');
const ssoLoginTeacher = require('./teacher_route/SSO_login');
const ssoSignupTeacher = require('./teacher_route/SSO_signup');
const verifyOtpTeacher = require('./teacher_route/verifyOtp');
const forgotPassword = require('./teacher_route/forgot');

teacher_router.use('/teacher',teacherSignup);
teacher_router.use('/teacher',teacherLogin);
teacher_router.use('/teacher',teacherLogout);
teacher_router.use('/teacher',teacherRegistration);
teacher_router.use('/teacher',ssoLoginTeacher);
teacher_router.use('/teacher',ssoSignupTeacher);
teacher_router.use('/teacher',verifyOtpTeacher);
teacher_router.use('/teacher',forgotPassword);

//student route
const studentSignup = require('./student_route/signup');
const studentLogin = require('./student_route/login');
const studentLogout = require('./student_route/login');
const studentRegistration = require('./student_route/registration');
const ssoLoginStudent = require('./student_route/SSO_login');
const ssoSignupStudent = require('./student_route/SSO_signup');
const verifyOtpStudent = require('./student_route/verifyOtp');
const studentcheck = require('./student_route/check');

student_router.use('/student',studentSignup);
student_router.use('/student',studentLogin);
student_router.use('/student',studentLogout);
student_router.use('/student',studentRegistration);
student_router.use('/student',ssoLoginStudent);
student_router.use('/student',ssoSignupStudent);
student_router.use('/student',verifyOtpStudent);
student_router.use('/student',studentcheck);

//mouting
router.use(admin_router);
router.use(student_router);
router.use(teacher_router);

//from the failure redirect of the SSO login
router.get('/failure',(req,res)=>{
    res.render('failureRedirect.pug');
});

module.exports = router;
const express = require('express');
const router = express.Router();
const admin_router = express.Router({mergeParams:true});
const teacher_router = express.Router({mergeParams:true});
const student_router = express.Router({mergeParams:true});



const adminSignup = require('./admin_route/signup');
const adminLogin = require('./admin_route/login');
const batch     = require('./admin_route/batch');
const getUser = require('./admin_route/getUser');
const course = require('./admin_route/course')


const teacherSignup = require('./teacher_route/signup');
const teacherLogin = require('./teacher_route/login');

const studentSignup = require('./student_route/signup');
const studentLogin = require('./student_route/login');





admin_router.use('/admin',adminSignup);
admin_router.use('/admin',adminLogin);
admin_router.use('/admin',batch);
admin_router.use('/admin',getUser)
admin_router.use('/admin',course)




teacher_router.use('/teacher',teacherSignup);
teacher_router.use('/teacher',teacherLogin);


student_router.use('/student',studentSignup)
student_router.use('/student',studentLogin)



//from the failure redirect of the SSO login
router.get('/failure',(req,res)=>{
    res.render('failureRedirect.pug');
})

module.exports = {
    admin_router,
    teacher_router,
    student_router,
    router
};
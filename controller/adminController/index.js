const Batch = require('./batch');
const Course = require('./course');
const LogIn = require('./login');
const LogOut = require('./logout');
const SignUp = require('./signup');
const StudentAddmission = require('./studentAdmission');
const TeacherApproval = require('./teacherApproval');
const GetUser = require('./getUser');


const AdminController = {
    Batch,
    Course,
    LogIn,
    LogOut,
    SignUp,
    StudentAddmission,
    TeacherApproval,
    GetUser,
};

module.exports = AdminController;

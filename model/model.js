const sequelize = require('../.config/mysql');
const signUpSchema = require('./schema/signUp');
const tokenSchema = require('./schema/token');
const otpSchema = require('./schema/otp');
const adminSchema = require('./schema/admin');
const userSchema = require('./schema/user');
const batchSchema = require('./schema/batch');
const studentSchema = require('./schema/student');
const teacherSchema = require('./schema/teacher');
const courseSchema = require('./schema/course');
const extraInfo = {freezeTableName: true};

const Token = sequelize.define('Token', tokenSchema, extraInfo);

const SignUp = sequelize.define('SignUp', signUpSchema, extraInfo);

const Otp = sequelize.define('Otp', otpSchema, extraInfo);

const Admin = sequelize.define('Admin', adminSchema, extraInfo);

const User = sequelize.define('User', userSchema, extraInfo);

const Batch = sequelize.define('Batch', batchSchema, extraInfo);

const Student = sequelize.define('Student', studentSchema , extraInfo);

const Teacher = sequelize.define('Teacher', teacherSchema , extraInfo);

const Course = sequelize.define('Course', courseSchema , extraInfo);



module.exports = {
    Token,
    SignUp,
    Otp,
    Admin,
    User,
    Batch,
    Student,
    Teacher,
    Course,
    sequelize
};

const Registration = require('./registration');
const SignUp = require('./signup');
const SsoLogIn = require('./SSO_login');
const SsoSignUp = require('./SSO_signup');

const StudentController = {
    Registration,
    SignUp,
    SsoSignUp,
    SsoLogIn,
};

module.exports = StudentController;
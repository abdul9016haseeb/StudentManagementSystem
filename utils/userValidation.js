const { body, validationResult } = require('express-validator');

const signup = [

    body('email')
        .not().isEmpty().withMessage("email must not be empty").bail()
        .isEmail().withMessage("Invalid email format").bail()
        .custom((value) => {
            if (!value.endsWith('@gmail.com')) {
                throw new Error('Email must be a Gmail address');
            }
            return true;
        }),

    body('password', 'The minimum password length is 5 characters and maximum 15 characters').isLength({ min: 5, max: 15 }),

    body('confirmPassword').notEmpty().withMessage('Confirm password is required').bail()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Enter the correct password')
            }
            return true; // Indicates that validation passed
        }),

]

const login = [
    body('email')
        .not().isEmpty().withMessage("email must not be empty").bail()
        .isEmail().withMessage("Invalid email format").bail()
        .custom((value) => {
            if (!value.endsWith('@gmail.com')) {
                throw new Error('Email must be a Gmail address');
            }
            return true;
        }),

    body('password', 'The minimum password length is 5 characters and maximum 15 characters').isLength({ min: 5, max: 15 }),
]

const otp = [
    body('otp')
        .notEmpty().withMessage('OTP should not be empty') // Ensure OTP is not an empty string
        .matches(/^\d{6}$/).withMessage('OTP must be a 6-digit number') // Ensure OTP is exactly 6 digits
]

const teacherRegistration = [
    body("firstName")
        .not().isEmpty().withMessage("First name must not be empty").bail()
        .isString().withMessage('First name must be a string').bail()
        .isLength({ min: 2, max: 50 }).withMessage("First name must be between 2 and 50 characters")
        .custom(value => {
            if (/\d/.test(value)) { // Check if the value contains any digits
                throw new Error('First name must not contain numbers');
            }
            return true;
        }),

    body('lastName')
        .not().isEmpty().withMessage("Last name must not be empty").bail()
        .isString().withMessage("Last name must be a string").bail()
        .isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters")
        .custom(value => {
            if (/\d/.test(value)) { // Check if the value contains any digits
                throw new Error('Last name must not contain numbers');
            }
            return true;
        }),

    body('photo')
        .optional() // Since it's not required, we make it optional
        .isString().withMessage("Photo should be a valid file path"),

    body('gender')
        .not().isEmpty().withMessage("Gender must not be empty").bail()
        .isIn(['Male', 'Female', 'Others']).withMessage("Gender must be Male, Female, or Others"),

    body('age')
        .not().isEmpty().withMessage("Age must not be empty").bail()
        .isInt({ min: 18, max: 100 }).withMessage("Age must be a valid integer between 18 and 100"),

    body("dateOfBirth")
        .not().isEmpty().withMessage("Date of Birth must not be empty").bail()
        .isDate().withMessage("Date of Birth must be a valid date").bail()
        .custom((value) => {
            const birthYear = new Date(value).getFullYear();
            if (birthYear > 2010) {
                throw new Error("Candidate must be born on or before 2010")
            }
            return true;
        }),

    body('email')
        .not().isEmpty().withMessage("Email must not be empty").bail()
        .isEmail().withMessage("Invalid email format").bail()
        .custom((value) => {
            if (!value.endsWith('@gmail.com')) {
                throw new Error('Email must be a Gmail address');
            }
            return true;
        }),
    body('contact')
        .not().isEmpty().withMessage("Contact must not be empty").bail()
        .isString().withMessage("Contact must be a string").bail()
        .isLength({ min: 10 }).withMessage("Contact number must be 10 digit number").bail()
        .isMobilePhone().withMessage("Contact must be a valid phone number"),

    body('addressStreet')
        .not().isEmpty().withMessage("Street address is required").bail()
        .isString().withMessage("Street address must be a string").bail()
        .isLength({ max: 255 }).withMessage("Street address must be less than 255 characters"),

    body('addressCity')
        .not().isEmpty().withMessage("city is required").bail()
        .isString().withMessage("City must be a string").bail()
        .isLength({ max: 100 }).withMessage("City must be less than 100 characters"),

    body('addressState')
        .not().isEmpty().withMessage("Enter the state").bail()
        .isString().withMessage("State must be a string").bail()
        .isLength({ max: 100 }).withMessage("State must be less than 100 characters"),

    body('postalCode')
        .not().isEmpty().withMessage("Enter the postal code").bail()
        .isString().withMessage("Postal code must be a string").bail()
        .isLength({ min: 6, max: 6 }).withMessage("Postal code must be 6 digit number"),

    body('qualification')
        .not().isEmpty().withMessage("Qualification must not be empty").bail()
        .isString().withMessage("Qualification must be a string"),

    body('classesToTeach')
        .optional()
        .isString().withMessage("Classes to teach must be a string"),

    body('subjectsToTeach')
        .not().isEmpty().withMessage("Enter subject that you can teach").bail()
        .isIn(['Angular', 'React', 'Vue js', 'Node js', 'Php']).withMessage('Subjects must include the following').bail()
        .isString().withMessage("Subjects to teach must be a string"),

    body('experience')
        .optional()
        .isString().withMessage("Experience must be a string"),

    body('termsAccepted')
        .not().isEmpty().withMessage("You must accept the terms and conditions").bail()
        .isBoolean().withMessage("Terms accepted must be a boolean value"),

    body('additionalComments')
        .optional()
        .isString().withMessage("Additional comments must be a string")

]

const studentRegistration = [
    body("firstName")
        .not().isEmpty().withMessage("First name must not be empty").bail()
        .isString().withMessage('First name must be a string').bail()
        .isLength({ min: 2, max: 50 }).withMessage("First name must be between 2 and 50 characters")
        .custom(value => {
            if (/\d/.test(value)) { // Check if the value contains any digits
                throw new Error('First name must not contain numbers');
            }
            return true;
        }),

    body('lastName')
        .optional()  // Makes the field optional
        .isString().withMessage("Last name must be a string").bail()
        .isLength({ min: 2, max: 50 }).withMessage("Last name must be between 2 and 50 characters").bail()
        .custom(value => {
            if (/\d/.test(value)) { // Check if the value contains any digits
                throw new Error('Last name must not contain numbers');
            }
            return true;
        }),


    body('photo')
        .optional() // Since it's not required, we make it optional
        .isString().withMessage("Photo should be a valid file path"),

    body('gender')
        .not().isEmpty().withMessage("Gender must not be empty").bail()
        .isIn(['Male', 'Female', 'Others']).withMessage("Gender must be Male, Female, or Others"),

    body('age')
        .not().isEmpty().withMessage("Age must not be empty").bail()
        .isInt({ min: 18, max: 100 }).withMessage("Age must be a valid integer between 18 and 100"),

    body('email')
        .not().isEmpty().withMessage("Email must not be empty").bail()
        .isEmail().withMessage("Invalid email format").bail()
        .custom((value) => {
            if (!value.endsWith('@gmail.com')) {
                throw new Error('Email must be a Gmail address');
            }
            return true;
        }),
    body('contact')
        .not().isEmpty().withMessage("Contact must not be empty").bail()
        .isString().withMessage("Contact must be a string").bail()
        .isLength({ min: 10 }).withMessage("Contact number must be 10 digit number").bail()
        .isMobilePhone().withMessage("Contact must be a valid phone number"),

    body("dateOfBirth")
        .not().isEmpty().withMessage("Date of Birth must not be empty").bail()
        .isDate().withMessage("Date of Birth must be a valid date").bail()
        .custom((value) => {
            const birthYear = new Date(value).getFullYear();
            if (birthYear > 2010) {
                throw new Error("Candidate must be born on or before 2010")
            }
            return true;
        }),

    body('addressStreet')
        .not().isEmpty().withMessage("Street address is required").bail()
        .isString().withMessage("Street address must be a string").bail()
        .isLength({ max: 255 }).withMessage("Street address must be less than 255 characters"),

    body('addressCity')
        .not().isEmpty().withMessage("city is required").bail()
        .isString().withMessage("City must be a string").bail()
        .isLength({ max: 100 }).withMessage("City must be less than 100 characters"),

    body('addressState')
        .not().isEmpty().withMessage("Enter the state").bail()
        .isString().withMessage("State must be a string").bail()
        .isLength({ max: 100 }).withMessage("State must be less than 100 characters"),

    body('postalCode')
        .not().isEmpty().withMessage("Enter the postal code").bail()
        .isString().withMessage("Postal code must be a string").bail()
        .isLength({ min: 6, max: 6 }).withMessage("Postal code must be in 6 digit number"),

    body('qualification')
        .not().isEmpty().withMessage("Qualification must not be empty").bail()
        .isString().withMessage("Qualification must be a string"),

    body('guardianName')
        .optional()  // Makes the field optional
        .isString().withMessage("Guardian name must be a string").bail()
        .isLength({ min: 2, max: 50 }).withMessage("Guardian name must be between 2 and 50 characters").bail()
        .matches(/^[a-zA-Z\s]+$/).withMessage("Guardian name must contain only letters and spaces"),

    body('guardianContact')
        .optional()  // Makes the field optional
        .isString().withMessage("Guardian contact must be a string").bail()
        .isLength({ min: 10, max: 15 }).withMessage("Guardian contact number must be between 10 and 15 digits").bail()
        .matches(/^[0-9]+$/).withMessage("Guardian contact must contain only numbers"),

    body('courseType')
        .not().isEmpty().withMessage("Enter course type").bail()
        .isIn(['Angular', 'React', 'Vue js', 'Node js', 'Php']).withMessage("Course type must be one of: Angular, React, Vue js, Node js, Php"),

    body('preferredLanguage')
        .optional()  // Makes the field optional
        .isString().withMessage("Preferred language must be a string").bail()
        .isIn(['English', 'Malayalam', 'Tamil']).withMessage("Preferred language must be one of: English, Malayalam, Tamil"),
    body('termsAccepted')
        .not().isEmpty().withMessage("You must accept the terms and conditions").bail()
        .isBoolean().withMessage("Terms accepted must be a boolean value"),

    body('additionalComments')
        .optional()
        .isString().withMessage("Additional comments must be a string")

]

const batch = [
    body("batch_no")
    .not().isEmpty().withMessage("Enter batch number").bail()
    .isNumeric().withMessage("Batch  number should be numeric").bail(),

    body("batch_name")
    .not().isEmpty().withMessage("Enter batch name").bail()
    .isString().withMessage("Batch name should not be a numeric value")
    .isLength({ min: 2, max: 50 }).withMessage("Batch name must be between 2 and 50 characters")
    .custom(value => {
        if (/\d/.test(value)) { // Check if the value contains any digits
            throw new Error('Batch name must not contain numbers');
        }
        return true;
    }),

]


const additionalDetails = [
    body('name', 'Invalid name. Name should only contain alphabetic characters.').isAlpha('en-US', { ignore: ' ' }),

    body('age', 'age should be in numericvalues').isNumeric().custom((value) => {
        if (value >= 100 || value < 18) {
            throw new Error('Age must be less than 100 and greater than 18');
        }
        if (value.length > 2) {
            throw new Error('Age cannot be three digit');
        }
        return true;
    }),

    body('gender', 'Invalid gender value').isIn(['male', 'female', 'other'])
        .withMessage('Gender must be one of the following: male, female, or other.'),

    body('role')
        .notEmpty().withMessage('Role is required').bail()
        .isIn(['admin', 'teacher', 'student']).withMessage('Invalid role, must be admin, teacher, or student'),

    body('pin')
        .not().isEmpty().withMessage("Enter the pin").bail()
        .isNumeric().withMessage("PIN must be numeric values").bail()
        .custom((value) => {

            if (value.toString().length !== 4) {
                throw new Error('PIN must contain exactly 4 digits');
            }
            return true;
        }),
    body('confirmPin')
        .not().isEmpty().withMessage("Confirm pin").bail()
        .isNumeric().withMessage("PIN must be numeric values").bail()
        .custom((value, { req }) => {
            if (value !== req.body.pin) {
                throw new Error('Enter the correct pin')
            }
            if (value.toString().length !== 4) {
                throw new Error('PIN must contain exactly 4 digits');
            }
            return true;
        })
]

const course = [
    body("courseName").not().isEmpty().withMessage("course name must not be empty").bail()
    .isString().withMessage('course name must be a string').bail()
        .isLength({ min: 2, max: 50 }).withMessage("course name must be between 2 and 50 characters")
        .custom(value => {
            if (/\d/.test(value)) { // Check if the value contains any digits
                throw new Error('First name must not contain numbers');
            }
            return true;
        }),


]


module.exports = {
    signup,
    otp,
    teacherRegistration,
    studentRegistration,
    login,
    batch,
    course,
    validationResult
}
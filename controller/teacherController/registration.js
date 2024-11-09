const jwt = require('jsonwebtoken');
const { validationResult } = require('../../utils/userValidation');
const db = require('../../model/index');
const {Op} = require("sequelize"); 
const Response = require('../../helpers/response');
const JWT_SECRECT = process.env.JWT_SECRECT;


class Registration{
/**
 * Handles the teacher registration submission by verifying the user's signup status and storing teacher details.
 * If the user is verified, the registration is saved and a temporary JWT token is returned.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing teacher details.
 * @param {string} req.body.firstName - The first name of the teacher.
 * @param {string} req.body.lastName - The last name of the teacher.
 * @param {string} req.body.photo - The photo of the teacher.
 * @param {string} req.body.dateOfBirth - The teacher's date of birth.
 * @param {string} req.body.gender - The gender of the teacher.
 * @param {number} req.body.age - The age of the teacher.
 * @param {string} req.body.email - The email of the teacher.
 * @param {string} req.body.contact - The contact number of the teacher.
 * @param {string} req.body.addressStreet - The street address of the teacher.
 * @param {string} req.body.addressCity - The city address of the teacher.
 * @param {string} req.body.addressState - The state address of the teacher.
 * @param {string} req.body.postalCode - The postal code of the teacher.
 * @param {string} req.body.qualification - The qualification of the teacher.
 * @param {Array} req.body.classesToTeach - The classes the teacher can teach.
 * @param {Array} req.body.subjectsToTeach - The subjects the teacher can teach.
 * @param {string} req.body.experience - The years of experience of the teacher.
 * @param {boolean} req.body.termsAccepted - Whether the teacher has accepted the terms and conditions.
 * @param {string} req.body.additionalComments - Any additional comments by the teacher.
 * 
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a success response with a temporary JWT token if the registration is successful.
 */
static teacherRegistration = async (req, res) => {
    try {
        const { firstName, lastName, photo, dateOfBirth, gender, age, email, contact, addressStreet, addressCity, addressState, postalCode, qualification, classesToTeach, subjectsToTeach, experience, termsAccepted, additionalComments } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return Response.ClientErrorResponse(res, {
                message: "Validation error",
                errors: errors.array(),
                statusCode: 422,
            });
        }

        const getSignup_id = await db.SignUp.findOne(
            {
                where: {
                    email: email
                },
                attributes: ['signup_id', 'isVerified', 'isApproved']
            }
        )
        const getTeacherInfo = await db.Teacher.findOne({
            where: {
                email: email
            }
        })

        if (!getSignup_id || !getSignup_id.isVerified) {
            return Response.ClientErrorResponse(res, {
                message: "user not found or the user isn't verified yet",
                statusCode: 404,
            });
        }

        if (getTeacherInfo) {
            return Response.ClientErrorResponse(res, {
                message: "The Form already submitted",
                statusCode: 409,
            });
        }


        await db.Teacher.create({
            signup_id: getSignup_id.signup_id,
            firstName: firstName,
            lastName: lastName,
            photo: photo,
            gender: gender,
            dateOfBirth: dateOfBirth,
            age: age,
            email: email,
            contact: contact,
            addressStreet: addressStreet,
            addressCity: addressCity,
            addressState: addressState,
            postalCode: postalCode,
            qualification: qualification,
            classesToTeach: classesToTeach,
            subjectsToTeach: subjectsToTeach,
            experience: experience,
            termsAccepted: termsAccepted,
            additionalComments: additionalComments
        });
        const payload = {
            email: email,
            role: "teacher",
            isVerified: getSignup_id.isVerified,
            isApproved: getSignup_id.isApproved,
        };
        const temporary_token = jwt.sign(payload, JWT_SECRECT, { expiresIn: '5m' });
        return Response.SuccessResponse(res, {
            message: "Your Registration submitted successfully wait for the admins response",
            data: {
                temporary_token: temporary_token,
            }
        })
    }
    catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    }
};





/**
 * Fetches the teacher's registration details from the database based on the logged-in user's email.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.user - The authenticated user object.
 * @param {string} req.user.email - The email of the authenticated user.
 * 
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends the teacher's registration details if found.
 */
static getRegisteration = async (req, res) => {
    try {
        const getRegisterDetails = await db.Teacher.findOne({
            where: { email: req.user.email },
        });
        Response.SuccessResponse(res,{
            message:"Registration details fetched successfully",
            data:{
                getRegisterDetails:getRegisterDetails,
            }
        })
    }
    catch (err) {
        console.log(err);
        Response.ServerErrorResponse(res);
    };
};




/**
 * Updates the teacher's registration details based on the provided information.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing updated teacher details.
 * @param {string} req.body.firstName - The first name of the teacher.
 * @param {string} req.body.lastName - The last name of the teacher.
 * @param {string} req.body.photo - The updated photo of the teacher.
 * @param {string} req.body.gender - The updated gender of the teacher.
 * @param {number} req.body.age - The updated age of the teacher.
 * @param {string} req.body.email - The updated email of the teacher.
 * @param {string} req.body.contact - The updated contact number of the teacher.
 * @param {string} req.body.addressStreet - The updated street address of the teacher.
 * @param {string} req.body.addressCity - The updated city address of the teacher.
 * @param {string} req.body.addressState - The updated state address of the teacher.
 * @param {string} req.body.postalCode - The updated postal code of the teacher.
 * @param {string} req.body.qualification - The updated qualification of the teacher.
 * @param {Array} req.body.classesToTeach - The updated classes the teacher can teach.
 * @param {Array} req.body.subjectsToTeach - The updated subjects the teacher can teach.
 * @param {string} req.body.experience - The updated years of experience of the teacher.
 * @param {boolean} req.body.termsAccepted - Whether the teacher has accepted the terms and conditions.
 * @param {string} req.body.additionalComments - Any updated additional comments by the teacher.
 * 
 * @param {Object} res - The HTTP response object.
 * @returns {void} Sends a success response if the registration details are updated successfully.
 */
static updateRegisterion = async (req, res) => {  
    try {
        const { firstName, lastName, photo, gender, age, email, contact, addressStreet, addressCity, addressState, postalCode, qualification, classesToTeach, subjectsToTeach, experience, termsAccepted, additionalComments } = req.body;
        const updateDetails = await db.Teacher.update(
            {
                firstName: firstName,
                lastName: lastName,
                photo: photo,
                gender: gender,
                age: age,
                email: email,
                contact: contact,
                addressStreet: addressStreet,
                addressCity: addressCity,
                addressState: addressState,
                postalCode: postalCode,
                qualification: qualification,
                classesToTeach: classesToTeach,
                subjectsToTeach: subjectsToTeach,
                experience: experience,
                termsAccepted: termsAccepted,
                additionalComments: additionalComments
            },
            { where: { email: req.user.email } },
        )
        Response.SuccessResponse(res,{
            message: "data updated successfully"
        })
    }
    catch (err) {
        console.log(err);
        Response.ServerErrorResponse(res);
    }
};

}
module.exports = Registration;
const jwt = require('jsonwebtoken');
const { validationResult } = require('../../utils/userValidation');
const db = require('../../model/index');
const { Op } = require('sequelize');
const JWT_SECRECT = process.env.JWT_SECRECT;
const Response = require('../../helpers/response');



class Registration {
/**
 * Registers a student by saving their registration data into the database.
 *
 * @param {Object} req - The HTTP request object. Contains the body data with student registration details.
 * @param {Object} req.body - The body of the request containing the student's details.
 * @param {string} req.body.firstName - The first name of the student.
 * @param {string} req.body.lastName - The last name of the student.
 * @param {string} req.body.photo - The photo URL of the student.
 * @param {string} req.body.gender - The gender of the student.
 * @param {number} req.body.age - The age of the student.
 * @param {string} req.body.email - The email address of the student.
 * @param {string} req.body.contact - The contact number of the student.
 * @param {string} req.body.dateOfBirth - The date of birth of the student.
 * @param {string} req.body.guardianName - The name of the student's guardian.
 * @param {string} req.body.guardianContact - The contact number of the student's guardian.
 * @param {string} req.body.preferredLanguage - The preferred language of the student.
 * @param {string} req.body.courseType - The type of course the student is enrolling in.
 * @param {string} req.body.addressStreet - The street address of the student.
 * @param {string} req.body.addressCity - The city where the student resides.
 * @param {string} req.body.addressState - The state where the student resides.
 * @param {string} req.body.postalCode - The postal code of the student's address.
 * @param {string} req.body.qualification - The highest qualification of the student.
 * @param {boolean} req.body.termsAccepted - Indicates if the student has accepted the terms and conditions.
 * @param {string} req.body.additionalComments - Any additional comments provided by the student.
 * @param {Object} res - The HTTP response object. Used to send the response back to the client.
 * 
 * @returns {void} Sends a response indicating whether the registration was successful or if an error occurred.
 */
static studentRegisteration = async (req, res) => {
    try {
        const { firstName, lastName, photo, gender, age, email, contact, dateOfBirth, guardianName, guardianContact, preferredLanguage, courseType, addressStreet, addressCity, addressState, postalCode, qualification, termsAccepted, additionalComments } = req.body;
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
        const getStudentInfo = await db.Student.findOne({
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

        if (getStudentInfo) {
            return Response.ClientErrorResponse(res, {
                message: "The Form already submitted",
                statusCode: 409,
            });
        }


        await db.Student.create({
            signup_id: getSignup_id.signup_id,
            firstName: firstName,
            lastName: lastName,
            photo: photo,
            gender: gender,
            age: age,
            email: email,
            dateOfBirth: dateOfBirth,
            guardianName: guardianName,
            guardianContact: guardianContact,
            preferredLanguage: preferredLanguage,
            courseType: courseType,
            contact: contact,
            addressStreet: addressStreet,
            addressCity: addressCity,
            addressState: addressState,
            postalCode: postalCode,
            qualification: qualification,
            termsAccepted: termsAccepted,
            additionalComments: additionalComments
        })
        const payload = {
            email: email,
            role: "student",
            isVerified: getSignup_id.isVerified,
            isApproved: getSignup_id.isApproved,
        };
        const temporary_token = jwt.sign(payload, JWT_SECRECT, { expiresIn: '5m' })
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
 * Retrieves the registration details of the student based on their email.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.user - The authenticated user object containing the user's email.
 * @param {string} req.user.email - The email of the authenticated user.
 * @param {Object} res - The HTTP response object. Used to send the response back to the client.
 * 
 * @returns {void} Sends a response with the student's registration details if found.
 */
static getRegisteration = async (req, res) => {
    try {
        const getRegisterDetails = await db.Student.findOne({
            where: { email: req.user.email }
        });
        return Response.SuccessResponse(res, {
            message: "Registration details fetched successfully",
            data: {
                getRegisterDetails: getRegisterDetails,
            }
        })
    }
    catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    }
};




/**
 * Updates the student's registration details.
 *
 * @param {Object} req - The HTTP request object. Contains the body data to update the registration details.
 * @param {Object} req.body - The body of the request containing the updated student details.
 * @param {string} req.body.firstName - The updated first name of the student.
 * @param {string} req.body.lastName - The updated last name of the student.
 * @param {string} req.body.photo - The updated photo URL of the student.
 * @param {string} req.body.gender - The updated gender of the student.
 * @param {number} req.body.age - The updated age of the student.
 * @param {string} req.body.email - The updated email address of the student.
 * @param {string} req.body.contact - The updated contact number of the student.
 * @param {string} req.body.dateOfBirth - The updated date of birth of the student.
 * @param {string} req.body.guardianName - The updated name of the student's guardian.
 * @param {string} req.body.guardianContact - The updated contact number of the student's guardian.
 * @param {string} req.body.preferredLanguage - The updated preferred language of the student.
 * @param {string} req.body.courseType - The updated type of course the student is enrolling in.
 * @param {string} req.body.addressStreet - The updated street address of the student.
 * @param {string} req.body.addressCity - The updated city where the student resides.
 * @param {string} req.body.addressState - The updated state where the student resides.
 * @param {string} req.body.postalCode - The updated postal code of the student's address.
 * @param {string} req.body.qualification - The updated qualification of the student.
 * @param {boolean} req.body.termsAccepted - The updated terms acceptance status of the student.
 * @param {string} req.body.additionalComments - Any updated additional comments from the student.
 * @param {Object} res - The HTTP response object. Used to send the response back to the client.
 * 
 * @returns {void} Sends a response indicating if the update was successful or if an error occurred.
 */
static updateRegisteration = async (req, res) => {
    try {
        const { firstName, lastName, photo, gender, age, email, contact, dateOfBirth, guardianName, guardianContact, preferredLanguage, courseType, addressStreet, addressCity, addressState, postalCode, qualification, termsAccepted, additionalComments } = req.body;
        const updateDetails = await db.Student.update(
            {
                firstName: firstName,
                lastName: lastName,
                photo: photo,
                gender: gender,
                age: age,
                email: email,
                dateOfBirth: dateOfBirth,
                guardianName: guardianName,
                guardianContact: guardianContact,
                preferredLanguage: preferredLanguage,
                courseType: courseType,
                contact: contact,
                addressStreet: addressStreet,
                addressCity: addressCity,
                addressState: addressState,
                postalCode: postalCode,
                qualification: qualification,
                termsAccepted: termsAccepted,
                additionalComments: additionalComments
            },
            { where: { email: req.user.email } }
        )
        return Response.SuccessResponse(res, {
            message: "data updated successfully"
        })
    }
    catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    }
};
}

module.exports = Registration;
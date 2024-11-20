const bcrypt = require('bcrypt');
const path = require('path')
const { validationResult } = require('../../utils/userValidation');
const db = require('../../model/index');
const { Op } = require('sequelize');
const emailService = require('../../utils/emailService');
const otp = require('../../utils/otpGenerator');
const Response = require('../../helpers/response');



class SignUp {
    /**
     * Handles student sign-up by validating input, checking for existing users, hashing passwords, and sending OTP.
     *
     * @param {Object} req - The HTTP request object. Contains the request body and other properties.
     * @param {Object} req.body - The body of the request containing student sign-up details.
     * @param {string} req.body.email - The email address provided by the student for registration.
     * @param {string} req.body.confirmPassword - The password provided by the student to be confirmed.
     * @param {Object} res - The HTTP response object. Used to send the response back to the client.
     * 
     * @returns {void} Sends a response indicating the success or failure of the sign-up process.
     */
    static signUp = async (req, res) => {
        const { email, confirmPassword } = req.body;

        try {
           
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Response.ClientErrorResponse(res, {
                    message: "Validation error",
                    errors: errors.array(),
                    statusCode: 422,
                });
            }

            const getStudent = await db.SignUp.findOne({
                where: {
                    [Op.or]: [
                        { [Op.and]: [{ email: email }, { isVerified: true }] },
                        { [Op.and]: [{ email: email }, { isVerified: false }] },
                    ]
                }
            })

            // console.log(getStudent.isVerified)
            const message = "Thank you for Signing Up";
            if (getStudent) {
                if (getStudent.isVerified) {
                    // return res.status(409).json({
                    //     msg: 'user already exists'
                    // });

                    return Response.ClientErrorResponse(res, {
                        message: 'user already exists',
                        statusCode: 409,
                    })
                } else {
                    await emailService(
                        {
                            email: email,
                            path: (path.join(__dirname, '../../views/email.pug')),
                            otp: (await otp(getStudent.signup_id)),
                            message:message,
                        }
                    );
                    // return res.status(409).json({
                    //     msg: 'account is already created but unverified check your email and enter the otp'
                    // });
                    return Response.ClientErrorResponse(res, {
                        message: 'account is already created but unverified check your email and enter the otp',
                        statusCode: 409,
                    })

                }
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(confirmPassword, saltRounds);

            //create the student user
            const getNewStudent = await db.SignUp.create({
                email: email,
                password: hashedPassword
            });

            await emailService( {
                email: email,
                path: (path.join(__dirname, '../../views/email.pug')),
                otp: (await otp(getNewStudent.signup_id)),
                message:message,
            });
            // return res.status(201).json({
            //     msg: 'Account created successfully'
            // });
            return Response.SuccessResponse(res, {
                message: "Account created successfully",
                statusCode: 201,
            })
        } catch (err) {
            console.log(err);
            return Response.ServerErrorResponse(res);
        }
    }
}
module.exports = SignUp;


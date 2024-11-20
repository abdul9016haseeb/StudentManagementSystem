const bcrypt = require('bcrypt');
const path = require('path')
const { validationResult } = require('../../utils/userValidation');
const db = require('../../model/index');
const { Op } = require("sequelize");
const emailService = require('../../utils/emailService');
const otp = require('../../utils/otpGenerator');
const Response = require('../../helpers/response');




class SignUp {
    /**
     * Handles teacher sign-up process.
     * It validates the input, checks if the user already exists (verified or not), and either sends an OTP for unverified users or creates a new account for new users.
     * 
     * @param {Object} req - The HTTP request object.
     * @param {Object} req.body - The body of the request containing the user's details.
     * @param {string} req.body.email - The email of the teacher attempting to sign up.
     * @param {string} req.body.confirmPassword - The password for the teacher account, to be confirmed.
     * 
     * @param {Object} res - The HTTP response object.
     * @returns {void} Sends a success or error response based on the sign-up process outcome.
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
            };

            const getTeacher = await db.SignUp.findOne({
                where: {
                    [Op.or]: [
                        { [Op.and]: [{ email: email }, { isVerified: true }] },
                        { [Op.and]: [{ email: email }, { isVerified: false }] },

                    ],
                },
            });
            const message = "Thank you for Signing Up";
            if (getTeacher) {
                if (getTeacher.isVerified) {
                    return Response.ClientErrorResponse(res, {
                        message: 'user already exists',
                        statusCode: 409,
                    })
                } else {
                    await emailService(
                        {
                            email: email,
                            path: (path.join(__dirname, '../../views/email.pug')),
                            otp: (await otp(getTeacher.signup_id)),
                            message: message,
                        }
                    );
                    return Response.ClientErrorResponse(res, {
                        message: 'account is already created but unverified check your email and enter the otp',
                        statusCode: 409,
                    })
                }
            }


            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(confirmPassword, saltRounds);

            // Create the admin user
            const getNewTeacher = await db.SignUp.create({
                email: email,
                password: hashedPassword,
            });


            await emailService(
                {
                    email: email,
                    path: (path.join(__dirname, '../../views/email.pug')),
                    otp: (await otp(getNewTeacher.signup_id)),
                    message: message,
                }
            );

            return Response.SuccessResponse(res, {
                message: "Account created successfully",
                statusCode: 201,
            })
        } catch (err) {
            console.log(err);
            return Response.ServerErrorResponse(res);
        }
    };
}
module.exports = SignUp;
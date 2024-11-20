const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('../../utils/userValidation');
const { Op } = require('sequelize');
const db = require('../../model/index');
const path = require('path');
const JWT_SECRECT = process.env.JWT_SECRECT;
const REFRESH_SECRECT = process.env.REFRESH_SECRECT;
const Response = require('../../helpers/response');
const TokenGeneration = require('../../utils/tokenGeneration');
const otp = require('../../utils/otpGenerator');
const emailService = require('../../utils/emailService');



class ForgotPassword {
    static submitResetEmail = async (req, res) => {
        try {
            const { email } = req.body;
            console.log(email);
            //  throw new Error("testing error");
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Response.ClientErrorResponse(res, {
                    message: "Validation error",
                    errors: errors.array(),
                    statusCode: 422,
                });
            };
            const getResetEmail = await db.SignUp.findOne({
                where: {
                    [Op.and]: [{ email: email }, { isApproved: true }],

                },
                attributes: { exclude: ['googleId', 'password'] },
            });
            if (!getResetEmail) {
                return Response.ClientErrorResponse(res, {
                    message: "user not found",
                    statusCode: 404,
                });
            };
            await emailService(
                {
                    email: email,
                    path: (path.join(__dirname, '../../views/email.pug')),
                    otp: (await otp(getResetEmail.signup_id)),
                    message:"Your Otp to Reset password",
                }
            );

            return Response.SuccessResponse(res, {
                message: 'Otp Successfully Sent to the User email',
            })
        } catch (error) {
            console.log(error);
            return Response.ServerErrorResponse(res);
        }
    }
    
}

module.exports = ForgotPassword;
const { validationResult } = require('../../utils/userValidation');
const { Op } = require("sequelize");
const db = require('../../model/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRECT = process.env.JWT_SECRECT;
const REFRESH_SECRECT = process.env.REFRESH_SECRECT;
const Response = require('../../helpers/response'); 
const TokenGeneration = require('../../utils/tokenGeneration');


class LogIn{
/**
 * @typedef {Object} AdminModel - The model representing the Admin entity.
 * @property {string} email - The admin's email address.
 * @property {string} password - The admin's hashed password.
 * @property {string} refreshToken - The admin's refresh token.
 */

/**
 * @typedef {Object} Response - The structure for the API response.
 * @property {string} message - The message to be included in the response.
 * @property {Object} [data] - The data to be returned with the response.
 * @property {number} statusCode - The status code of the response.
 */


/**
 * Login function for admin authentication.
 *
 * @param {Object} req - The request object containing the login credentials (email and password).
 * @param {Object} res - The response object to send back the API response.
 * @returns {Promise<void>} Resolves to an API response indicating whether the login was successful or not.
 */
static login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //  throw new Error("testing error");
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return Response.ClientErrorResponse(res, {
                message: "Validation error",
                errors: errors.array(),
                statusCode: 422,
            });
        };

        const admin = await db.Admin.findOne({ where: { email: email } });

        if (!admin) {
            return Response.ClientErrorResponse(res, {
                message: "admin not found",
                statusCode: 404,
            });
        };
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
            const token = TokenGeneration.admin(admin, db.Admin);

            return Response.SuccessResponse(res, {
                message: "logged in successfully",
                data: {
                    accessToken: (await token).accessToken,
                    refreshToken: (await token).refreshToken,
                }
            });
        };
        return Response.ClientErrorResponse(res, {
            message: "incorrect password",
            statusCode: 401,
        });
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    };
};



/**
 * Function to refresh the access token using the provided refresh token.
 *
 * @param {Object} req - The request object containing the refresh token.
 * @param {Object} res - The response object to send back the API response.
 * @returns {Promise<void>} Resolves to an API response with a new access token or an error message.
 */
static token = async (req, res) => {
    try {
                //  throw new Error("testing error");
        const { refreshToken } = req.body;
        const getToken = await db.Admin.findOne({
            where: {
                refreshToken: refreshToken,
            },
        });
        if (getToken == null) {
            return Response.ClientErrorResponse(res,{
                message:'Refresh token is required',
                statusCode:401
            })
        };
        jwt.verify(refreshToken, REFRESH_SECRECT, (err, admin) => {
            if (err) {
                return Response.ClientErrorResponse(res,{
                    message: 'Invalid refresh token',
                    statusCode:403,
                })
            };

            const accessToken = jwt.sign({ email: admin.email }, JWT_SECRECT, { expiresIn: '15m' });
            return Response.SuccessResponse(res,{
                message:"access token generated",
                data:{
                    accessToken: accessToken,
                },
            });
        })
    } catch (err) {
        console.error('Error refreshing token:', err);
        return Response.ServerErrorResponse(res);
    };
};

}


module.exports = LogIn;
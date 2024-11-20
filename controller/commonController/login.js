const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('../../utils/userValidation');
const { Op } = require('sequelize');
const db = require('../../model/index');
const JWT_SECRECT = process.env.JWT_SECRECT;
const REFRESH_SECRECT = process.env.REFRESH_SECRECT;
const Response = require('../../helpers/response');
const TokenGeneration = require('../../utils/tokenGeneration');




class LogIn{
/**
 * Handles user login, validates credentials, and generates tokens.
 * @param {Object} req - The request object containing user credentials.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {Object} - Returns a success or error response.
 */
static login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return Response.ClientErrorResponse(res, {
                message: "Validation error",
                errors: errors.array(),
                statusCode: 422,
            });
        };
        const user = await db.SignUp.findOne({
            where: { email: email },
            include: {
                model: db.User,
                required: true  // for assciated user with signups
            },
        });
        if (!user) {
            // return res.status(404).json({ msg: 'user not found' });
            return Response.ClientErrorResponse(res, {
                message: "user not found",
                statusCode: 404,
            });
        };
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = TokenGeneration.user(user, db.Token);
            return Response.SuccessResponse(res, {
                message: "logged in successfully",
                data: {
                    accessToken: (await token).accessToken,
                    refreshToken: (await token).refreshToken,
                }
            });
        }
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
 * Refreshes the access token using a valid refresh token.
 * @param {Object} req - The request object containing the refresh token.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {Object} - Returns a new access token or an error response.
 */
static token = async (req, res) => {
    const { refreshToken } = req.body;
    try {

        const getToken = await db.Token.findOne({
            where: {
                refreshToken: refreshToken,
            },
        });
        // console.log(getToken)
        if (!getToken) {
            // return res.status(401).json({ msg: 'Refresh token isnt exist' });
            return Response.ClientErrorResponse(res, {
                message: "Refresh token isnt exist",
                statusCode: 400,
            });
        };
        jwt.verify(refreshToken, REFRESH_SECRECT, (err, user) => {
            if (err) {
                // return res.status(401).json({ message: 'Invalid refresh token' });
                return Response.ClientErrorResponse(res, {
                    message: "Invalid refresh token",
                    statusCode: 401,
                });
            };
            console.log(user);
            const payload = { email: user.email, role: user.role, isVerified: user.isVerified, isApproved: user.isApproved };

            const accessToken = jwt.sign(payload, JWT_SECRECT, { expiresIn: '2m' });
            // res.status(200).json({ accessToken: accessToken });
            return Response.SuccessResponse(res, {
                message: "Access Token Created",
                data: {
                    accessToken: accessToken,
                },
            });
        })
    } catch (err) {
        console.error('Error refreshing token:', err);
        return Response.ServerErrorResponse(res);
    }
};
}

module.exports = LogIn;
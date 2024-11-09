const db = require('../../model/index');
const {Op} = require("sequelize"); 
const commonController  = require('../commonController/index');
const dashBoard = 'https://locahost:3000/student/dashboard';
const Response = require('../../helpers/response');




class SsoLogIn{
/**
 * Handles the SSO login process.
 * It verifies the user's credentials based on the Google login and then generates an access and refresh token, redirecting to the dashboard.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.user - The user information from the SSO provider (e.g., Google).
 * @param {string} req.user.email - The email of the authenticated user.
 * @param {string} req.user.id - The Google ID of the authenticated user.
 * 
 * @param {Object} res - The HTTP response object.
 * @returns {void} Redirects to the dashboard with the generated tokens as query parameters.
 */
static ssoLogin = async (req, res) => {
    try {
        const user = await db.SignUp.findOne({
            where: {
                [Op.and]: [{ email: req.user.email }, { googleId: req.user.id }, { isVerified: true }, { isApproved: true }]
            },
            include: {
                model: db.User,
                required: true  // for assciated user with signups
            }
        })
        if (!user) {
            return Response.ClientErrorResponse(res, {
                message: "user not found",
                statusCode: 404,
            });
        }
        const token = commonController.login.g(user, db.Token);
        return res.redirect(`${dashBoard}?accessToken=${(await token).accessToken}&refreshToken=${(await token).refreshToken}`)
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    }
};
}

module.exports = SsoLogIn;

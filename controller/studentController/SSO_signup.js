const db = require('../../model/index');
const {Op} = require('sequelize');
const Response = require('../../helpers/response');
const loginPage = 'https://locahost:3000/student/login'
const Registration = 'https://locahost:3000/student/register'
const User = "student";


class SsoSignUp{
/**
 * Handles the SSO (Single Sign-On) sign-up process for users logging in via Google.
 * If the user already exists and is verified, it redirects them to login.
 * If the user is new, it creates a new entry in the `SignUp` table and renders a JWT verification page.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.user - The authenticated user object populated by the SSO authentication middleware.
 * @param {string} req.user.email - The email address of the authenticated user.
 * @param {string} req.user.id - The Google ID of the authenticated user.
 * @param {boolean} req.user.verified - The verified status of the authenticated user.
 * 
 * @param {Object} res - The HTTP response object.
 * @returns {void} Renders the verification page if the user is new, or returns a response indicating the user exists.
 */
static ssoSignUp = async (req, res) => {
    try {

        const getStudent = await db.SignUp.findAll({
            where: {
                [Op.and]: [{ isVerified: true }, { email: req.user.email }]
            }
        })
        // console.log(getStudent);
        if (getStudent.length != 0) {
            // return res.status(402).json({
            //     msg: "the user already exists please login to continue"
            // })

            return Response.ClientErrorResponse(res, {
                message: "the user already exists please login to continue",
                statusCode: 402,
            });
        }

        const [user, created] = await db.SignUp.findOrCreate({
            where: { googleId: req.user.id || { isVerified: true } },
            defaults: {
                email: req.user.email,
                isVerified: req.user.verified
            }
        })

        if (!created) {
            return res.send(`<h2>the user already exists</h2><br> <a href="${loginPage}">Go to login page</a>`);
        }

        return res.render('VerifyJwt', {Registration,User});


    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    }
}
}
module.exports = SsoSignUp;

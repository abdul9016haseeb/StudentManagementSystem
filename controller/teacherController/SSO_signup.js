const db = require('../../model/index');
const {Op} = require("sequelize"); 
const Response = require('../../helpers/response');
const loginPage = 'https://locahost:3000/teacher/login';
const Registration = 'https://locahost:3000/teacher/register';
const User = "teacher";


class SsoSignUp{
/**
 * Handles the SSO sign-up process for teachers.
 * It checks if the teacher is already registered and verified, and if not, creates a new record.
 * If the user already exists, it redirects them to the login page or renders a verification page.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.user - The user information from the SSO provider (e.g., Google).
 * @param {string} req.user.email - The email of the authenticated user.
 * @param {string} req.user.id - The Google ID of the authenticated user.
 * @param {boolean} req.user.verified - The verification status of the authenticated user.
 * 
 * @param {Object} res - The HTTP response object.
 * @returns {void} Renders the verification page or redirects to the login page.
 */
static ssoSignUp = async (req, res) => {
    try {
        const getTeacher = await db.SignUp.findAll({
            where: {
                [Op.and]: [{ isVerified: true }, { email: req.user.email }]
            }
        })
        if (getTeacher.length != 0) {
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

        return res.render('VerifyJwt', { Registration, User });


    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    }
};

}
module.exports = SsoSignUp;

const db = require('../../model/index');
const {Op} = require('sequelize');
const commonController = require('../commonController/index');  //--need to change
const Response = require('../../helpers/response');
const dashBoard = 'https://locahost:3000/student/dashboard';

class SsoLogIn{
/**
 * Handles Single Sign-On (SSO) login for the user using Google OAuth, verifying the user's email, Google ID, and approval status.
 * Generates tokens upon successful login and redirects the user to the dashboard.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.user - The authenticated user object populated by the SSO authentication middleware.
 * @param {string} req.user.email - The email of the authenticated user.
 * @param {string} req.user.id - The Google ID of the authenticated user.
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {void} Redirects to the dashboard with access and refresh tokens in the query string or sends a response indicating an error.
 */
static ssoLogin = async(req,res)=>{
    try{
         const user = await db.SignUp.findOne({
            where:{
                [Op.and]:[{email:req.user.email},{googleId:req.user.id},{isVerified:true},{isApproved:true}]
            },
            include: {
                model: db.User,
                required: true  // for assciated user with signups
            }
         })
         if (!user) {
            // return res.status(404).json({ msg: 'user not found' });

            return Response.ClientErrorResponse(res, {
                message: "user not found",
                statusCode: 404,
            });
        }
        const token = commonController.login.generateTokens(user, db.Token);

            return res.redirect(`${dashBoard}?accessToken=${(await token).accessToken}&refreshToken=${(await token).refreshToken}`)
        
    }catch(err){
        console.log(err);
        return Response.ServerErrorResponse(res);
    }
};
}

module.exports = SsoLogIn;

const {Op} = require("sequelize"); 
const db = require('../../model/index');
const bcrypt = require('bcrypt');
const Response = require('../../helpers/response');

class SignUp{
/**
 * Sign up function for creating a new admin user.
 *
 * @param {Object} req - The request object containing user data for registration.
 * @param {Object} res - The response object to send back the API response.
 * @returns {Promise<void>} Resolves to an API response with the newly created admin's details.
 */
static signUp = async (req, res) => {
    try {
        const { email, confirmPassword } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(confirmPassword, saltRounds);
        
        // Create the admin user
        const newAdmin = await db.Admin.create({
            email: email,
            password: hashedPassword,
        });
        return Response.SuccessResponse(res,{
            message: "Admin created successfully",
            statusCode: 201,
            data:{
                email:newAdmin.email,
                createdAt: newAdmin.createdAt,
            },
        });
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    };
};

}

module.exports = SignUp;



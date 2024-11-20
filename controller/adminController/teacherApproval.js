const {Op} = require("sequelize"); 
const db = require('../../model/index');
const path = require('path');
const emailService  = require('../../utils/emailService');
const Response = require('../../helpers/response');

class TeacherApproval{
/**
 * Function to retrieve unapproved teacher registrations from the database.
 * @param {Object} req - The request object, containing the parameters for the operation.
 * @param {Object} res - The response object to send back the API response.
 */
static teacherRegistration = async (req, res) => {
    try {
            //    throw new Error("testing error");
        const approvals = await db.Teacher.findAll({
            include: [
                {
                    model: db.SignUp,
                    attributes: ['isApproved'],
                    where: { isApproved: false },
                },
            ],
        });
        return Response.SuccessResponse(res,{
            data:{
                approvals,
            }
        })
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    };
};


/**
 * Function to approve a teacher and add them to the User table.
 * @param {Object} req - The request object containing teacher approval details.
 * @param {Object} res - The response object to send back the API response.
 */
static approveTeacher = async (req, res) => {
    try {
        //    throw new Error("testing error");
        const role = 'teacher';
        const { signup_id, isApproved, email, firstName, lastName } = req.body;
        const getUser = await db.User.findAll({
            where: { signup_id: signup_id },
        });

        const [updated] = await db.SignUp.update(
            { isApproved: isApproved },
            { where: { signup_id: signup_id } },
        );

        if (!updated) {
            return Response.ClientErrorResponse(res,{
                message:"There is an issue while accepting the User",
                statusCode:404,
            })
        };
        
        if (getUser.length != 0) {
            return Response.SuccessResponse(res,{
                message:"Teacher already approved",
            })
        };
        await db.User.create({
            firstName: firstName,
            lastName: lastName,
            signup_id: signup_id,
            role: role,
        });

        await emailService(
            {
                email:email, 
                path:path.join(__dirname, '../../views/teacherApproval.pug'),
            }
        );

        return Response.SuccessResponse(res,{
            message:"Teacher approved",
        })
    }
    catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    };
};

}
module.exports = TeacherApproval;
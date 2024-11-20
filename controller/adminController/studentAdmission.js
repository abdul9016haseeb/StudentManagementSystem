const { Op } = require("sequelize");
const db = require('../../model/index');
const path = require('path');
const emailService = require('../../utils/emailService');
const Response = require('../../helpers/response');

class StudentAddmission {
    /**
     * Function to retrieve unapproved student admissions from the database.
     * @param {Object} req - The request object, containing the parameters for the operation.
     * @param {Object} res - The response object to send back the API response.
     */
    static studentAddmission = async (req, res) => {
        try {
            const admissions = await db.Student.findAll({
                include: [
                    {
                        model: db.SignUp,
                        attributes: ['isApproved'],
                        where: { isApproved: false },
                    },
                ],
            });
            return Response.SuccessResponse(res, {
                data: {
                    admissions,
                }
            })
        } catch (err) {
            console.log(err);
            return Response.ServerErrorResponse(res);
        };
    };




    /**
     * Function to approve a student and add them to the User table.
     * @param {Object} req - The request object containing student approval details.
     * @param {Object} res - The response object to send back the API response.
     */
    static approveStudent = async (req, res) => {
        try {
            const role = 'student';
            const { signup_id, isApproved, email, firstName, lastName } = req.body;

            const getUser = await db.User.findAll({
                where: { [Op.and]: [{ signup_id: signup_id }] },
            });

            const [updated] = await db.SignUp.update(
                { isApproved: isApproved },
                { where: { signup_id: signup_id } },
            );
            if (!updated) {
                return Response.ClientErrorResponse(res, {
                    message: "There is an issue while accepting the User",
                    statusCode: 404,
                })
            };
            if (getUser.length != 0) {
                return Response.SuccessResponse(res, {
                    message: "Student already exists"
                })
            };
            await db.User.create({
                firstName: firstName,
                lastName: lastName,
                signup_id: signup_id,
                role: role,
            });

            await emailService(
                { email: email, path: path.join(__dirname, '../../views/studentApproval.pug') }
            );
            return Response.SuccessResponse(res, {
                message: "Student Approved",
            })
        }
        catch (err) {
            console.log(err);
            return Response.ClientErrorResponse(res);
        };
    };

}

module.exports = StudentAddmission;
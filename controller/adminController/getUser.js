const db = require('../../model/index'); // Database models
const {Op} = require("sequelize"); // Sequelize operators for query conditions 
const Response = require('../../helpers/response'); // Response helper class for API responses


class GetUser{
/**
 * @typedef {Object} Student - Student data object.
 * @property {boolean} isApproved - Indicates whether the student is approved.
 */

/**
 * @typedef {Object} Teacher - Teacher data object.
 * @property {boolean} isApproved - Indicates whether the teacher is approved.
 */

/**
 * @typedef {Object} ResponseOptions - Options for handling response data.
 * @property {string} [message] - Message to include in the response.
 * @property {number} [statusCode] - HTTP status code for the response.
 * @property {Student[]|Teacher[]} [data] - Array of student or teacher data objects.
 */

/**
 * Fetches all approved students.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a response with the list of students or an error message.
 */

static getStudents = async (req, res) => {
    try {
        const getStudents = await db.Student.findAll({
            include: [
                {
                    model: db.SignUp,
                    attributes: ['isApproved'],
                    where: { isApproved: true },
                },
            ],
        });

        if (getStudents.length == 0) {
            return Response.ClientErrorResponse(res,{
                message:"No students available",
                statusCode:404,
            })
        };
        return Response.SuccessResponse(res,{
            message:"Successfully fetched students",
            data:{
                getStudents,
            }
        })
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    };
};



/**
 * Fetches all approved teachers.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a response with the list of teachers or an error message.
 */
static getTeachers = async (req, res) => {
    try {
        const getTeachers = await db.Teacher.findAll({
            include: [
                {
                    model: db.SignUp,
                    attributes: ['isApproved'],
                    where: { isApproved: true },
                },
            ],
        });
        if (getTeachers.length == 0) {
            return Response.ClientErrorResponse(res,{
                message: "No Teachers available",
                statusCode:404,
            })
        };
        return Response.SuccessResponse(res,{
            message:"Successfully fetched teachers",
            data:{
                getTeachers,
            }
        })
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    };
};

}

module.exports = GetUser;
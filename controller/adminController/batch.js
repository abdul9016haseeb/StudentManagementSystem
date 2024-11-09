const { validationResult } = require('../../utils/userValidation'); 
const { Op } = require("sequelize"); 
const db = require('../../model/index');
const Response = require('../../helpers/response');

class Batch {
/**
 * 
 * @typedef {object} ResponseOptions - Options for handling response data.
 * @property {string} [message] - Message to include in the response
 * @property {number} [statusCode] - HTTP status code for the response
 * @property {ValidationError[]} [errors] - Array of validation errors, if any.
 * @property {object} [data] - Data Object containing additional information
 */



/**
 * Fetches all batches from the database and sends them in a successful response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object used to send the response.
 */
static getBatch = async (req, res) => {
    try {
        const getBatch = await db.Batch.findAll();
        const getbatchmap = getBatch.map((value) => {
            return value.dataValues;
        });
       return Response.SuccessResponse(res, {
            data: {
                batch: getbatchmap,
            }
        })

    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    };
};



/**
 * Creates a new batch if it does not already exist.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing batch details.
 * @param {string} req.body.batch_no - Batch number.
 * @param {string} req.body.batch_name - Batch name.
 * @param {Object} res - Express response object used to send the response.
 */
static createBatch = async (req, res) => {
    try {
        const { batch_no, batch_name } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return Response.ClientErrorResponse(res, {
                message: "Validation error",
                errors: errors.array(),
                statusCode: 422,
            });
        };
        const [batch, created] = await db.Batch.findOrCreate({
            where: { batch_no: batch_no },
            defaults: {
                batch_name: batch_name,
            },
        });
        if (!created) {
            return Response.ClientErrorResponse(res, {
                message: "Batch with this number is already exists.",
                statusCode: 409,
            });
        };
        return Response.SuccessResponse(res, {
            message: "Batch Created successfully",
            statusCode: 201,
            data: {
                batch: batch,
            },
        });

    } catch (err) {
        console.log(err);
        return  Response.ServerErrorResponse(res);
    }
};



/**
 * Updates an existing batch's information.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing updated batch details.
 * @param {number} req.body.batch_no - Batch number to update.
 * @param {string} req.body.batch_name - New batch name.
 * @param {string} req.params.batch_id - ID of the batch to update.
 * @param {Object} res - Express response object used to send the response.
 */
static updateBatch = async (req, res) => {

    try {
        const { batch_no, batch_name } = req.body;
        const { batch_id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return Response.ClientErrorResponse(res, {
                message: "Validation error",
                errors: errors.array(),
                statusCode: 422,
            });
        };

        const [updated] = await db.Batch.update(
            {
                batch_no: batch_no,
                batch_name: batch_name,
            },
            { where: { batch_id: batch_id } },
        );


        if (!updated) {
            return Response.ClientErrorResponse(res, {
                message: "Batch not found",
                statusCode: 404,
            });
        };
       return Response.SuccessResponse(res, {
            message: "Batch info updated successfully",
        })
    } catch (err) {
        console.log(err);
        return  Response.ServerErrorResponse(res);
    };
};



/**
 * Deletes a batch by ID.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.batch_id - ID of the batch to delete.
 * @param {Object} res - Express response object used to send the response.
 */
static deleteBatch = async (req, res) => {
    const { batch_id } = req.params;
    try {
        const result = await db.Batch.destroy({
            where: { batch_id: batch_id },
        });
        if (!result) {
            return Response.ClientErrorResponse(res, {
                message: "There is some issue occured",
                statusCode: 404,
            })
        };
       return Response.SuccessResponse(res, {
            message: "successfully deleted"
        })
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    };
};



/**
 * Adds a teacher to a specific batch.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing IDs for batch and teacher.
 * @param {number} req.body.batch_id - ID of the batch.
 * @param {number} req.body.teacher_id - ID of the teacher.
 * @param {Object} res - Express response object used to send the response.
 */
static addTeacher_tobatch = async (req, res) => {
    const { batch_id, teacher_id } = req.body;
    try {
        const batch = await db.Batch.findByPk(batch_id);
        const teacher = await db.Teacher.findByPk(teacher_id);
        if (!batch || !teacher_id) {
            return Response.ClientErrorResponse(res, {
                message: "Batch or teacher not found",
                statusCode: 404,
            })
        };
        await batch.addTeacher(teacher);
       return Response.SuccessResponse(res, {
            message: "Teacher added successfully",
            statusCode: 201,
        })
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res)
    };
};



/**
 * Removes a teacher from a specific batch.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.batch_id - ID of the batch.
 * @param {string} req.params.teacher_id - ID of the teacher.
 * @param {Object} res - Express response object used to send the response.
 */
static deleteTeacher_tobatch = async (req, res) => {
    try {
        const { batch_id, teacher_id } = req.params;
        const batch = await db.Batch.findByPk(batch_id);
        const teacher = await db.Teacher.findByPk(teacher_id);
        console.log("batch:", batch_id);
        console.log("teacher:", teacher_id);
        if (!batch || !teacher) {
            return Response.ClientErrorResponse(res, {
                message: "Batch or teacher not found",
                statusCode: 404,
            })
        }
        await batch.removeTeacher(teacher);
       return Response.SuccessResponse(res, {
            message: "Teacher removed successfully",
            statusCode: 200,
        })

    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res)
    };
};



/**
 * Retrieves all teachers associated with a specific batch.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.batch_id - ID of the batch.
 * @param {Object} res - Express response object used to send the response.
 */
static getTeacher_bybatch = async (req, res) => {
    try {
        const { batch_id } = req.params;
        const batch = await db.Batch.findByPk(batch_id, {
            include: {
                model: Teacher
            }
        })
        if (!batch) {
            return Response.ClientErrorResponse(res, {
                message: "Batch not found",
                statusCode: 404,
            })
        }
       return Response.SuccessResponse(res, {
            message: "Successfully fetched batch data",
            data: {
                batch: batch,
            },
        })
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res)
    }
}



/**
 * Adds a student to a batch.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Query parameters.
 * @param {string} req.query.batch_id - ID of the batch.
 * @param {string} req.query.student_id - ID of the student.
 * @param {Object} res - Express response object used to send the response.
 */
static addStudent_tobatch = async (req, res) => {
    try {
        const { batch_id, student_id } = req.query;
        const [updated] = await db.Student.update(
            {
                batch_id: batch_id,
            },
            { where: { student_id: student_id } },
        )

        if (!updated) {
            return Response.ClientErrorResponse(res, {
                message: "Student not found",
                statusCode: 404,
            })
        }
       return Response.SuccessResponse(res, {
            message: "Student added successfully",
        })
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    }
};




/**
 * Removes a student from a batch.
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.query - Query parameters.
 * @param {string} req.query.student_id - ID of the student to remove.
 * @param {Object} res - Express response object used to send the response.
 */
static deleteStudent_tobatch = async (req, res) => {
    try {
        const { student_id } = req.query;
        const [updated] = await db.Student.update(
            {
                batch_id: null,
            },
            { where: { student_id: student_id } },
        )

        if (!updated) {
            return Response.ClientErrorResponse(res, {
                message: "Student not found",
                statusCode: 404,
            })
        }

       return Response.SuccessResponse(res, {
            message: "Student Removed successfully",
        })
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res)
    }
};



/**
 * Retrieves all students associated with a specific batch.
 *
 * @param {Object} req - Express request object.
 * @param {string} req.params.batch_id - ID of the batch.
 * @param {Object} res - Express response object used to send the response.
 */
static getStudent_bybatch = async (req, res) => {
    try {
        const { batch_id } = req.params;
        const getStudents = await db.Student.findAll({
            where: { batch_id: batch_id },
        })

        if (getStudents.length == 0) {
            return Response.ClientErrorResponse(res, {
                message: "No student added yet",
                statusCode: 404,
            })
        }
       return Response.SuccessResponse(res, {
            message: "Successfully fetched student data",
            data: {
                students: getStudents,
            },
        })
    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res)
    }
};
}


module.exports = Batch;
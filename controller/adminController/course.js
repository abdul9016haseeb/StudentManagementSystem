const { validationResult, course } = require('../../utils/userValidation');
const { Op, where } = require("sequelize");
const db = require('../../model/index');
const Response = require('../../helpers/response');
const path = require('path');
const puppeteer = require('puppeteer');

class Course {
    static async newCourseSyllabus(req, res) {
        try {
            // throw new Error("testing error");
            const { courseName, topics, description, objectives, assessmentCriteria } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return Response.ClientErrorResponse(res, {
                    message: "Validation error",
                    errors: errors.array(),
                    statusCode: 422,
                });
            };
            await db.Course.create({
                courseName: courseName,
                topics: topics,
                description: description,
                objectives: objectives,
                assessmentCriteria: assessmentCriteria,
            });
            return Response.SuccessResponse(res, {
                message: "Course Added to List",
                statusCode: 201,
            });
        } catch (error) {
            console.error(error);
            return Response.ServerErrorResponse(res);
        };
    }

    static downloadCourseSyllabus(app) {
        return async (req, res) => {
            try {
                const { courseId } = req.params;
                const course = await db.Course.findOne({
                    where: { courseId: courseId }
                });
                console.log(course.courseName);
                const html = await new Promise((resolve, reject) => {
                    app.render('courseSyllabus', { course }, (error, html) => {
                        if (error) reject(error);
                        else resolve(html);
                    })
                })
                res.send(html);

            } catch (error) {
                console.error(error);
                return Response.ServerErrorResponse(res);
            }
        }
    }
}

module.exports = Course;

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
                async function generatePDF() {
                    // Launch a new browser instance
                    const browser = await puppeteer.launch({
                      headless: false, // Use new headless mode
                    });
                  
                    // Create a new page
                    const page = await browser.newPage();
                  
                    // Set viewport for consistent rendering
                    await page.setViewport({
                      width: 1200,
                      height: 800,
                      deviceScaleFactor: 1
                    });
                  
                    // Navigate to a URL or set HTML content
                    // Option 1: Load from URL
                    await page.goto('https://example.com', {
                      waitUntil: 'networkidle0' // Wait until network is idle
                    });
                  
                    // Option 2: Set HTML content directly
                    await page.setContent(`
                      <html>
                        <head>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 40px; }
                            .header { color: #333; font-size: 24px; }
                          </style>
                        </head>
                        <body>
                          <h1 class="header">Generated PDF Document</h1>
                          <p>This is a sample PDF generated with Puppeteer</p>
                        </body>
                      </html>
                    `);
                  
                    // Generate PDF with options
                    const pdf = await page.pdf({
                      format: 'A4',
                      margin: {
                        top: '40px',
                        right: '40px',
                        bottom: '40px',
                        left: '40px'
                      },
                      printBackground: true,
                      preferCSSPageSize: true,
                      displayHeaderFooter: true,
                      headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%;">Header Text</div>',
                      footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
                    });
                  
                    // Close browser
                    await browser.close();
                  
                    return pdf;
                  }
                  res.send(await generatePDF());
            } catch (error) {
                console.error(error);
                return Response.ServerErrorResponse(res);
            }
        }
    }
}

module.exports = Course;

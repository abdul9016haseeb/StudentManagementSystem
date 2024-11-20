const pug = require('pug');
const nodemailer = require('nodemailer');
const previewEmail = require('preview-email');
const appUser = process.env.appuser;
const appPassword = process.env.appPassword;
const Ph = '8248604367';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",//use gmail.com to real emails
    port: 587, // Use Gmail
    auth: {
        user: appUser, // Your Gmail email
        pass: appPassword, // Use an App Password for Gmail
    },
})

const emailService = async ({ email, path = '', otp = 0 ,message=""}) => {
    const html = pug.renderFile(path, { otp, email, appUser, Ph ,message});
    try {
        const emailOptions = {
            from: appUser,
            to: email,
            subject: 'Account verification',
            html: html,
        };
        // await transporter.sendMail(emailOptions)
        await previewEmail(emailOptions);

    } catch (err) {
        console.log("error rendering file", err.stack);
    };
};

module.exports = emailService;

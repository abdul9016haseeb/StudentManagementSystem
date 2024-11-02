const pug = require('pug');
const fs = require('fs')
const nodemailer = require('nodemailer');
const previewEmail = require('preview-email');

const appUser = process.env.appuser;
const appPassword = process.env.appPassword;
const Ph = '8248604367';

const { Admin, SignUp, Token,Otp,Teacher,Op } = require('../.config/mysql');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",//use gmail.com to real emails
    port: 587, // Use Gmail
    auth: {
        user: appUser, // Your Gmail email
        pass: appPassword, // Use an App Password for Gmail
    },
})


async function otp(signup_id){
    let otp = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const expiration = 1;
    const expiresAt = new Date(Date.now() + expiration * 60000);

    console.log(otp, signup_id);
    await Otp.create({
        signup_id: signup_id,
        otp_code: otp,
        expiresAt: expiresAt
    })
  return otp;
}

async function emailService(email,path='',otp=0) {
    // console.log("path",path);
    // fs.access(path, fs.constants.R_OK, (err) => {
    //     if (err) {
    //         console.error(`Cannot read the file: ${err.message}`);
    //     } else {
    //         console.log("File is readable");
    //     }
    // });

    const html = pug.renderFile(path, { otp,email,appUser,Ph });
    // console.log(html)
    try{
        const emailOptions = {
            from: appUser,
            to: email,
            subject: 'Account verification',
            html: html
        }
        // await transporter.sendMail(emailOptions)
         const emailHTML = await previewEmail(emailOptions);
        console.log('Email previewed at:', emailHTML);
    }catch(err){
        console.log("error rendering file",err.stack);
    }
}

module.exports = {
    emailService,
    otp
}
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path')
const { validationResult } = require('../utils/userValidation');
const { Admin, SignUp, Token,Otp,Teacher,Op, Student,Users } = require('../.config/mysql');
const {emailService,otp} = require('../utils/emailService')
const {generateTokens} = require('../controller/commonController')
const JWT_SECRECT = process.env.JWT_SECRECT;
const REFRESH_SECRECT = process.env.REFRESH_SECRECT;
const verificationRoute = 'http://localhost:4000/admin/verifySignup';
const loginPage = 'https://locahost:3000/student/login'
const dashBoard = 'https://locahost:3000/student/dashboard'
const Registration = 'https://locahost:3000/student/register'
const User = "Student";


//student signup
exports.signUp = async (req, res) => {
    const { email, confirmPassword } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const getStudent = await SignUp.findOne({
            where: {
                [Op.or]: [
                    { [Op.and]: [{ email: email }, { isVerified: true }] },
                    { [Op.and]: [{ email: email }, { isVerified: false }] },
                ]
            }
        })

        // console.log(getStudent.isVerified)

        if (getStudent) {
            if (getStudent.isVerified) {
                return res.status(422).json({
                    msg: 'user already exists'
                });
            } else {
                await emailService(email,(path.join(__dirname, '../views/email.pug')),(await otp(getStudent.signup_id)));
                return res.status(200).json({
                    msg: 'account is already created but unverified check your email and enter the otp'
                });
            }
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(confirmPassword, saltRounds);

        //create the student user
        const getNewStudent = await SignUp.create({
            email: email,
            password: hashedPassword
        });

        await emailService(email,(path.join(__dirname, '../views/email.pug')),(await otp(getNewStudent.signup_id)));
        return res.status(201).json({
            msg: 'Account created successfully'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}


//student registration submission
exports.register = async (req, res) => {
    const { firstName, lastName, photo, gender, age, email, contact,dateOfBirth,guardianName,guardianContact,preferredLanguage,courseType, addressStreet, addressCity, addressState, postalCode, qualification, termsAccepted, additionalComments } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(442).json({ errors: errors.array() })
        }

        const getSignup_id = await SignUp.findOne(
            {
                where: {
                    email: email
                },
                attributes: ['signup_id','isVerified','isApproved']
            }
        )
        const getStudentInfo = await Student.findOne({
            where:{
                email:email
            }
        })

        // console.log(!getSignup_id.isVerified,!getSignup_id);


        // console.log(getSignup_id)
        if (!getSignup_id || !getSignup_id.isVerified) {
            return res.status(404).json({
                msg: "user not found or the user isn't verified yet"
            })
        }

        if(getStudentInfo){
            return res.status(404).json({
                msg: "The Form already submitted"
            })
        }


        await Student.create({
            signup_id:getSignup_id.signup_id,
            firstName: firstName,
            lastName:lastName ,
            photo:photo ,
            gender: gender,
            age: age,
            email: email,
            dateOfBirth:dateOfBirth,
            guardianName:guardianName,
            guardianContact:guardianContact,
            preferredLanguage:preferredLanguage,
            courseType:courseType,
            contact: contact,
            addressStreet: addressStreet,
            addressCity: addressCity,
            addressState: addressState,
            postalCode: postalCode,
            qualification: qualification,
            termsAccepted: termsAccepted,
            additionalComments: additionalComments
        })

        const payload = {
            email:email,
            approved:getSignup_id.isApproved
        }
        //temp_token:true
        //access_token:false
        //role:student or student

        const temporary_token = jwt.sign(payload,JWT_SECRECT,{expiresIn:'5m'})

        return res.status(200).json({
            msg: "Your Registration submitted successfully wait for the admins response",
            temporary_token:temporary_token
        });

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}

//student registration showing
exports.getRegister = async(req,res)=>{
    try {
        console.log(req.user.email);
        const getRegisterDetails = await Student.findOne({
            where: {email:req.user.email}
        })
        console.log(getRegisterDetails)
        res.status(200).json(getRegisterDetails)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}


//update registration details
exports.putRegister = async(req,res)=>{
    const {  firstName, lastName, photo, gender, age, email, contact,dateOfBirth,guardianName,guardianContact,preferredLanguage,courseType, addressStreet, addressCity, addressState, postalCode, qualification, termsAccepted, additionalComments } = req.body;
    try {

        console.log(req.user.email);
        const updateDetails = await Student.update(
           {
            firstName: firstName,
            lastName:lastName ,
            photo:photo ,
            gender: gender,
            age: age,
            email: email,
            dateOfBirth:dateOfBirth,
            guardianName:guardianName,
            guardianContact:guardianContact,
            preferredLanguage:preferredLanguage,
            courseType:courseType,
            contact: contact,
            addressStreet: addressStreet,
            addressCity: addressCity,
            addressState: addressState,
            postalCode: postalCode,
            qualification: qualification,
            termsAccepted: termsAccepted,
            additionalComments: additionalComments
           },
           { where: {email:req.user.email}}
        )
        console.log(updateDetails)
        res.status(200).json({
            msg:"data update successfully"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}


//callback path
exports.callback = async (req, res) => {
    try {

        const getStudent = await SignUp.findAll({
            where: {
                [Op.and]: [{ isVerified: true }, { email: req.user.email }]
            }
        })
        // console.log(getStudent);
        if (getStudent.length != 0) {
            return res.status(402).json({
                msg: "the user already exists please login to continue"
            })
        }

        const [user, created] = await SignUp.findOrCreate({
            where: { googleId: req.user.id || { isVerified: true } },
            defaults: {
                email: req.user.email,
                isVerified: req.user.verified
            }
        })

        if (!created) {
            return res.send(`<h2>the user already exists</h2><br> <a href="${loginPage}">Go to login page</a>`);
        }

        res.render('VerifyJwt', {Registration,User});


    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}


exports.loginCallback = async(req,res)=>{
    try{
        console.log(req.user)
         const user = await SignUp.findOne({
            where:{
                [Op.and]:[{email:req.user.email},{googleId:req.user.id},{isVerified:true},{isApproved:true}]
            },
            include: {
                model: Users,
                required: true  // for assciated user with signups
            }
         })
         if (!user) {
            return res.status(404).json({ msg: 'user not found' })
        }
        const token = generateTokens(user, Token);

            return res.redirect(`${dashBoard}?accessToken=${(await token).accessToken}&refreshToken=${(await token).refreshToken}`)

        // return res.status(200).json({
        //     msg: "logged in successfully",
        //     accessToken: (await token).accessToken,
        //     refreshToken: (await token).refreshToken
        // })
        // res.render(``)
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}
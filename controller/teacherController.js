const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path')
const { validationResult } = require('../utils/userValidation');
const { Admin, SignUp, Token, Otp, Teacher, Users, Op } = require('../.config/mysql');
const { emailService, otp } = require('../utils/emailService')
const { generateTokens } = require('../controller/commonController')
const JWT_SECRECT = process.env.JWT_SECRECT;
const loginPage = 'https://locahost:3000/teacher/login'
const dashBoard = 'https://locahost:3000/student/dashboard'
const Registration = 'https://locahost:3000/teacher/register';
const User = "Teacher"




//teacher signup
exports.signUp = async (req, res) => {
    const { email, confirmPassword } = req.body;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        };

        const getTeacher = await SignUp.findOne({
            where: {
                [Op.or]: [
                    { [Op.and]: [{ email: email }, { isVerified: true }] },
                    { [Op.and]: [{ email: email }, { isVerified: false }] },

                ],
            },
        });

        // console.log(getTeacher.isVerified)

        if (getTeacher) {
            if (getTeacher.isVerified) {
                return res.status(422).json({
                    msg: 'user already exists'
                });
            } else {
                await emailService(email, path.join(__dirname, '../views/email.pug'), (await otp(getTeacher.signup_id)));

                return res.status(200).json({
                    msg: 'account is already created but unverified check your email and enter the otp'
                });
            }
        }
        // const CommonResponse = (StatusCode, Message, Status) => {
        //     const Response = {
        //         StatusCode: StatusCode,
        //         Message: Message,
        //         Status: Status,
        //     };
        //     return Response;
        // };

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(confirmPassword, saltRounds);

        // Create the admin user
        const getNewTeacher = await SignUp.create({
            email: email,
            password: hashedPassword
        });

        await emailService(email, path.join(__dirname, '../views/email.pug'), (await otp(getNewTeacher.signup_id)));

        // return res.status(201)
        // .send((CommonResponse(201, "Account created successfully", true)));
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


//teacher registration submission
exports.register = async (req, res) => {
    const { firstName, lastName, photo, dateOfBirth, gender, age, email, contact, addressStreet, addressCity, addressState, postalCode, qualification, classesToTeach, subjectsToTeach, experience, termsAccepted, additionalComments } = req.body;
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
                attributes: ['signup_id', 'isVerified', 'isApproved']
            }
        )
        const getTeacherInfo = await Teacher.findOne({
            where: {
                email: email
            }
        })

        // console.log(!getSignup_id.isVerified,!getSignup_id);


        // console.log(getSignup_id)
        if (!getSignup_id || !getSignup_id.isVerified) {
            return res.status(404).json({
                msg: "user not found or the user isn't verified yet"
            })
        }

        if (getTeacherInfo) {
            return res.status(404).json({
                msg: "The Form already submitted"
            })
        }


        await Teacher.create({
            signup_id: getSignup_id.signup_id,
            firstName: firstName,
            lastName: lastName,
            photo: photo,
            gender: gender,
            dateOfBirth: dateOfBirth,
            age: age,
            email: email,
            contact: contact,
            addressStreet: addressStreet,
            addressCity: addressCity,
            addressState: addressState,
            postalCode: postalCode,
            qualification: qualification,
            classesToTeach: classesToTeach,
            subjectsToTeach: subjectsToTeach,
            experience: experience,
            termsAccepted: termsAccepted,
            additionalComments: additionalComments
        })

        const payload = {
            email: email,
            approved: getSignup_id.isApproved
        }

        const temporary_token = jwt.sign(payload, JWT_SECRECT, { expiresIn: '5m' })

        return res.status(200).json({
            msg: "Your Registration submitted successfully wait for the admins response",
            temporary_token: temporary_token
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}

//teacher registration showing
exports.getRegister = async (req, res) => {
    try {
        // console.log(req.user.email);
        const getRegisterDetails = await Teacher.findOne({
            where: { email: req.user.email }
        })
        // console.log(getRegisterDetails)
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
exports.putRegister = async (req, res) => {
    const { firstName, lastName, photo, gender, age, email, contact, addressStreet, addressCity, addressState, postalCode, qualification, classesToTeach, subjectsToTeach, experience, termsAccepted, additionalComments } = req.body;
    try {

        // console.log(req.user.email);
        const updateDetails = await Teacher.update(
            {
                firstName: firstName,
                lastName: lastName,
                photo: photo,
                gender: gender,
                age: age,
                email: email,
                contact: contact,
                addressStreet: addressStreet,
                addressCity: addressCity,
                addressState: addressState,
                postalCode: postalCode,
                qualification: qualification,
                classesToTeach: classesToTeach,
                subjectsToTeach: subjectsToTeach,
                experience: experience,
                termsAccepted: termsAccepted,
                additionalComments: additionalComments
            },
            { where: { email: req.user.email } }
        )
        // console.log(updateDetails)
        res.status(200).json({
            msg: "data update successfully"
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

        const getTeacher = await SignUp.findAll({
            where: {
                [Op.and]: [{ isVerified: true }, { email: req.user.email }]
            }
        })
        // console.log(getTeacher);
        if (getTeacher.length != 0) {
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

        //   console.log(req.user.email);
        //   console.log(req.user.id);
        //   console.log(user.dataValues.signup_id);
        // console.log(user.dataValues.signup_id);

        // const payload = {
        //     email: req.user.email,
        //     googleId: req.user.id,
        //     id: user.dataValues.signup_id,
        // }
        // const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '30m' });

        // res.render('VerifyJwt', { token: token });
        res.render('VerifyJwt', { Registration, User });


    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}


exports.loginCallback = async (req, res) => {
    try {
        console.log(req.user)
        const user = await SignUp.findOne({
            where: {
                [Op.and]: [{ email: req.user.email }, { googleId: req.user.id }, { isVerified: true }, { isApproved: true }]
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

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}
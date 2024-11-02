const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('../utils/userValidation');
const { Admin, SignUp, Token, Otp, Teacher, Users, Op } = require('../.config/mysql');
const JWT_SECRECT = process.env.JWT_SECRECT;
const REFRESH_SECRECT = process.env.REFRESH_SECRECT;





exports.generateTokens = async function generateTokens(user, token) {
    
    const payload = {
        email: user.email,
        role: user.User.role,
        isVerified: user.isVerified,
        isApproved: user.isApproved
    }
    console.log(payload);

    const accessToken = jwt.sign(payload, JWT_SECRECT, { expiresIn: '1s' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRECT, { expiresIn: '1m' });

    // console.log(user.User.role);
    const findtoken = await token.findOne({
        where: { signup_id: user.signup_id }
    })

    if (!findtoken) {
        await token.create({
            refreshToken: refreshToken,
            signup_id: user.signup_id
        })
        return { accessToken, refreshToken };
    }

    await token.update(
        { refreshToken: refreshToken },
        {
            where: {
                signup_id: user.signup_id
            }
        }
    )
    return { accessToken, refreshToken };
}

exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const getOtp = await Otp.findOne({
            where: {
                otp_code: otp,
                expiresAt: { [Op.gt]: new Date() }
            }
        })

        if (!getOtp) {
            return res.status(402).json({
                msg: "invalid Otp"
            })
        };

        await Otp.update(
            { isUsed: true },
            {
                where: { otp_code: otp },
                expiresAt: { [Op.gt]: new Date() }
            }
        );

        await SignUp.update(
            { isVerified: true },
            { where: { signup_id: getOtp.signup_id } }
        );

        await Otp.destroy(
            { where: { otp_code: otp } }
        );

        return res.status(200).json({
            msg: "User verified successfully"
        });

    } catch (errors) {
        console.log(errors);
        res.status(500).json({
            msg: "server error"
        })
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const user = await SignUp.findOne({
            where: { email: email },
            include: {
                model: Users,
                required: true  // for assciated user with signups
            }
        });

        // console.log(user)
        if (!user) {
            return res.status(404).json({ msg: 'user not found' })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(isMatch)
        if (isMatch) {
            const token = generateTokens(user, Token);
            return res.status(200).json({
                msg: "logged in successfully",
                accessToken: (await token).accessToken,
                refreshToken: (await token).refreshToken
            })
        }
        return res.status(401).json({
            msg: "incorrect password",

        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}


exports.token = async (req, res) => {
    const { refreshToken } = req.body;

    const getToken = await Token.findOne({
        where: {
            refreshToken: refreshToken
        }
    })
    // console.log(getToken)
    if (!getToken) {
        return res.status(401).json({ msg: 'Refresh token isnt exist' });
    }

    try {
        jwt.verify(refreshToken, REFRESH_SECRECT, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }
            console.log(user);
            const payload = { email: user.email, role: user.role, isVerified: user.isVerified, isApproved: user.isApproved }

            const accessToken = jwt.sign(payload, JWT_SECRECT, { expiresIn: '2m' })
            res.status(200).json({ accessToken: accessToken })
        })
    } catch (err) {
        console.error('Error refreshing token:', err);
        res.status(500).json({ msg: 'Server error' });
    }
}


exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        Token.destroy(
            {
                where: {
                    refreshToken: refreshToken
                }
            }
        )
        res.status(200).json({ msg: "logout successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}

const jwt = require('jsonwebtoken');
const JWT_SECRECT = process.env.JWT_SECRECT;
const REFRESH_SECRECT = process.env.REFRESH_SECRECT;

class TokenGeneration {

    static async admin(admin, Model) {
        const payload = {
            email: admin.email,
            role: admin.role,
        }
        const accessToken = jwt.sign(payload, JWT_SECRECT, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, REFRESH_SECRECT, { expiresIn: '1h' });

        await Model.update(
            { refreshToken: refreshToken },
            {
                where: {
                    id: admin.id
                },
            },
        );
        return { accessToken, refreshToken };
    }; //*


    static async user(user, token) {

        const payload = {
            email: user.email,
            role: user.User.role,
            isVerified: user.isVerified,
            isApproved: user.isApproved,
        };
        console.log(payload);

        const accessToken = jwt.sign(payload, JWT_SECRECT, { expiresIn: '1h' });
        const refreshToken = jwt.sign(payload, REFRESH_SECRECT, { expiresIn: '1h' });

        // console.log(user.User.role);
        const findtoken = await token.findOne({
            where: { signup_id: user.signup_id },
        });

        if (!findtoken) {
            await token.create({
                refreshToken: refreshToken,
                signup_id: user.signup_id,
            });
            return { accessToken, refreshToken };
        };

        await token.update(
            { refreshToken: refreshToken },
            {
                where: {
                    signup_id: user.signup_id,
                },
            },
        );
        return { accessToken, refreshToken };
    };

}

module.exports = TokenGeneration;


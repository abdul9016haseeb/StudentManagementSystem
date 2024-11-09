const {Op} = require('sequelize');
const db = require('../../model/index');
const Response = require('../../helpers/response');


class VerifyOtp{
/**
 * Verifies the OTP provided by the user and updates the user's status accordingly.
 * 
 * @param {Object} req - The HTTP request object. Contains the body data, which includes the OTP.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.otp - The OTP provided by the user for verification.
 * @param {Object} res - The HTTP response object. Used to send the response back to the client.
 * 
 * @returns {void} Sends a response indicating whether the OTP verification was successful or if an error occurred.
 */
static verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const getOtp = await db.Otp.findOne({
            where: {
                otp_code: otp,
                expiresAt: { [Op.gt]: new Date() },
            },
        });

        if (!getOtp) {
            return Response.ClientErrorResponse(res,{
                message: "invalid Otp",
            })
        };

        await db.Otp.update(
            { isUsed: true },
            {
                where: { otp_code: otp },
                expiresAt: { [Op.gt]: new Date() },
            },
        );

        await db.SignUp.update(
            { isVerified: true },
            { where: { signup_id: getOtp.signup_id } },
        );

        await db.Otp.destroy(
            { where: { otp_code: otp } },
        );
        return Response.SuccessResponse(res,{
            message: "User verified successfully",
        })

    } catch (errors) {
        console.log(errors);
        return Response.ServerErrorResponse(res);
    };
};
}


module.exports = VerifyOtp;
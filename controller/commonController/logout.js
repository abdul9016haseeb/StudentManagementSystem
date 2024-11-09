const db = require('../../model/index');
const Response = require('../../helpers/response');


class LogOut {
    
/**
 * Handles the logout process by destroying the refresh token from the database.
 * 
 * @param {Object} req - The HTTP request object. Contains the body data, which includes the refreshToken.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.refreshToken - The refresh token provided by the user for logout.
 * @param {Object} res - The HTTP response object. Used to send the response back to the client.
 * 
 * @returns {void} Sends a response indicating whether the logout was successful or if an error occurred.
 */
static logOut = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        db.Token.destroy(
            {
                where: {
                    refreshToken: refreshToken,
                },
            },
        );
        // res.status(200).json({ msg: "logout successfully" });
        return Response.SuccessResponse(res,{
            message:"logout successfully",
        })

    } catch (err) {
        console.log(err);
        return Response.ServerErrorResponse(res);
    };
};
}

module.exports = LogOut;
const { Op } = require("sequelize");
const db = require('../../model/index');
const Response = require('../../helpers/response');


class LogOut {
    /**
     * Logout function for invalidating the user's refresh token.
     *
     * @param {Object} req - The request object containing the refresh token to be removed.
     * @param {Object} res - The response object to send back the API response.
     * @returns {Promise<void>} Resolves to an API response indicating whether the logout was successful or not.
     */
    static logOut = async (req, res) => {
        const { refreshToken } = req.body;
        try {
            db.Admin.update(
                { refreshToken: null },
                {
                    where: {
                        refreshToken: refreshToken,
                    },
                },
            );
            return Response.SuccessResponse(res, {
                message: "logout successfully",
            })
        } catch (err) {
            console.log(err);
            return Response.ServerErrorResponse(res);
        };
    };

}

module.exports = LogOut;
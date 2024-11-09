const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRECT;
const Response = require('../helpers/response');

class AuthenticateJWT{
    static authenticatJWT(role){
       return function(req,res,next){
        const authHeader = req.headers.authorization;
        let token;
    
        if (req.query.token != undefined) {
            token = (req.query.token).split(' ')[1];
        } else {
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            } else {
                return Response.ClientErrorResponse(res, {
                    message: 'Authorization header missing or improperly formatted',
                })
            };
        };
    
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                   return Response.ClientErrorResponse(res, {
                        message: 'Session expired, please login or signup again',
                        statusCode: 403,
                    })
                } else {
                    return Response.ClientErrorResponse(res, {
                        message: 'Invalid token',
                        statusCode: 401,
                    })
                }
            };
             console.log(decoded);
            if(decoded.role !== role){
                return Response.ClientErrorResponse(res,{
                    message:"Invalid user type",
                    statusCode:401,
                })
            }
            req.user = decoded;
            next();
        });
       }
    }
    static authAdmin(){
        const role = "admin"
        return this.authenticatJWT(role);
    }
    static authTeacher(){
        const role = "teacher"
        return this.authenticatJWT(role);
    }
    static authStudent(){
        const role = "student"
        return this.authenticatJWT(role);
    }
}

module.exports = AuthenticateJWT;

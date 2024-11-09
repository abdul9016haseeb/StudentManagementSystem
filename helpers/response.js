const http = require('http');
class Response{
    static responseFormat(res,{message,data,errors,extraData,statusCode}){
        // console.log(statusCode);
        return res.status(statusCode).json({
            status: http.STATUS_CODES[statusCode] || "Unknown Status Code",
            message,
            data,
            errors,
            extraData,
        });
    }
    
    static InfomationalResponse(res,{message="",data=null,errors=[],extraData=null,statusCode = 100}={}) {
        return this.responseFormat(res,{message,data,errors,extraData,statusCode});
     }

    static SuccessResponse(res,{message="",data=null,errors=[],extraData=null,statusCode = 200}={}) {
        return this.responseFormat(res,{message,data,errors,extraData,statusCode});
    }

    static ClientErrorResponse(res,{message="",data=null,errors=[],extraData=null,statusCode = 400}={}) {
        return this.responseFormat(res,{message,data,errors,extraData,statusCode});
    }

    static ServerErrorResponse(res,{message="server error",data=null,errors=[],extraData=null,statusCode = 500}={}) {
        return this.responseFormat(res,{message,data,errors,extraData,statusCode});
    }
};

module.exports = Response;
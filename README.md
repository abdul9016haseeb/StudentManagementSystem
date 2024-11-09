Step 1:-
need to have a change controllers files - completed

step 2:-
need to change the otp generation - completed

Step 3:-
gave a structed response
should be well defined        - completed

Step 4:-
define params in each functions  - almost

Step 5:-
use the middlewares for seperating user authentication routes - completed

step 5:-
token generation util - completed

step 6:-
add syllabus field in course and include download pdf option - need to do

note:-
 using object transferring is the most efficient and flexible way to handle parameter
 





   Response.SuccessResponse(res,{
            message:"logout successfully",
        })

Response.ServerErrorResponse(res);

 return Response.ClientErrorResponse(res, {
                message: "Validation error",
                errors: errors.array(),
                statusCode: 422,
            });




 // const CommonResponse = (StatusCode, Message, Status) => {
        //     const Response = {
        //         StatusCode: StatusCode,
        //         Message: Message,
        //         Status: Status,
        //     };
        //     return Response;
        // };


        // return res.status(201)
        // .send((CommonResponse(201, "Account created successfully", true)));
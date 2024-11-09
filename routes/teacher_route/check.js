const express = require('express');
const router = express.Router();
const AuthenticateJWT = require('../../middleware/jwtMiddleware')

router.get('/check',[AuthenticateJWT.authTeacher()],(req,res)=>{
    res.send("hello")
} );


module.exports = router;
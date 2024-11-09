const express = require('express');
const router = express.Router();
const AuthenticateJWT = require('../../middleware/jwtMiddleware')

router.get('/check',[AuthenticateJWT.authStudent()],(req,res)=>{
    res.send("dffd")
} );


module.exports = router;
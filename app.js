require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/index')


const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

app.use('/',router.admin_router);
app.use('/',router.student_router);
app.use('/',router.teacher_router);
app.use('/',router.router)


app.get('/',(req,res)=>{
    res.send("hello");
})

app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`server listening to the port ${PORT}` );
})
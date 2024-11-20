require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const Response = require('./helpers/response');
const PORT = process.env.PORT || 5000;
// const AuthenticateJWT = require('./middleware/jwtMiddleware');

const AdminController = require('./controller/adminController/index');


const db = require('./model/index');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);
app.use('/static',express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    const response = { StatusCode: 404, Message: "Page Not Found" };
    Response.ClientErrorResponse(res, response);
});

app.get('/admin/courseSyllabus/:courseId',AdminController.Course.downloadCourseSyllabus(app));

(async () => {
    await db.sequelize.sync({ force: false }); // Ensure all tables and relationships sync
    console.log('all models are successfully synched');
})();


app.use((err,req,res,next)=>{
    console.error(err);
    
})

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`server listening to the port ${PORT}`);
});

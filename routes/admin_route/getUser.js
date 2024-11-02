const express = require('express');
const router = express.Router();
const adminController = require('../../controller/adminController');
const {authenticatJWT} = require('../../middleware/jwtMiddleware');



// router.get('/getStudents',adminController.getStudents)
router.get('/getStudents',[authenticatJWT],adminController.getStudents);


router.get('/getTeachers',[authenticatJWT],adminController.getTeachers);


module.exports = router;
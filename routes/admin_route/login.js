const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const adminController = require('../../controller/adminController');
const {authenticatJWT} = require('../../middleware/jwtMiddleware');




router.post('/login',[validator.login], adminController.login);

router.get('/teacher-approvals',[authenticatJWT],adminController.teacher_approvals);

router.put('/teacher-approvals/accept',[authenticatJWT],adminController.accept_approvals);

router.get('/student-admission',[authenticatJWT],adminController.student_addmissions);

router.put('/student-admission',[authenticatJWT],adminController.student_accept);


router.post('/token',adminController.token);

router.post('/logout',[authenticatJWT],adminController.logout);





module.exports = router;
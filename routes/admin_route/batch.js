const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const adminController = require('../../controller/adminController');
const {authenticatJWT} = require('../../middleware/jwtMiddleware');



router.get('/batch',[authenticatJWT,validator.batch],adminController.getBatch);

router.post('/create-batch',[authenticatJWT,validator.batch],adminController.createBatch);

router.put('/update-batch/:batch_id',[authenticatJWT,validator.batch],adminController.updateBatch);

router.delete('/delete-batch/:batch_id',[authenticatJWT,validator.batch],adminController.deleteBatch);


//assign teachers to batches
router.post('/batch/addTeacher',[authenticatJWT],adminController.addTeacher_tobatch);


//delete teacher and also show the teacher associated in a batch
router.delete('/batch/:batch_id/removeTeacher/:teacher_id',[authenticatJWT],adminController.deleteTeacher_tobatch);

router.get('/batch/getTeacher/:batch_id',[authenticatJWT],adminController.getTeacher_bybatch);




// students by batch
router.patch('/batch/addStudent',[authenticatJWT],adminController.addStudent_tobatch);

router.patch('/batch/removeStudent',[authenticatJWT],adminController.deleteStudent_tobatch);

router.get('/batch/getStudents/:batch_id',[authenticatJWT],adminController.getStudent_bybatch);


module.exports = router;
const express = require('express');
const router = express.Router();
const validator = require('../../utils/userValidation');
const AdminController = require('../../controller/adminController/index');
const AuthenticateJWT = require('../../middleware/jwtMiddleware');



router.get('/batch',[AuthenticateJWT.authAdmin(),validator.batch],AdminController.Batch.getBatch);

router.post('/create-batch',[AuthenticateJWT.authAdmin(),validator.batch],AdminController.Batch.createBatch);

router.put('/update-batch/:batch_id',[AuthenticateJWT.authAdmin(),validator.batch],AdminController.Batch.updateBatch);

router.delete('/delete-batch/:batch_id',[AuthenticateJWT.authAdmin(),validator.batch],AdminController.Batch.deleteBatch);


//assign teachers to batches
router.post('/batch/addTeacher',[AuthenticateJWT.authAdmin()],AdminController.Batch.addTeacher_tobatch);


//delete teacher and also show the teacher associated in a batch
router.delete('/batch/:batch_id/removeTeacher/:teacher_id',[AuthenticateJWT.authAdmin()],AdminController.Batch.deleteTeacher_tobatch);

router.get('/batch/getTeacher/:batch_id',[AuthenticateJWT.authAdmin()],AdminController.Batch.getTeacher_bybatch);




// students by batch
router.patch('/batch/addStudent',[AuthenticateJWT.authAdmin()],AdminController.Batch.addStudent_tobatch);

router.patch('/batch/removeStudent',[AuthenticateJWT.authAdmin()],AdminController.Batch.deleteStudent_tobatch);

router.get('/batch/getStudents/:batch_id',[AuthenticateJWT.authAdmin()],AdminController.Batch.getStudent_bybatch);


module.exports = router;
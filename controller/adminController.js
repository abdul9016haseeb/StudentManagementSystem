const { validationResult } = require('../utils/userValidation');
const { Admin, SignUp, Op, Teacher, Student, Users, Batch,Course } = require('../.config/mysql');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const { emailService } = require('../utils/emailService');
const JWT_SECRECT = process.env.JWT_SECRECT;
const REFRESH_SECRECT = process.env.REFRESH_SECRECT;



async function generateTokens(admin, Model) {

    const accessToken = jwt.sign({ email: admin.email }, JWT_SECRECT, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ email: admin.email }, REFRESH_SECRECT, { expiresIn: '1h' })

    await Model.update(
        { refreshToken: refreshToken },
        {
            where: {
                id: admin.id
            }
        },
    );
    return { accessToken, refreshToken };
};


exports.signUp = async (req, res) => {
    const { email, confirmPassword } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(confirmPassword, saltRounds);

        // Create the admin user
        const newAdmin = await Admin.create({
            email: email,
            password: hashedPassword
        });

        res.status(201).json({
            msg: 'Admin created successfully',
            admin: {
                email: newAdmin.email,
                createdAt: newAdmin.createdAt
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const admin = await Admin.findOne({ where: { email: email } });

        if (!admin) {
            return res.status(404).json({ msg: 'admin not found' })
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
            const token = generateTokens(admin, Admin);
            return res.status(200).json({
                msg: "logged in successfully",
                accessToken: (await token).accessToken,
                refreshToken: (await token).refreshToken
            })
        }

        return res.status(401).json({
            msg: "incorrect password",

        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}

exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    try {
        Admin.update(
            { refreshToken: null },
            {
                where: {
                    refreshToken: refreshToken
                }
            }
        )
        res.status(200).json({ msg: "logout successfully" });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "server error"
        })
    }
}


exports.token = async (req, res) => {
    const { refreshToken } = req.body;

    const getToken = await Admin.findOne({
        where: {
            refreshToken: refreshToken
        }
    })
    // console.log(getToken)
    if (getToken == null) {
        return res.status(401).json({ msg: 'Refresh token is required' });
    }

    try {
        jwt.verify(refreshToken, REFRESH_SECRECT, (err, admin) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            const accessToken = jwt.sign({ email: admin.email }, JWT_SECRECT, { expiresIn: '15m' })
            res.status(200).json({ accessToken: accessToken })
        })
    } catch (err) {
        console.error('Error refreshing token:', err);
        res.status(500).json({ msg: 'Server error' });
    }
}



//teacher approval part
exports.teacher_approvals = async (req, res) => {
    try {
        const approvals = await Teacher.findAll({
            include: [
                {
                    model: SignUp,
                    attributes: ['isApproved'],
                    where: { isApproved: false }
                }
            ]
        })

        // console.log(JSON.stringify(approvals.,null,4));
        res.status(200).json(approvals)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}

exports.accept_approvals = async (req, res) => {
    try {
        const role = 'Teacher';
        const { signup_id, isApproved, email, firstName, lastName } = req.body;
        const getUser = await Users.findAll({
            where: { signup_id: signup_id }
        })

        const [updated] = await SignUp.update(
            { isApproved: isApproved },
            { where: { signup_id: signup_id } }
        )

        if (!updated) {
            return res.status(404).json({
                msg: "there is an issue while accepting the User"
            })
        }
        if (getUser.length != 0) {
            return res.status(200).json({
                msg: "Teacher already approved"
            })
        }
        await Users.create({
            firstName: firstName,
            lastName: lastName,
            signup_id: signup_id,
            role: role
        })

        await emailService(email, path.join(__dirname, '../views/teacherApproval.pug'));

        return res.status(200).json({
            msg: "Teacher Approved"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}




//student admission part
exports.student_addmissions = async (req, res) => {
    try {
        const approvals = await Student.findAll({
            include: [
                {
                    model: SignUp,
                    attributes: ['isApproved'],
                    where: { isApproved: false }
                }
            ]
        })
        //   console.log(JSON.stringify(approvals,null,4));
        res.status(200).json(approvals)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}


exports.student_accept = async (req, res) => {
    try {
        const role = 'Student';
        const { signup_id, isApproved, email, firstName, lastName } = req.body;

        const getUser = await Users.findAll({
            where: { signup_id: signup_id }
        })

        const [updated] = await SignUp.update(
            { isApproved: isApproved },
            { where: { signup_id: signup_id } }
        )
        if (!updated) {
            return res.status(404).json({
                msg: "there is an issue while accepting the User"
            })
        }
        if (getUser.length != 0) {
            return res.status(200).json({
                msg: "student already approved"
            })
        }
        await Users.create({
            firstName: firstName,
            lastName: lastName,
            signup_id: signup_id,
            role: role
        })

        await emailService(email, path.join(__dirname, '../views/studentApproval.pug'));

        res.status(200).json({
            msg: "Student Approved"
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
};








//batch
exports.getBatch = async (req, res) => {
    try {
        const getBatch = await Batch.findAll();
        const getbatchmap = getBatch.map((value) => {
            return value.dataValues;
        })
        console.log(getBatch);
        return res.status(201).json({
            batch: getbatchmap
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}

exports.createBatch = async (req, res) => {
    const { batch_no, batch_name } = req.body;
    try {
        //for validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        //for finding and creation
        const [batch, created] = await Batch.findOrCreate({
            where: { batch_no: batch_no },
            defaults: {
                batch_name: batch_name
            }
        })
        if (!created) {
            return res.status(409).json({
                msg: "Batch with this number is already exists."
            })
        }
        return res.status(201).json({
            msg: "Batch Created successfully",
            batch: batch
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
};


exports.updateBatch = async (req, res) => {
    const { batch_no, batch_name } = req.body;
    const { batch_id } = req.params;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const [updated] = await Batch.update(
            {
                batch_no: batch_no,
                batch_name: batch_name
            },
            { where: { batch_id: batch_id } },
        )


        if (!updated) {
            return res.status(404).json({
                msg: "Batch not found"
            })
        }

        return res.status(200).json({
            msg: "Batch info updated successfully",
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}

exports.deleteBatch = async (req, res) => {
    const { batch_id } = req.params;
    try {
        const result = await Batch.destroy({
            where: { batch_id: batch_id }
        })
        if (!result) {
            return res.status(404).json({
                msg: "There is some issue occured"
            })
        }

        return res.status(200).json({ msg: "successfully deleted" })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}


//adding teacher to batch
exports.addTeacher_tobatch = async (req, res) => {
    const { batch_id, teacher_id } = req.body;
    try {
        const batch = await Batch.findByPk(batch_id);
        const teacher = await Teacher.findByPk(teacher_id);


        if(!batch || !teacher_id){
            return res.status(404).json({
                msg:"Batch or teacher not found"
            })
        }

        await batch.addTeacher(teacher);
        return res.status(201).json({
            msg: "Teacher added successfully",
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}

//removing teacher to batch
exports.deleteTeacher_tobatch = async(req,res)=>{
    const {batch_id,teacher_id} = req.params;
    try{
        const batch  = await Batch.findByPk(batch_id);
        const teacher = await Teacher.findByPk(teacher_id);

        
        console.log("batch:",batch_id)
        console.log("teacher:",teacher_id)

        if(!batch || !teacher){
            return res.status(404).json({
                msg: "batch or teacher not found"
            })
        }

        await batch.removeTeacher(teacher);

         res.status(200).json({
            msg:"Teacher removed successfully"
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}

//get all the teacher by batch
exports.getTeacher_bybatch = async(req,res)=>{
    const {batch_id} = req.params;
    try{
        const batch = await Batch.findByPk(batch_id,{
            include:{
                model:Teacher
            }
        })
        if(!batch){
            return res.status(404).json({
                msg:"Batch not found"
            })
        }

        return res.status(200).json({
            batch:batch
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}



//for showing the students,teachers
exports.getStudents = async (req, res) => {
    try {
        const getStudents = await Student.findAll({
            include: [
                {
                    model: SignUp,
                    attributes: ['isApproved'],
                    where: { isApproved: true }
                    //in the future we need to filter out
                }
            ]
        })

        if (getStudents.length == 0) {
            return res.status(404).json({
                msg: "No students available",
            })
        }
        // console.log(JSON.stringify(getStudents,null,4));
        res.status(200).json(getStudents)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const getTeachers = await Teacher.findAll({
            include: [
                {
                    model: SignUp,
                    attributes: ['isApproved'],
                    where: { isApproved: true }
                    //in the future we need to filter out
                }
            ]
        })
        if (getTeachers.length == 0) {
            return res.status(404).json({
                msg: "No Teachers available",
            })
        }
        // console.log(JSON.stringify(getTeachers,null,4));
        return res.status(200).json(getTeachers)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
};

//batch -- students
exports.addStudent_tobatch = async (req, res) => {
    const { batch_id, student_id } = req.query;
    try {

        const [updated] = await Student.update(
            {
                batch_id: batch_id,
            },
            { where: { student_id: student_id } },
        )

        if (!updated) {
            return res.status(404).json({
                msg: "Student not found"
            })
        }

        return res.status(200).json({
            msg: "Student added successfully",
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}

exports.deleteStudent_tobatch = async (req, res) => {
    const { student_id } = req.query;
    try {

        const [updated] = await Student.update(
            {
                batch_id: null,
            },
            { where: { student_id: student_id } },
        )

        if (!updated) {
            return res.status(404).json({
                msg: "Student not found"
            })
        }

        return res.status(200).json({
            msg: "Student removed successfully",
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}

exports.getStudent_bybatch = async (req, res) => {
    const { batch_id } = req.params;
    try {

        const getStudents = await Student.findAll({
            where: { batch_id: batch_id },
        })

        if (getStudents.length == 0) {
            return res.status(404).json({
                msg: "No student added",
            })
        }

        return res.status(200).json({
            students: getStudents
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}

//course
exports.course = async(req,res)=>{
    const {course_name,topics,description,objectives,assessmentCriteria} = req.body;
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(442).json({ errors: errors.array() })
        }
        await Course.create({
            course_name:course_name,
            topics:topics,
            description:description,
            objectives:objectives,
            assessmentCriteria:assessmentCriteria
        })
        return res.status(201).json({
            msg:"Course added to list"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            msg: "servor error"
        })
    }
}
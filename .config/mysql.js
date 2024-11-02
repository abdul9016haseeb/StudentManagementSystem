require('dotenv').config({ path: '../.env' });
const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize(process.env.database, process.env.user, process.env.password, {
  host: process.env.host,
  dialect: 'mysql',
});


const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure refresh tokens are unique
  },
  signup_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    references:{
      model:'SignUp',
      key:'signup_id'
    }
  }
}, {
  tableName: 'tokens', // Specify the table name
  timestamps: true, // Optional: Automatically manage createdAt and updatedAt fields
});

//whenever the admin delete the signup the admin account details or also deleted
const SignUp = sequelize.define('SignUp', {
  signup_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  freezeTableName: true
})

const Otp = sequelize.define('Otp', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  signup_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SignUp',
      key: 'signup_id'
    },
  },
  otp_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
})

const Admin = sequelize.define('Admin', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userType: {
    type: DataTypes.STRING,
    defaultValue: 'admin',
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING
  },

}, {
  tableName: 'admin', // Specify the table name
  freezeTableName: true // Prevent Sequelize from pluralizing the table name
});

const Users = sequelize.define('Users',{
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  signup_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SignUp',
      key: 'signup_id'
    },
  },
  role:{
    type:DataTypes.ENUM('Teacher','Student'),
    allowNull:false
  }
})


//fiedls to add

const Batch = sequelize.define('Batch',{
  batch_id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
  },
  batch_no:{
    type:DataTypes.INTEGER,
    allowNull:false
  },
  batch_name:{
    type:DataTypes.STRING,
    allowNull:false
  }
},{
  tableName: 'batch',
  freezeTableName: true
})

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  signup_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SignUp',
      key: 'signup_id'
    },
  },
  batch_id:{
    type:DataTypes.INTEGER,
    allowNull:true,
    references:{
      model:'Batch',
      key:'batch_id'
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING,  // This will store the file path
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Others'),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[0-9]{10}$/,  // Adjust to the format needed (this assumes a 10-digit number)
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  guardianName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  guardianContact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferredLanguage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressStreet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressState: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false
  },
  courseType: {
    type: DataTypes.ENUM('Angular', 'React', 'Vue js', 'Node js', 'Php'),
    allowNull: false  
  },  
  termsAccepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  additionalComments: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "student",
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const Teacher = sequelize.define('Teacher', {
  teacher_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  signup_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SignUp',
      key: 'signup_id'
    },
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,  // This will store the file path
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Others'),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[0-9]{10}$/,  // Adjust to the format needed (this assumes a 10-digit number)
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  guardianName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  guardianContact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferredLanguage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  addressStreet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  addressState: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false
  },
  classesToTeach: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subjectsToTeach: {
    type: DataTypes.ENUM('Angular', 'React', 'Vue js', 'Node js', 'Php'),
    allowNull: false
  },
  experience: {
    type: DataTypes.STRING, // Can be an integer or text depending on how you want to store it
    allowNull: true
  },
  termsAccepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  additionalComments: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: "Teacher",
  timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const Course = sequelize.define('Course',{
  course_id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
  },
  course_name:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  topics:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  description:{
    type:DataTypes.TEXT,
    allowNull:true
  },
  objectives:{
    type:DataTypes.TEXT,
    allowNull:true
  },
  assessmentCriteria:{
    type:DataTypes.TEXT,
    allowNull:true
  }
},{
  tableName:'course'
})


SignUp.hasMany(Otp, { foreignKey: 'signup_id' });
Otp.belongsTo(SignUp, { foreignKey: 'signup_id' });

SignUp.hasOne(Teacher, { foreignKey: 'signup_id' ,sourceKey:'signup_id'});
Teacher.belongsTo(SignUp, { foreignKey: 'signup_id', targetKey:'signup_id' });

SignUp.hasOne(Student, { foreignKey: 'signup_id' ,sourceKey:'signup_id'});
Student.belongsTo(SignUp, { foreignKey: 'signup_id', targetKey:'signup_id' });

SignUp.hasOne(Users, { foreignKey: 'signup_id' ,sourceKey:'signup_id'});
Users.belongsTo(SignUp, { foreignKey: 'signup_id', targetKey:'signup_id' });

SignUp.hasOne(Token, { foreignKey: 'signup_id' ,sourceKey:'signup_id'});
Token.belongsTo(SignUp, { foreignKey: 'signup_id', targetKey:'signup_id' });


//batch table
Batch.hasMany(Student,{foreignKey:'batch_id'});
Student.belongsTo(Batch,{foreignKey:'batch_id'});

Batch.belongsToMany(Teacher, { through: 'BatchTeacher' });
Teacher.belongsToMany(Batch, { through: 'BatchTeacher' });




const sync = async () => {
  await sequelize.sync({ force: false }); // Ensure all tables and relationships sync
  console.log('all models are successfully synched')
}

sync();


module.exports = {
  Admin,
  SignUp,
  Token,
  Otp,
  Teacher,
  Student,
  Users,
  Batch,
  Course,
  Op
}
const { DataTypes } = require("sequelize");

const studentSchema =   {
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
    batch_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Batch',
            key: 'batch_id'
        },
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    photo: {
        type: DataTypes.STRING,  // This will store the file path
        allowNull: true,
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Others'),
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9]{10}$/,  // Adjust to the format needed (this assumes a 10-digit number)
        },
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    guardianName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    guardianContact: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preferredLanguage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    addressStreet: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addressCity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addressState: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    qualification: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    courseType: {
        type: DataTypes.ENUM('Angular', 'React', 'Vue js', 'Node js', 'Php'),
        allowNull: false,
    },
    termsAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    additionalComments: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
};

module.exports = studentSchema;

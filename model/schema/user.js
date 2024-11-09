const { DataTypes } = require("sequelize");

const userSchema = {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    signup_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'SignUp',
            key: 'signup_id'
        },
    },
    role: {
        type: DataTypes.ENUM('teacher', 'student'),
        allowNull: false,
    }
};


module.exports = userSchema;


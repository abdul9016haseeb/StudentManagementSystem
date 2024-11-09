const { DataTypes } = require("sequelize");

const otpSchema = {
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
};


module.exports = otpSchema;


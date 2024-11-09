const { DataTypes } = require("sequelize");

const courseSchema =   {
    courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    courseName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    topics: {
        type: DataTypes.JSON,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    objectives: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    assessmentCriteria: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}

module.exports = courseSchema;

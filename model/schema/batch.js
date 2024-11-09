const { DataTypes } = require("sequelize");

const batchSchema = {
    batch_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    batch_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    batch_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};


module.exports = batchSchema;

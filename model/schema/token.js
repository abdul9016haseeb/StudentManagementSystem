const { DataTypes } = require("sequelize");

const tokenSchema = {
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
  }


module.exports = tokenSchema;


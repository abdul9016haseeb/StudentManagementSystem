const { DataTypes } = require("sequelize");


/**
 * Admin schema definition for the Sequelize model.
 * This schema defines the structure of an 'admin' user in the database.
 * 
 * @typedef {Object} AdminSchema
 * @property {string} email - The email address of the admin user.
 * @property {string} password - The password of the admin user.
 * @property {string} userType - The type of user (default is 'admin').
 * @property {string} [refreshToken] - The refresh token for the admin user, used for token refresh.
 */

const adminSchema =  {
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
    role: {
      type: DataTypes.STRING,
      defaultValue: 'admin',
      allowNull: false
    },
    refreshToken: {
      type: DataTypes.STRING
    },
  
  }


module.exports = adminSchema;


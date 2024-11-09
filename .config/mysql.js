require('dotenv').config({ path: '../.env' });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.database, process.env.user, process.env.password, {
  host: process.env.host,
  dialect: 'mysql',
});

module.exports = sequelize;
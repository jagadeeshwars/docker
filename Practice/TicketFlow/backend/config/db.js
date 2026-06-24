const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD_FILE 
    ? fs.readFileSync(process.env.DB_PASSWORD_FILE, 'utf8').trim() 
    : process.env.DB_PASSWORD;

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, dbPassword, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;

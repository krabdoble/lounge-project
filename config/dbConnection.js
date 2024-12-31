require('dotenv').config();
const { Sequelize } = require('sequelize');

const dbConnection = new Sequelize(process.env.MYSQL_URL, {
    dialect: "mysql",
    logging: false,
   
    
});

module.exports = {dbConnection}

module.exports = {
    development: {
      username: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT || 3306,
      dialect: 'mysql',
    },
    production: {
      username: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MY_SQLDATABASE,
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT || 3306,
      dialect: 'mysql',
    },
  };
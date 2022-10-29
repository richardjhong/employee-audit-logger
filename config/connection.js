const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: '!@24Treada24',
    database: 'employee_db'
  },
  console.log('Connection to employee_db established')
);

module.exports = db;
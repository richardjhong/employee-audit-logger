const departments = require('express').Router();
const db = require("../../config/connection");

// Get all departments
departments.get('/', (req, res) => {
  const sqlQuery = `SELECT id, name AS title 
                    FROM department`;
  db.promise().query(sqlQuery)
    .then( ([rows, fields]) => {
      res.json({
        message: 'success',
        data: rows
      });
      console.table(rows)
    })
    .catch(console.log)
});

// Create a department
departments.post('/new-department', ({ body }, res) => {
  const sql = `INSERT INTO department (name)
    VALUES (?)`;
  const params = [body.name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
    console.log('')
  });
});

module.exports = departments;
const roles = require('express').Router();
const db = require("../../config/connection");

// Get all roles
roles.get('/', (req, res) => {
  const sqlQuery = `SELECT department.name AS department, 
                    title, salary 
                    FROM role
                    LEFT JOIN department ON role.department_id = department.id ORDER BY department.name;`;
  db.query(sqlQuery, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message});
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
    console.table(rows)
  });
});

// Create a department
roles.post('/new-role', ({ body }, res) => {
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
  const params = [body.title, body.salary, body.department_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: body
    });
  });
});

module.exports = roles;
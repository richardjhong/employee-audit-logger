const employees = require('express').Router();
const db = require("../config/connection");

// Get all employees
employees.get('/', (req, res) => {
  const sqlQuery = `SELECT
                    E.id, E.first_name, E.last_name, role.title, department.name AS department, role.salary, CONCAT(M.first_name, ' ', M.last_name) AS manager
                    FROM employee E
                    LEFT JOIN employee M ON M.id = E.manager_id
                    LEFT JOIN role ON E.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id 
                    ORDER BY E.id
                 ;`;
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

// Create an employee
employees.post('/new-employee', ({ body }, res) => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

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

module.exports = employees;
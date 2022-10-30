const db = require("../config/connection");
const inquirer = require('inquirer');
const cTable = require('console.table');

// Get all departments
const getDepartments = () => {
  const sqlQuery = `SELECT id, name AS title 
                    FROM department`;
  db.promise().query(sqlQuery)
    .then( ([rows, fields]) => {
      console.log('\n')
      console.table(rows)
    })
    .catch(console.log)
}

// Create a department
const createDepartment = (name) => {
  const sql = `INSERT INTO department (name)
    VALUES (?)`;
  const params = [name];

  db.promise().query(sql, params, (err, result) => {
    if (err) {
      console.log(err)
      return;
    }
    console.log(`${name} added to departments`)
  });
}

const getRoles = () => {
  const sqlQuery = `SELECT department.name AS department, 
                    title, salary 
                    FROM role
                    LEFT JOIN department ON role.department_id = department.id ORDER BY department.name;`;
  db.promise().query(sqlQuery)
    .then( ([rows, fields]) => {
      console.log('\n')
      console.table(rows)
    })
    .catch(console.log)
}

const createRole = (title, salary, departmentId) => {
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
  const params = [title, salary, departmentId];

  db.promise().query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.log(`Role added.`)
  });
}

module.exports = {
  getDepartments,
  createDepartment,
  getRoles,
  createRole
};
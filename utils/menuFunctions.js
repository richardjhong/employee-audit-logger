const db = require("../config/connection");
const inquirer = require('inquirer');
const cTable = require('console.table');

// Get all departments
const getDepartments = () => {
  const sql = `SELECT id, name AS title 
                    FROM department`;
  db.promise().query(sql)
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
  });
}

// Get all roles
const getRoles = () => {
  const sqlQuery = `SELECT role.id, department.name AS department, 
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

// Create a role
const createRole = (title, salary, departmentId) => {
  const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
  const params = [title, salary, departmentId];

  db.promise().query(sql, params, (err, result) => {
    if (err) {
      console.log(err)
      return;
    }
  });
}

// Get all employees
const getEmployees = () => {
  const sqlQuery = `SELECT
                    E.id, E.first_name, E.last_name, role.title, department.name AS department, role.salary, CONCAT(M.first_name, ' ', M.last_name) AS manager
                    FROM employee E
                    LEFT JOIN employee M ON M.id = E.manager_id
                    LEFT JOIN role ON E.role_id = role.id
                    LEFT JOIN department ON role.department_id = department.id 
                    ORDER BY E.id
                 ;`;
    db.promise().query(sqlQuery)
    .then( ([rows, fields]) => {
      console.log('\n')
      console.table(rows)
    })
    .catch(console.log)
}

// Create an employee
const createEmployee = (first_name, last_name, role_id, manager_id) => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
  const params = [first_name, last_name, role_id, manager_id];

  db.promise().query(sql, params, (err, result) => {
    if (err) {
      console.log(err)
      return;
    }
  });
}

// Update an employee's role
const updateEmployeeRole = (role_id, employee_id) => {
  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`
  const params = [role_id, employee_id]
  db.promise().query(sql, params, (err, result) => {
    if (err) {
      console.log(err)
      return;
    }
  });
}

// Get sum of all salaries of matching department id
const viewDepartmentBudget = (departmentId, departmentBudgetTitle) => {
  const sql = `SELECT SUM(role.salary) as Budget
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id
               WHERE role.department_id = ${departmentId}
              `
  db.promise().query(sql)
    .then( ([rows, fields]) => {
      console.log(`\n${departmentBudgetTitle}`)
      console.table(rows)
    })
    .catch(console.log)
}

// Delete a department
const deleteDepartment = (departmentToDelete) => {
  const sql = `DELETE FROM department
               WHERE department.name = ?
              `
  const params = [departmentToDelete]
  db.promise().query(sql, params, (err, result) => {
    if (err) {
      console.log(err)
      return;
    }
  });
}

module.exports = {
  getDepartments,
  createDepartment,
  getRoles,
  createRole,
  getEmployees,
  createEmployee,
  updateEmployeeRole,
  viewDepartmentBudget,
  deleteDepartment
};
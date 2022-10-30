const express = require('express');
const inquirer = require('inquirer');
const { getDepartments, createDepartment, getRoles, createRole, getEmployees, createEmployee, updateEmployeeRole } = require('./utils/menuFunctions')
const db = require('./config/connection')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const promptUser = async () => {
  const allDepartments = await db.promise().query('SELECT id, name AS title FROM department')
  const departmentTitles = allDepartments[0].map(textRow => textRow.title)
  const allRoles = await db.promise().query('SELECT id, title FROM role')
  const roleTitles = allRoles[0].map(textRow => textRow.title)
  const allManagers = await db.promise().query(`SELECT  M.id, M.first_name, M.last_name, CONCAT(M.first_name, ' ', M.last_name) AS Manager FROM employee E LEFT JOIN employee M on M.id = E.manager_id`)
  const managerNames = allManagers[0].filter(manager => manager.Manager !== null).map(manager => manager.Manager)
  const allEmployees = await db.promise().query(`SELECT id, role_id, CONCAT(first_name, ' ', last_name) AS full_name FROM employee`)
  const employeeFullNames = allEmployees[0].map(textRow => [textRow.id, textRow.full_name].join('.'))

  return inquirer.prompt([
    {
      type: 'list',
      name: 'menuOption',
      message: 'What would you like to do?',
      choices: [
        'View departments',
        'Add a department',
        'View roles',
        'Add a role',
        'View employees',
        'Add an employee',
        'Update an employee\'s role',
        'Exit'
      ]
    },
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'departmentName',
      when(answers) {
        return answers.menuOption === 'Add a department'
      }
    },
    {
      type: 'input',
      message: 'What is the title of the role?',
      name: 'roleTitle',
      when(answers) {
        return answers.menuOption === 'Add a role'
      }
    },
    {
      type: 'input',
      message: 'What is the salary of the role?',
      name: 'roleSalary',
      when(answers) {
        return answers.menuOption === 'Add a role'
      }
    },
    {
      type: 'list',
      message: 'Please select the department',
      name: 'roleDepartment',
      choices: departmentTitles,
      when(answers) {
        return answers.menuOption === 'Add a role'
      }
    },
    {
      type: 'input',
      message: `What is the employee's first name?`,
      name: 'employeeFirstName',
      when(answers) {
        return answers.menuOption === 'Add an employee'
      }
    },
    {
      type: 'input',
      message: `What is the employee's last name?`,
      name: 'employeeLastName',
      when(answers) {
        return answers.menuOption === 'Add an employee'
      }
    },
    {
      type: 'list',
      message: `What is the employee's role?`,
      name: 'employeeRole',
      choices: roleTitles,
      when(answers) {
        return answers.menuOption === 'Add an employee'
      }
    },
    {
      type: 'list',
      message: `Who is the employee's manager?`,
      name: 'employeeManager',
      choices: ['None', ...managerNames],
      when(answers) {
        return answers.menuOption === 'Add an employee'
      }
    },
    {
      type: 'list',
      message: `Which employee's role would you like to update?`,
      name: 'employeeToUpdate',
      choices: employeeFullNames,
      when(answers) {
        return answers.menuOption === 'Update an employee\'s role'
      }
    },
    {
      type: 'list',
      message: 'Which role do you want to assign the selected employee to?',
      name: 'employeeNewRole',
      choices: roleTitles,
      when(answers) {
        return answers.menuOption === 'Update an employee\'s role'
      }
    }
  ]).then(({ menuOption, departmentName, roleTitle, roleSalary, roleDepartment, employeeFirstName, employeeLastName, employeeRole, employeeManager, employeeToUpdate, employeeNewRole }) => {
    switch (menuOption) {
      case 'View departments':
        getDepartments()
        promptUser();
        break;

      case 'Add a department':
        createDepartment(departmentName)
        promptUser();
        break;

      case 'View roles':
        getRoles()
        promptUser();
        break;

      case 'Add a role':
        const filtered = allDepartments[0].filter(individualRow => individualRow.title === roleDepartment)
        const departmentId = filtered[0].id

        createRole(roleTitle, roleSalary, departmentId)
        promptUser();
        break;

      case 'View employees':
        getEmployees()
        promptUser();
        break;

      case 'Add an employee':
        const filteredRole = allRoles[0].filter(individualRow => individualRow.title === employeeRole)
        const roleId = filteredRole[0].id
        let managerId = '';

        if (employeeManager === 'None') {
          managerId = null
        } else {
          const [tempFirstName, tempLastName] = employeeManager.split(' ')
          const filteredManager = allManagers[0].filter(individualRow => individualRow.first_name === tempFirstName && individualRow.last_name === tempLastName)
          managerId = filteredManager[0].id

        }
       createEmployee(employeeFirstName, employeeLastName, roleId, managerId)
       promptUser()
       break;

      case 'Update an employee\'s role':
        const filteredUpdatedRole = allRoles[0].filter(individualRow => individualRow.title === employeeNewRole)
        const updatedRoleId = filteredUpdatedRole[0].id
        const employeeId = employeeToUpdate.split('.')[0]
        updateEmployeeRole(updatedRoleId, employeeId)
        promptUser()
        break;
      
      case 'Exit':
        console.log('Goodbye')
        process.exit(0)

      default:
        console.log('using default of switch statement')
        return;
    }
  })
}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {})

promptUser()
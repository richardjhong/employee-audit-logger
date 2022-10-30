const express = require('express');
const inquirer = require('inquirer');
const { getDepartments, createDepartment, getRoles, createRole, getEmployees } = require('./utils/departmentFunctions')
const db = require('./config/connection')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const promptUser = async () => {
  const allDepartments = await db.promise().query('SELECT id, name AS title FROM department')
  const titles = allDepartments[0].map(textRow => textRow.title )

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
        'View employees'
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
      choices: titles,
      when(answers) {
        return answers.menuOption === 'Add a role'
      }
    }
  ]).then(({ menuOption, departmentName, roleTitle, roleSalary, roleDepartment }) => {
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
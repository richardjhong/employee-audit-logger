const express = require('express');
const inquirer = require('inquirer');
const handleAnswers = require('./utils/answerHandling')
const db = require('./config/connection')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const promptUser = async () => {
  /*
  for each inquirer question that uses list input, the choices array is 
  dynamically generated at the start of each inquirer prompt
  -----
  after user selects from an inquirer list question, the 
  all_____ consts hold information regarding the id of the original
  retrieved row within a table */
  const allDepartments = await db.promise().query('SELECT id, name AS title FROM department')
  const departmentTitles = allDepartments[0].map(textRow => textRow.title)
  const allRoles = await db.promise().query('SELECT id, title FROM role')
  const roleTitles = allRoles[0].map(textRow => textRow.title)
  const allManagers = await db.promise().query(`SELECT  M.id, M.first_name, M.last_name, CONCAT(M.first_name, ' ', M.last_name) AS Manager FROM employee E LEFT JOIN employee M on M.id = E.manager_id`)
  const managerNames = [...new Set(allManagers[0].filter(manager => manager.Manager !== null).map(manager => manager.Manager))]
  const allEmployees = await db.promise().query(`SELECT id, role_id, first_name, last_name, CONCAT(first_name, ' ', last_name) AS full_name FROM employee`)
  const employeeFullNames = allEmployees[0].map(textRow => [textRow.id, textRow.full_name].join('. '))

  return inquirer.prompt([
    {
      type: 'list',
      name: 'menuOption',
      message: 'What would you like to do?',
      choices: [
        'View departments',
        'Add a department',
        'Remove a department',
        'View roles',
        'Add a role',
        'Remove a role',
        'View employees',
        'Add an employee',
        'Update an employee\'s role',
        'Update an employee\'s manager',
        'Remove an employee',
        'View employees by manager',
        'View employees by department',
        'View budget of a department',
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
      message: 'Please select the department.',
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
      message: `Which employee would you like to update?`,
      name: 'employeeToUpdate',
      choices: employeeFullNames,
      when(answers) {
        return (answers.menuOption === 'Update an employee\'s role' || answers.menuOption === 'Update an employee\'s manager')
      }
    },
    {
      type: 'list',
      message: `Who is the employee's manager?`,
      name: 'employeeManager',
      // if the menuOption is 'Add an employee', then any existing employee 
      // can be the manager. Otherwise the menuOption is updating an employee's
      // manager, in which case the employee cannot be the manager of himself/
      // herself.
      choices: (answers) => answers.menuOption === 'Add an employee'  ?['0. None', ...employeeFullNames] : ['0. None', ...employeeFullNames.filter(employee => employee.split('.')[0] !== answers.employeeToUpdate.split('.')[0])],
      when(answers) {
        return (answers.menuOption === 'Add an employee' || answers.menuOption === 'Update an employee\'s manager')
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
    },
    {
      type: 'list',
      message: 'Please select a department to calculate the budget for.',
      name: 'departmentBudgetTitle',
      choices: departmentTitles,
      when(answers) {
        return answers.menuOption === 'View budget of a department'
      }
    },
    {
      type: 'list',
      message: 'Please choose which department to remove.',
      name: 'departmentToDelete',
      choices: departmentTitles,
      when(answers) {
        return answers.menuOption === 'Remove a department'
      }
    },
    {
      type: 'confirm',
      message: (answers) => `Are you sure you want to remove ${answers.departmentToDelete}? This is an irreversible operation.`,
      name: 'confirmDeleteDepartment',
      when(answers) {
        return answers.departmentToDelete
      }
    },
    {
      type: 'list',
      message: 'Please choose which role to remove.',
      name: 'roleToDelete',
      choices: roleTitles,
      when(answers) {
        return answers.menuOption === 'Remove a role'
      }
    },
    {
      type: 'confirm',
      message: (answers) => `Are you sure you want to remove ${answers.roleToDelete}? This is an irreversible operation.`,
      name: 'confirmDeleteRole',
      when(answers) {
        return answers.roleToDelete
      }
    },
    {
      type: 'list',
      message: 'Please choose which employee to remove.',
      name: 'employeeToDelete',
      choices: employeeFullNames,
      when(answers) {
        return answers.menuOption === 'Remove an employee'
      }
    },
    {
      type: 'confirm',
      message: (answers) => `Are you sure you want to remove ${answers.employeeToDelete}? This is an irreversible operation.`,
      name: 'confirmDeleteEmployee',
      when(answers) {
        return answers.employeeToDelete
      }
    },
    {
      type: 'list',
      message: 'Which department would you like to see with associated employees?',
      name: 'departmentOfEmployees',
      choices: departmentTitles,
      when(answers) {
        return answers.menuOption === 'View employees by department'
      }
    },
    {
      type: 'list',
      message: 'Which manager would you like to see with associated employees?',
      name: 'managerOfEmployees',
      choices: managerNames,
      when(answers) {
        return answers.menuOption === 'View employees by manager'
      }
    }
  ]).then((answers) => {
    handleAnswers(answers, allDepartments, allManagers, allRoles)
    promptUser();
  })
}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`
    
 ____________________________________________________________
|                                                            |
|                                                            |
|    ______                 _                                |                    
|   |  ____|               | |                               |                
|   | |____ _ __ ___  _ __ | | ___  _   _  ___  ___          |
|   |  ____| '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\         |
|   | |____| | | | | | |_) | | (_) | |_| |  __/  __/         |
|   |______|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|         |
|                    | |            __/ /                    |
|                    |_|           |___/                     |
|                                                            |
|                                                            |
|   |\\    /|                                                 |
|   | \\  / | __ _ _ __   __ _  __ _  ___ _ __                |    
|   | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |/ _ \\ '__|               |   
|   | |  | | (_| | | | | (_| | (_| |  __/ |                  |
|   |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|                  |  
|                             __/ /                          |
|                            |___/                           |        
|                                                            |
|____________________________________________________________|
                           `)
})


promptUser()
const express = require('express');
const inquirer = require('inquirer');
const { getDepartments, createDepartment, getRoles } = require('./utils/departmentFunctions')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'menuOption',
      message: 'What would you like to do?',
      choices: [
        'View departments',
        'Add a department',
        'View roles'
      ]
    },
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'departmentName',
      when(answers) {
        return answers.menuOption === 'Add a department'
      }
    }
  ]).then(({ menuOption, departmentName }) => {
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

      default:
        console.log('using default of switch statement')
        return;
    }
  })
}

app.use((req, res) => {
  res.status(404).end();
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})


promptUser()
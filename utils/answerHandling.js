const { getDepartments, createDepartment, getRoles, createRole, getEmployees, createEmployee, updateEmployeeRole, viewDepartmentBudget, deleteDepartment } = require('./menuFunctions')

const handleAnswers = (answers, allDepartments, allManagers, allRoles) => {
  const { menuOption, departmentName, roleTitle, roleSalary, roleDepartment, employeeFirstName, employeeLastName, employeeRole, employeeManager, employeeToUpdate, employeeNewRole, departmentBudgetTitle, departmentToDelete, confirmDeleteDepartment } = answers
  switch (menuOption) {
    case 'View departments':
      getDepartments()
      break;

    case 'Add a department':
      createDepartment(departmentName)
      console.log('\n')
      console.log(`${departmentName} added to departments!`)
      break;

    case 'View roles':
      getRoles()
      break;

    // since the answer.roleDepartment does not have a true reference 
    // to its department.id, allDepartments is filtered to find the row within
    // department table that matches the department.id
    case 'Add a role':
      const filtered = allDepartments[0].filter(individualRow => individualRow.title === roleDepartment)
      const departmentId = filtered[0].id

      createRole(roleTitle, roleSalary, departmentId)
      console.log('\n')
      console.log(`${roleTitle} added to roles!`)
      break;

    case 'View employees':
      getEmployees()
      break;

    // since the answer.employeeRole does not have a true reference 
    // to its role.id, allRoles is filtered to find the row within
    // role table that matches the role.id
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
     console.log('\n')
     console.log(`${employeeFirstName} ${employeeLastName} added to employees!`)
     break;

    // in the case of multiple employees with the same first name and last
    // name, allRoles[0] contains the id of each employee from the employee
    // table. This is used within the updateEmployeeRole to have an exact
    // update on the correct employee
    case 'Update an employee\'s role':
      const filteredUpdatedRole = allRoles[0].filter(individualRow => individualRow.title === employeeNewRole)
      const updatedRoleId = filteredUpdatedRole[0].id
      const employeeId = employeeToUpdate.split('.')[0]
      updateEmployeeRole(updatedRoleId, employeeId)
      console.log('\n')
      console.log(`Employee role updated.`)
      break;

    // finds the department id matching that of the department name and 
    // passes to viewDepartmentBudget
    case 'View budget of a department':
      const filteredDepartmentBudgetTitle = allDepartments[0].filter(individualRow => individualRow.title === departmentBudgetTitle)
      const budgetDepartmentId = filteredDepartmentBudgetTitle[0].id
      viewDepartmentBudget(budgetDepartmentId, departmentBudgetTitle)
      break;

    case 'Remove a department':
      if (confirmDeleteDepartment) {
        deleteDepartment(departmentToDelete)
      }
      console.log('\n')
      console.log(`${departmentToDelete} has been deleted from departments.`)
      break;
    
    case 'Exit':
      console.log('Goodbye')
      process.exit(0)

    default:
      return;
  }
}

module.exports = handleAnswers;
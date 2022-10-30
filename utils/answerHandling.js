const { getDepartments, createDepartment, getRoles, createRole, getEmployees, createEmployee, updateEmployeeRole } = require('./menuFunctions')

const handleAnswers = (menuOption, departmentName, roleTitle, roleSalary, roleDepartment, employeeFirstName, employeeLastName, employeeRole, employeeManager, employeeToUpdate, employeeNewRole, allDepartments, allManagers, allRoles) => {
  switch (menuOption) {
    case 'View departments':
      getDepartments()
      break;

    case 'Add a department':
      createDepartment(departmentName)
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
      break;
    
    case 'Exit':
      console.log('Goodbye')
      process.exit(0)

    default:
      return;
  }
}

module.exports = handleAnswers;
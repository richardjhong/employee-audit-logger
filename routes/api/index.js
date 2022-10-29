const express = require('express');

const departments = require('./departmentsRoutes');
const roles = require('./rolesRoutes');
const employees = require('./employeesRoutes');

const app = express();

app.use('/departments', departments);
app.use('/roles', roles);
app.use('/employees', employees);


module.exports = app;
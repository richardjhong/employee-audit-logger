const express = require('express');

const departments = require('./departmentsRoutes');
const roles = require('./rolesRoutes');

const app = express();

app.use('/departments', departments);
app.use('/roles', roles);

module.exports = app;
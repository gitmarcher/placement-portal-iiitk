// similar to app.js. used to manage routes and middleware.

const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
// const app = express();

// app.use(express.json());
// app.use(cookieParser());
const app = express.Router();

const authRoutes = require('./src/routes/authRoutes.js');
const studentroute = require('./src/routes/student/studentroute.js');
const coordroute = require('./src/routes/coordinator/coordroute.js');


app.use("/api/auth",authRoutes);
app.use("/api/student",studentroute);
app.use("/api/coordinator",coordroute);


module.exports = app;









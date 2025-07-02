const express = require('express');
const app = express();
require('dotenv').config();

const salesRoutes = require('./routes/sales');

app.use(express.json());
app.use('/sales', salesRoutes);

module.exports = app;

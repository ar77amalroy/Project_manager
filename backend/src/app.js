const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projects');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

// Global error handler — must be registered last
app.use(errorHandler);

module.exports = app;

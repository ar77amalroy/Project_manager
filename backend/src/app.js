/**
 * @fileoverview Express application factory for the Project Manager API.
 *
 * Configures core middleware (CORS, JSON body parsing), registers API
 * routes under `/api/projects`, and attaches the global error handler
 * as the final middleware in the pipeline.
 *
 * @module app
 */

const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projects');
const errorHandler = require('./middleware/errorHandler');

/** @type {import('express').Express} The configured Express application instance. */
const app = express();

// Core middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);

// Global error handler — must be registered last
app.use(errorHandler);

module.exports = app;

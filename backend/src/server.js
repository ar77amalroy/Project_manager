/**
 * @fileoverview Server entry point for the Project Manager backend.
 *
 * Loads environment variables via dotenv, imports the configured Express
 * application, and starts the HTTP server on the configured port.
 *
 * @module server
 */

require('dotenv').config();
const app = require('./app');

/** @type {number} The port the server listens on — defaults to 5000 if PORT is not set in the environment. */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

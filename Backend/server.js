// server.js
require('dotenv').config();
const express = require('express');
// const mysql = require('mysql2');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json());

// routers
const apiRouter = require('./routes'); // collects domain routers
app.use('/api', apiRouter);

// global error handler
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
  console.log(`View output at http://localhost:${PORT}`);
});

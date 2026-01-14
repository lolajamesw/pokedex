// server.js
require('dotenv').config();
const express = require('express');
// const path = require('path');
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express()
app.use(cors({origin: 'http://localhost:5173', 
  credentials: true
}));
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

// routers
const apiRouter = require('./routes'); // collects domain routers
app.use('/api', apiRouter);

// // Serve React build folder
// app.use(express.static(path.join(__dirname, '/../Frontend/dist')));

// // Catch-all for React (non-API paths)
// app.get(/^\/(?!api).*/, (req, res) => {
//   res.sendFile(path.join(__dirname, '/../Frontend/dist', 'index.html'));
// });

// global error handler
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
  console.log(`View output at http://localhost:${PORT}`);
});

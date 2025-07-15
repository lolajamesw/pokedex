require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

const getRoutes = require('./routes/getRoutes');
const postRoutes = require('./routes/postRoutes');

getRoutes(app, db);
postRoutes(app, db);

const PORT = 8081

app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}`);
    console.log(`View output at http://localhost:${PORT}`);
})
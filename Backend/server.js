require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express()
app.use(cors())

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.get('/', (re, res)=> {
    return res.json("Backend");
})

app.get('/group_members', (req, res)=> {
    const sql = "SELECT * FROM group_members";
    db.query(sql, (err, data)=> {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, ()=> {
    console.log("listening on port 8081");
    console.log("View output at http://localhost:8081/group_members")
})
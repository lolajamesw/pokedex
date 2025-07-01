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

app.get('/pokemon', (req, res) => {
  const uid = 4;

  const sql = `
  SELECT pID AS id, name, type1, type2, hp, atk, def, spAtk, spDef, speed 
  FROM Pokedex
  `;

      db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching Pokémon data:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const formatted = results.map((row) => ({
            id: row.id,
            number: row.id,
            name: row.name,
            types: row.type2 ? [row.type1, row.type2] : [row.type1],
            stats: { hp: row.hp,
            attack: row.atk,
            defense: row.def,
            spAttack: row.spAtk,
            spDefense: row.spDef,
            speed: row.speed,
            },
            caught: false,
        }));
    return res.json(formatted);
  });
});

app.get(`/pokemon/:id`, (req, res) => {
    const pID = req.params.id;
    const sql = `
    SELECT pID AS id, pname, type1, type2, hp, atk, def, spAtk, spDef, speed, legendary, description
    FROM Pokedex WHERE pID=${pID};
    `
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching pokemon's data", err);
            return res.status(500).json({error: "Database error"});
        }

        const formatted = results.map((row) => ({
            id: row.id,
            name: row.pname,
            types: row.type2 ? [row.type1, row.type2] : [row.type1],
            stats: {
                hp: row.hp,
                atk: row.atk, 
                def: row.def, 
                spAtk: row.spAtk, 
                spDef: row.spDef, 
                speed: row.speed
            },
            legendary: row.legendary, 
            description: row.description
        }))
        return res.json(formatted[0]);
    });
});

app.get(`/pokemon/attacks/:id`, (req, res) => {
    const pID = req.params.id;
    const sql = `
    SELECT a.aID, attackName, type, category, power, accuracy, PP, effect
    FROM Attacks a, Learnable_attacks l 
    WHERE pID=${pID} AND a.aID=l.aID;
    `
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching pokemon's data", err);
            return res.status(500).json({error: "Database error"});
        }

        const formatted = results.map((row) => ({
            id: row.aID,
            name: row.attackName,
            type: row.type,
            category: row.category,
            stats: {
                power: row.power,
                accuracy: row.accuracy, 
                pp: row.pp
            },
            effect: row.effect
        }))
        return res.json(formatted);
    });
});

app.get(`/pokemon/evolutions/:id`, (req, res) => {
    const pID = req.params.id;
    const sql = `
    SELECT 
      e1.pIDfrom as prevID
    , p1.name as prevName
    , p1.type1 as prevType1
    , p1.type2 as prevType2
    , ${pID} as currID
    , p2.name as currName
    , p2.type1 as currType1
    , p2.type2 as currType2
    , e2.pIDinto as nextID
    , p3.name as nextName
    , p3.type1 as nextType1
    , p3.type2 as nextType2
    FROM Evolutions e1, Evolutions e2, 
         Pokedex p1, Pokedex p2, Pokedex p3
    WHERE e1.pIDinto=${pID} AND e2.pIDfrom=${pID}
    AND e1.pIDfrom=p1.pID AND p2.pID=${pID} AND e2.pIDinto=p3.pID
    `
    const sq = `
    SELECT 
      p1.pID as pID1
      , p1.name as name1
      , p1.type1 as type11
      , p1.type2 as type21
      , p2.pID as pID2
      , p2.name as name2
      , p2.type1 as type12
      , p2.type2 as type22
      , p3.pID as pID3
      , p3.name as name3
      , p3.type1 as type13
      , p3.type2 as type23
      FROM Evolutions e, Pokemon p1, Pokemon p2, Pokemon p3
      WHERE p1.pID = e.stage1 AND p2.pID = e.stage2
      AND p3.pID = e.stage3 AND (
        e.stage1 = ${pID} OR e.stage2 = ${pID} OR e.stage3 = ${pID}
      )
    `

    const placeholderImg = "\
    https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vectorstock\
    .com%2Froyalty-free-vector%2Fpokeball-icon-sign-seamless-pattern\
    -on-a-gray-vector-11284615&psig=AOvVaw1vb0bYF-dTVwqSVw58iZYT&ust=\
    1751469242855000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxq\
    FwoTCPip0sb5m44DFQAAAAAdAAAAABAE\
    ";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching pokemon's data", err);
            return res.status(500).json({error: "Database error"});
        }

        const formatted = results.map((row) => ({
            base: {
                id: row.pID1,
                name: row.name1,
                types: row.type21 ? [row.type11, row.type21] : [row.type11],
                image: placeholderImg
            },
            stage1: {
                id: row.pID2,
                name: row.name2,
                types: row.type22 ? [row.type12, row.type22] : [row.type12],
                image: placeholderImg
            },
            stage2: {
                id: row.pID3,
                name: row.name3,
                types: row.type23 ? [row.type13, row.type23] : [row.type13],
                image: placeholderImg
            }
        }))
        return res.json(formatted);
    });
});

app.listen(8081, ()=> {
    console.log("listening on port 8081");
    console.log("View output at http://localhost:8081");
    console.log("read table at http://localhost:8081/group_members")
})
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
    SELECT pID, name, type1, type2, hp, atk, def, spAtk, spDef, speed, legendary, description
    FROM Pokedex WHERE pID=${pID};
    `
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching pokemon's data", err);
            return res.status(500).json({error: "Database error"});
        }

        const formatted = results.map((row) => ({
            id: row.pID,
            name: row.name,
            types: row.type2 ? [row.type1, row.type2] : [row.type1],
            stats: {
                hp: row.hp,
                atk: row.atk, 
                def: row.def, 
                spAtk: row.spAtk, 
                spDef: row.spDef, 
                speed: row.speed
            },
            legendary: row.legendary.buffer[0] === 1, 
            description: row.description
        }))
        return res.json(formatted[0]);
    });
});

app.get(`/pokemon/attacks/:id`, (req, res) => {
    const pID = req.params.id;
    const sql = `
    SELECT a.aID, a.attack_name, type, category, power, accuracy, PP, effect
    FROM Attacks a, LearnableAttacks l 
    WHERE pID=${pID} AND a.aID=l.aID;
    `
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching pokemon's data", err);
            return res.status(500).json({error: "Database error"});
        }

        const formatted = results.map((row) => ({
            id: row.aID,
            name: row.attack_name,
            type: row.type,
            category: row.category,
            stats: {
                power: row.power,
                accuracy: row.accuracy, 
                pp: row.PP
            },
            effect: row.effect
        }))
        return res.json(formatted);
    });
});

app.get(`/pokemon/evolutions/:id`, (req, res) => {
    const pID = req.params.id;
    const sql = `
    WITH p3 as (
        SELECT 
          pID as pID3
        , name as name3
        , type1 as type13
        , type2 as type23
        FROM Pokedex p, Evolutions e 
        WHERE p.pID=e.stage2 AND (
        e.base = ${pID} OR e.stage1 = ${pID} OR e.stage2 = ${pID}
      )),
    base as (
	    SELECT 
          p1.pID as pID1
        , p1.name as name1
        , p1.type1 as type11
        , p1.type2 as type21
        , p2.pID as pID2
        , p2.name as name2
        , p2.type1 as type12
        , p2.type2 as type22
      
        FROM Evolutions e, Pokedex p1, Pokedex p2
        WHERE p1.pID = e.base AND p2.pID = e.stage1 AND (
            e.base = ${pID} OR e.stage1 = ${pID} OR e.stage2 = ${pID}
    ))
	SELECT * FROM base LEFT JOIN p3 ON true;
    `;

    const placeholderImg = "/placeholder.png";
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

app.get('/userPokemon', (req, res) => {
  const uID = 5; // Replace with actual user ID from session or authentication

  const sql = `
    SELECT
      mp.instanceID AS id,
      p.pID AS number,
      p.name,
      p.type1,
      p.type2,
      p.hp,
      p.atk,
      p.def,
      p.spAtk,
      p.spDef,
      p.speed,
      mp.nickname
    FROM MyPokemon mp
    JOIN Pokedex p ON mp.pID = p.pID
    WHERE mp.uID = ${uID}
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching user's Pokémon data:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const formatted = results.map((row) => ({
      id: row.id,
      number: row.number,
      name: row.name,
      types: row.type2 ? [row.type1, row.type2] : [row.type1],
      stats: {
        hp: row.hp,
        attack: row.atk,
        defense: row.def,
        spAttack: row.spAtk,
        spDefense: row.spDef,
        speed: row.speed,
      },
      nickname: row.nickname
    }));

    return res.json(formatted);
  });
});

app.post("/addPokemon", async (req, res) => {
  const { pokemonName, nickname, level, uID } = req.body;

  console.log("Incoming request to /addPokemon with:", req.body);

  try {
    const dbPromise = await mysqlPromise.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [rows] = await dbPromise.query(
      "SELECT pID FROM Pokedex WHERE LOWER(name) = LOWER(?)",
      [pokemonName]
    );
    console.log("Pokedex lookup result:", rows);

    if (rows.length === 0) {
      await dbPromise.end();
      return res.status(400).send("Pokémon not found in Pokedex.");
    }

    const pID = rows[0].pID;
    console.log(`Found pID: ${pID}, inserting into MyPokemon...`);

    await dbPromise.query(
      `INSERT INTO MyPokemon (pID, uID, nickname, level, dateAdded)
       VALUES (?, ?, ?, ?, NOW())`,
      [pID, uID, nickname || null, level]
    );

    console.log("Insert successful.");
    await dbPromise.end();
    res.send("Pokémon added successfully.");
  } catch (err) {
    console.error("Error adding Pokémon:", err);
    res.status(500).send("Server error adding Pokémon.");
  }
});


app.listen(8081, ()=> {
    console.log("listening on port 8081");
    console.log("View output at http://localhost:8081");
    console.log("read table at http://localhost:8081/group_members")
})
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const mysqlPromise = require('mysql2/promise');
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
            legendary: row.legendary[0] === 1, 
            description: row.description
        }))
        return res.json(formatted[0]);
    });
});

app.get(`/userPokemon/:id`, (req, res) => {
    const id = req.params.id;
    const sql = `
    SELECT instanceID, mp.pID, name, nickname, level, favourite, onteam, type1, type2, hp, atk, def, spAtk, spDef, speed, legendary, description
    FROM Pokedex p, MyPokemon mp WHERE instanceID=${id} AND p.pID=mp.pID;
    `
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching pokemon's data", err);
            return res.status(500).json({error: "Database error"});
        }

        const formatted = results.map((row) => ({
            id: row.instanceID,
            pID: row.pID,
            name: row.name,
            nickname: row.nickname,
            level: row.level,
            favourite: row.favourite[0]===1,
            onTeam: row.onteam[0]===1,
            types: row.type2 ? [row.type1, row.type2] : [row.type1],
            stats: {
                hp: row.hp,
                atk: row.atk, 
                def: row.def, 
                spAtk: row.spAtk, 
                spDef: row.spDef, 
                speed: row.speed
            },
            legendary: row.legendary[0] === 1, 
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

app.get(`/pokemon/knownAttacks/:id`, (req, res) => {
    const id = req.params.id;
    const sql = `
    SELECT a.aID, a.attack_name, type, category, power, accuracy, PP, effect
    FROM Attacks a, CurrentAttacks c
    WHERE instanceID=${id} AND a.aID=c.aID;
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
        }));
        return res.json(formatted);
    });
});

app.get('/user/:id', (req, res) => {
    const uID = req.params.id;
    const sql = `
        SELECT uID, name, tradeCount, username
        FROM User WHERE uID=${uID};
    `
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching user's data", err);
            return res.status(500).json({error: "Database error"});
        }
        const formatted = results.map((row) => ({
            id: row.uID,
            displayName: row.name,
            tradeCount: row.tradeCount,
            username: row.username,
        }));
        return res.json(formatted[0]);
    });
});

app.get('/userPokemon', (req, res) => {
  const uID = 4; // Replace with actual user ID from session or authentication

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
      mp.level,
      mp.nickname,
      mp.showcase,
      mp.onteam
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
      level: row.level,
      nickname: row.nickname,
      showcase: row.showcase[0]===1,
      onTeam: row.onteam[0]===1
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

app.post("/setShowcased", async(req,res) => {
    const {instanceIDs, user} = req.body;
    console.log("Incoming request to /setShowcased pokemon instance:", req.body);

    try {
    const dbPromise = await mysqlPromise.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await dbPromise.query(
        `UPDATE MyPokemon
         SET showcase=1
         WHERE instanceID IN (${instanceIDs.toString()}) AND uID=${user};`
    );
    await dbPromise.query(
        `UPDATE MyPokemon
         SET showcase=0
         WHERE instanceID NOT IN (${instanceIDs.toString()}) AND uID=${user};`
    )

    console.log("Marking successful.");
    await dbPromise.end();
    res.send("Pokémon updated successfully.");
  } catch (err) {
    console.error("Error marking Pokémon:", err);
    res.status(500).send("Server error marking Pokémon.");
  }
});

app.post("/setFavourite", async(req,res) => {
    const {instanceID, user, value} = req.body;
    console.log("Incoming request to /setFavourite pokemon instance:", req.body);

    try {
    const dbPromise = await mysqlPromise.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await dbPromise.query(
        `UPDATE MyPokemon
         SET favourite=${value}
         WHERE instanceID = ${instanceID} AND uID=${user};`
    );

    console.log("Marking successful.");
    await dbPromise.end();
    res.send("Pokémon updated successfully.");
  } catch (err) {
    console.error("Error marking Pokémon:", err);
    res.status(500).send("Server error marking Pokémon.");
  }
});

app.post("/setTeam", async(req,res) => {
    const {instanceIDs, user} = req.body;
    console.log("Incoming request to /setTeam pokemon instance:", req.body);

    try {
    const dbPromise = await mysqlPromise.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await dbPromise.query(
        `UPDATE MyPokemon
         SET onteam=1
         WHERE instanceID IN (${instanceIDs.toString()}) AND uID=${user};`
    );
    await dbPromise.query(
        `UPDATE MyPokemon
         SET onteam=0
         WHERE instanceID NOT IN (${instanceIDs.toString()}) AND uID=${user};`
    )

    console.log("Marking successful.");
    await dbPromise.end();
    res.send("Pokémon updated successfully.");
  } catch (err) {
    console.error("Error marking Pokémon:", err);
    res.status(500).send("Server error marking Pokémon.");
  }
});

app.post("/updateUserDisplayName", async(req,res) => {
    const {uID, name} = req.body;
    console.log("Incoming request to update name to:", name);

    try {
        const dbPromise = await mysqlPromise.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
        });

        await dbPromise.query(
            `UPDATE User
            SET name='${name}'
            WHERE uID=${uID};`
        )
        console.log("Update successful");
        await dbPromise.end();
        res.send("User's name updated successfully.");
    } catch (err) {
    console.error("Error marking Pokémon:", err);
    res.status(500).send("Server error marking Pokémon.");
  }
})

app.listen(8081, ()=> {
    console.log("listening on port 8081");
    console.log("View output at http://localhost:8081");
})
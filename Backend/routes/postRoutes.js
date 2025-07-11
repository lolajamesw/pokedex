const mysqlPromise = require('mysql2/promise');

module.exports = (app, db) => {
    
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

    app.post("/unlearnMove", async (req, res) => {
        const { instanceID, aID } = req.body;

        console.log("Incoming request to /unlearnMove with:", req.body);

        try {
            const dbPromise = await mysqlPromise.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
            });

            await dbPromise.query(
            `DELETE FROM CurrentAttacks WHERE instanceID = ${instanceID} AND aID = ${aID};`
            );

            console.log("Delete successful.");
            await dbPromise.end();
            res.send("Pokémon moveset decreased successfully.");
        } catch (err) {
            console.error("Error decreasing Pokémon moveset:", err);
            res.status(500).send("Server error updating Pokémon moveset.");
        }
    });

    app.post("/learnMove", async (req, res) => {
        const { instanceID, aID } = req.body;

        console.log("Incoming request to /unlearnMove with:", req.body);

        try {
            const dbPromise = await mysqlPromise.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
            });

            await dbPromise.query(
            `INSERT INTO CurrentAttacks (instanceID, aID) VALUES 
            (${instanceID}, ${aID});`
            );

            console.log("Insert successful.");
            await dbPromise.end();
            res.send("Pokémon moveset increased successfully.");
        } catch (err) {
            console.error("Error increasing Pokémon moveset:", err);
            res.status(500).send("Server error updating Pokémon moveset.");
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

        if (instanceIDs.length>0) {
            await dbPromise.query(
                `UPDATE MyPokemon
                SET onteam=0
                WHERE instanceID NOT IN (${instanceIDs.toString()}) AND uID=${user};`
            );
            await dbPromise.query(
                `UPDATE MyPokemon
                SET onteam=1
                WHERE instanceID IN (${instanceIDs.toString()}) AND uID=${user};`
            );
        }
        else {
            await dbPromise.query(
                `UPDATE MyPokemon
                SET onteam=0
                WHERE uID=${user};`
            );
        }

        

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
    }})

}

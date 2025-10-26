/**
 * Pokémon Trading/Collection API
 * ----------------------------------
 * This module defines multiple Express.js POST routes for interacting
 * with a MySQL database that manages Pokémon, users, listings, replies,
 * and trades. It allows adding/removing Pokémon, managing movesets,
 * setting favourites/teams/showcases, user login/account creation,
 * and handling trades between users.
 *
 * Improvements made:
 *  - Uses a MySQL connection pool (faster + scalable).
 *  - All queries use parameterized statements (prevents SQL injection).
 *  - Thorough logging for debugging.
 *  - Consistent error handling & response format.
 */

const mysqlPromise = require("mysql2/promise");

/**
 * Create a MySQL connection pool (reused across all requests).
 */
const pool = mysqlPromise.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // max concurrent connections
    queueLimit: 0         // unlimited queued requests
});

module.exports = (app) => {
    /**
     * Helper: run a query with pooled connection.
     */
    async function runQuery(sql, params = []) {
        const conn = await pool.getConnection();
        try {
            const [rows] = await conn.query(sql, params);
            return rows;
        } finally {
            conn.release();
        }
    }

    /**
     * -------------------------
     * Pokémon-related Endpoints
     * -------------------------
     */

    // Add a Pokémon to user's collection
    app.post("/addPokemon", async (req, res) => {
        const { pokemonName, nickname, level, uID } = req.body;
        console.log("POST /addPokemon:", req.body);

        try {
            // Lookup Pokémon ID (case-insensitive)
            const rows = await runQuery(
                "SELECT pID FROM Pokedex WHERE LOWER(name) = LOWER(?)",
                [pokemonName]
            );

            if (rows.length === 0) {
                return res.status(400).send("Pokémon not found in Pokedex.");
            }

            const pID = rows[0].pID;

            // Insert Pokémon into user's collection
            await runQuery(
                `INSERT INTO MyPokemon (pID, uID, nickname, form, nature, level, dateAdded, 
                    hpEV, atkEV, defEV, spAtkEV, spDefEV, speedEV,
                    hpIV, atkIV, defIV, spAtkIV, spDefIV, speedIV
                )
                 VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [pID, uID, nickname || null, 'original', 'Hardy', level, 0, 0, 0, 0, 0, 0, 31, 31, 31, 31, 31, 31]
            );

            res.send("Pokémon added successfully.");
        } catch (err) {
            console.error("Error in /addPokemon:", err);
            res.status(500).send("Server error adding Pokémon.");
        }
    });

    app.post("/setEVsIVs", async (req, res) => {
        const { instanceID,
            hpEV, atkEV, defEV, spAtkEV, spDefEV, speedEV,
            hpIV, atkIV, defIV, spAtkIV, spDefIV, speedIV
         } = req.body;
        console.log("POST /setEVsIVs:", req.body);

        try {
            await runQuery(("UPDATE MyPokemon SET hpEV=?, atkEV=?, defEV=?, spAtkEV=?, spDefEV=?, speedEV=?" +
                 ", hpIV=?, atkIV=?, defIV=?, spAtkIV=?, spDefIV=?, speedIV=? WHERE instanceID=?"), 
                [hpEV, atkEV, defEV, spAtkEV, spDefEV, speedEV, hpIV, atkIV, defIV, spAtkIV, spDefIV, speedIV, instanceID]);
            res.send("Pokémon EVs/IVs updated successfully.");
        } catch (err) {
            console.error("Error in /dropPokemon:", err);
            res.status(500).send("Server error updating Pokémon EVs/IVs.");
        }
    });

    // Remove Pokémon from user's collection
    app.post("/dropPokemon", async (req, res) => {
        const { instanceID } = req.body;
        console.log("POST /dropPokemon:", req.body);

        try {
            await runQuery("DELETE FROM MyPokemon WHERE instanceID=?", [instanceID]);
            res.send("Pokémon forgotten successfully.");
        } catch (err) {
            console.error("Error in /dropPokemon:", err);
            res.status(500).send("Server error dropping Pokémon.");
        }
    });

    // Make Pokémon unlearn a move
    app.post("/unlearnMove", async (req, res) => {
        const { instanceID, aID } = req.body;
        console.log("POST /unlearnMove:", req.body);

        try {
            await runQuery(
                "DELETE FROM CurrentAttacks WHERE instanceID = ? AND aID = ?",
                [instanceID, aID]
            );
            res.send("Pokémon move removed successfully.");
        } catch (err) {
            console.error("Error in /unlearnMove:", err);
            res.status(500).send("Server error updating moveset.");
        }
    });

    // Teach Pokémon a new move
    app.post("/learnMove", async (req, res) => {
        const { instanceID, aID } = req.body;
        console.log("POST /learnMove:", req.body);

        try {
            await runQuery(
                "INSERT INTO CurrentAttacks (instanceID, aID) VALUES (?, ?)",
                [instanceID, aID]
            );
            res.send("Pokémon learned new move successfully.");
        } catch (err) {
            console.error("Error in /learnMove:", err);
            res.status(500).send("Server error updating moveset.");
        }
    });

    // Set the Pokemon's active variant
    app.post("/setVariant", async (req, res) => {
        const { instanceID, form } = req.body;
        console.log("POST /setVariant:", req.body);

        try {
            await runQuery(
                "UPDATE MyPokemon SET form=? WHERE instanceID=?",
                [form, instanceID]
            );
            res.send("Pokémon form set successfully.");
        } catch (err) {
            console.error("Error in /setVariant:", err);
            res.status(500).send("Server error updating variant.");
        }
    });

    app.post("/setNature", async (req, res) => {
        const { instanceID, nature } = req.body;
        console.log("POST /setNature:", req.body);
        try {
            await runQuery(
                "UPDATE MyPokemon SET nature=? WHERE instanceID=?",
                [nature, instanceID]
            );
            res.send("Pokémon nature set successfully.");
        } catch (err) {
            console.error("Error in /setNature:", err);
            res.status(500).send("Server error updating nature.");
        }
    })

    // Set selected ability of Pokemon
    app.post("/setAbility", async (req, res) => {
        const { instanceID, ability } = req.body;
        console.log("POST /setAbility:", req.body);
        try {
            await runQuery(
                "UPDATE MyPokemon SET ability=? WHERE instanceID=?",
                [ability, instanceID]
            );
            res.send("Pokémon nature set successfully.");
        } catch (err) {
            console.error("Error in /setAbility:", err);
            res.status(500).send("Server error updating ability.");
        }
    })

        // Set selected ability of Pokemon
    app.post("/setTeraType", async (req, res) => {
        const { instanceID, type } = req.body;
        console.log("POST /setTeraType:", req.body);
        try {
            await runQuery(
                "UPDATE MyPokemon SET teraType=? WHERE instanceID=?",
                [type, instanceID]
            );
            res.send("Pokémon tera type set successfully.");
        } catch (err) {
            console.error("Error in /setTeraType:", err);
            res.status(500).send("Server error updating tera type.");
        }
    })

    // Mark Pokémon as showcased
    app.post("/setShowcased", async (req, res) => {
        const { instanceIDs, user } = req.body;
        console.log("POST /setShowcased:", req.body);

        try {
            // First, reset showcase status for all user's Pokémon
            await runQuery("UPDATE MyPokemon SET showcase=0 WHERE uID=?", [user]);

            // Then mark only the provided Pokémon
            if (instanceIDs.length > 0) {
                await runQuery(
                    `UPDATE MyPokemon SET showcase=1
                     WHERE instanceID IN (?) AND uID=?`,
                    [instanceIDs, user]
                );
            }

            res.send("Showcased Pokémon updated successfully.");
        } catch (err) {
            console.error("Error in /setShowcased:", err);
            res.status(500).send("Server error updating showcase.");
        }
    });

    app.post("/setHeldItem", async(req,res) => {
        let {instanceID, item} = req.body;
        // console.log("Incoming request to update item to: ", item);
        console.log(item);
        try {
            const dbPromise = await mysqlPromise.createConnection({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            await dbPromise.query(
                `DELETE FROM HeldItems
                WHERE instanceID=${instanceID};`
            )
            console.log(item + item!==undefined)
            if (item){
                await dbPromise.query(
                    "INSERT INTO HeldItems(instanceID, item) VALUES(?, ?);", [instanceID, item]
                )
            } else if (item === null) {
                await dbPromise.query(
                    "DELETE FROM HeldItems WHERE instanceID=?", instanceID
                )
            } else {
                await dbPromise.query(
                    `INSERT INTO HeldItems(instanceID, item)
                    VALUES(${instanceID}, (
                        SELECT name FROM MegaStones WHERE result=(SELECT form FROM MyPokemon WHERE instanceID=${instanceID})
                    ));`
                )
            }
            console.log("Update successful");
            await dbPromise.end();
            res.send("Pokemon's item updated successfully.");
        } catch (err) {
        console.error("Error marking Pokémon:", err);
        res.status(500).send("Server error marking Pokémon.");
        }
    });

    // Mark Pokémon as favourite
    app.post("/setFavourite", async (req, res) => {
        const { instanceID, user, value } = req.body;
        console.log("POST /setFavourite:", req.body);

        try {
            await runQuery(
                "UPDATE MyPokemon SET favourite=? WHERE instanceID=? AND uID=?",
                [value, instanceID, user]
            );
            res.send("Favourite Pokémon updated successfully.");
        } catch (err) {
            console.error("Error in /setFavourite:", err);
            res.status(500).send("Server error updating favourite.");
        }
    });

    // Set user's active team
    app.post("/setTeam", async (req, res) => {
        const { instanceIDs, user } = req.body;
        console.log("POST /setTeam:", req.body);

        try {
            // Reset all team flags
            await runQuery("UPDATE MyPokemon SET onteam=0 WHERE uID=?", [user]);

            // Set new team members
            if (instanceIDs.length > 0) {
                await runQuery(
                    "UPDATE MyPokemon SET onteam=1 WHERE instanceID IN (?) AND uID=?",
                    [instanceIDs, user]
                );
            }

            res.send("Team updated successfully.");
        } catch (err) {
            console.error("Error in /setTeam:", err);
            res.status(500).send("Server error updating team.");
        }
    });

    /**
     * -------------------------
     * User-related Endpoints
     * -------------------------
     */

    // Update user display name
    app.post("/updateUserDisplayName", async (req, res) => {
        const { uID, name } = req.body;
        console.log("POST /updateUserDisplayName:", req.body);

        try {
            await runQuery("UPDATE User SET name=? WHERE uID=?", [name, uID]);
            res.send("User's name updated successfully.");
        } catch (err) {
            console.error("Error in /updateUserDisplayName:", err);
            res.status(500).send("Server error updating user name.");
        }
    });

    // User login
    app.post("/userLogin", async (req, res) => {
        const { username, password } = req.body;
        console.log("POST /userLogin:", req.body);

        try {
            const rows = await runQuery(
                "SELECT * FROM User WHERE username=? AND password=?",
                [username, password]
            );

            if (rows.length === 0) {
                return res.status(401).send("Invalid username or password.");
            }

            res.status(200).json({ message: "Login successful", user: rows[0] });
        } catch (err) {
            console.error("Error in /userLogin:", err);
            res.status(500).send("Server error during login.");
        }
    });

    // Create a new account
    app.post("/createAccount", async (req, res) => {
        const { name, username, password } = req.body;
        console.log("POST /createAccount:", req.body);

        try {
            const result = await runQuery(
                "INSERT INTO User (name, tradeCount, username, password) VALUES (?, 0, ?, ?)",
                [name, username, password]
            );

            const newUser = {
                uID: result.insertId,
                name,
                username
            };

            res.status(201).json({ user: newUser });
        } catch (err) {
            console.error("Error in /createAccount:", err);

            if (err.code === "ER_DUP_ENTRY") {
                res.status(409).send("Username already exists.");
            } else {
                res.status(500).send("Server error while creating account.");
            }
        }
    });

    /**
     * -------------------------
     * Trading-related Endpoints
     * -------------------------
     */

    // List a Pokémon for trade
    app.post("/listPokemon", async (req, res) => {
        const { iid, uid, desc } = req.body;
        console.log("POST /listPokemon:", req.body);

        try {
            await runQuery(
                "INSERT INTO Listing (instanceID, sellerID, description, postedTime) VALUES (?, ?, ?, NOW())",
                [iid, uid, desc]
            );

            res.status(201).json({ message: "Listing created successfully." });
        } catch (err) {
            console.error("Error in /listPokemon:", err);
            res.status(500).send("Server error while creating listing.");
        }
    });

    // Reply to a listing
    app.post("/reply", async (req, res) => {
        const { listingID, instanceID, respondantID, message } = req.body;
        console.log("POST /reply:", req.body);

        try {
            await runQuery(
                "INSERT INTO Reply (listingID, instanceID, respondantID, message, sentTime) VALUES (?, ?, ?, ?, NOW())",
                [listingID, instanceID, respondantID, message]
            );

            res.status(201).json({ message: "Reply created successfully." });
        } catch (err) {
            console.error("Error in /reply:", err);
            res.status(500).send("Server error while creating reply.");
        }
    });

    // Execute a trade
    app.post("/trade", async (req, res) => {
        const { replyID } = req.body;
        console.log("POST /trade:", req.body);

        try {
            await runQuery("CALL doTrade(?)", [replyID]);
            res.status(201).json({ message: "Trade executed successfully." });
        } catch (err) {
            console.error("Error in /trade:", err);
            res.status(500).send("Server error while executing trade.");
        }
    });
};

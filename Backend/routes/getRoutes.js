/*
 * backend_routes_documented.js
 *
 * Thoroughly commented version of the provided Express route file.
 * - Purpose: document what each route does, what inputs it expects, what it returns,
 *   and point out bugs, inconsistencies, and security/performance suggestions.
 * - Notes:
 *   1. This file preserves the original structure and SQL, but adds explanations
 *      and TODOs where fixes are recommended.
 *   2. **Security:** Many routes build SQL using string interpolation (``${...}``) —
 *      this creates SQL injection risk. Prefer parameterized queries or prepared
 *      statements (use `?` placeholders with `db.query(sql, params, cb)` or use
 *      prepared statements from `mysql2`).
 *   3. **DB object:** The module expects `db` to be a `mysql2` connection or pool
 *      object which implements `db.query(sql, params?, cb)`.
 *   4. **Return shapes:** Each route documents the JSON shape it returns.
 *
 * Improvements recommended (summary):
 *  - Always use parameterized queries instead of direct string interpolation.
 *  - Use a connection pool (mysql2.createPool) instead of creating connections per request.
 *  - Centralize error handling and return consistent HTTP statuses and JSON error shapes.
 *  - Validate and sanitize all user input (req.params, req.query) with a library like express-validator.
 *  - Consider extracting repeated logic (formatting results) into helper functions to reduce duplication.
 *  - Replace ad-hoc boolean checks like `row.legendary[0] === 1` with explicit coercion
 *    (e.g. `Boolean(Number(row.legendary))` or `!!row.legendary`). Some drivers return Buffer for tinyint.
 */

const mysqlPromise = require('mysql2/promise');

/**
 * Exported function that registers routes on an Express `app`.
 * @param {import('express').Express} app - Express application instance
 * @param {object} db - MySQL connection or pool with `query(sql, params?, cb)`
 */
module.exports = (app, db) => {

    /**
     * GET /
     * Simple health-check / base route.
     * Response: JSON string "Backend"
     */
    app.get('/', (re, res)=> {
        return res.json("Backend");
    })

    /**
     * GET /group_members
     * Returns all rows from `group_members` table.
     * Response: array of group_member objects (exact fields depend on DB schema)
     * Security: uses a trivial SELECT — still consider limiting or pagination for large tables.
     */
    app.get('/group_members', (req, res)=> {
        const sql = "SELECT * FROM group_members";
        db.query(sql, (err, data)=> {
            if (err) return res.json(err);
            return res.json(data);
        })
    })

    /**
     * GET /pokemon?uID=123
     * Returns a list of pokedex entries with an additional `caught` boolean indicating
     * whether the user (uID) owns that Pokemon.
     * Query params:
     *  - uID (number, required): user id to check against MyPokemon table
     * Response: [ { id, number, name, types: [], stats: {}, caught: boolean }, ... ]
     *
     * SECURITY ISSUE: the SQL string uses `${uid}` interpolation inside the query but
     * also passes `[uid]` to db.query. The `${uid}` interpolation injects the value
     * directly into the SQL and defeats parameterization; this is a SQL injection risk.
     * RECOMMENDATION: rewrite the query to use a `?` placeholder for the uID.
     */
    app.get('/pokemon', (req, res) => {
        const uid = req.query.uID;

    const sql = `
        SELECT 
        p.pID AS id,
        p.name,
        p.type1,
        p.type2,
        p.hp,
        p.atk,
        p.def,
        p.spAtk,
        p.spDef,
        p.speed,
        p.img_suffix,
        EXISTS (
            SELECT 1 
            FROM MyPokemon mp 
            WHERE mp.pID = p.pID AND mp.uID = ${uid}
        ) AS caught
        FROM Pokedex p
    `;

        db.query(sql, [uid], (err, results) => {
            if (err) {
                console.error("Error fetching Pokémon data:", err);
                return res.status(500).json({ error: "Database error" });
            }

            // Format DB rows into API shape
            const formatted = results.map((row) => ({
                pID: row.id,
                number: row.id,
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
                imgID: row.id.toString().padStart(3, '0'),
                // Ensure boolean (some MySQL drivers return Buffer or numeric for EXISTS)
                caught: !!row.caught
            }));

            res.json(formatted);
        });
    });

    /**
     * GET /pokemonNames
     * Returns an alphabetically sorted list of Pokémon names.
     * Response: [ "Bulbasaur", "Charmander", ... ]
     */
    app.get('/pokemonNames', (req, res) => {
        const sql = `SELECT name FROM Pokedex ORDER BY name`;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching Pokémon names:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const formatted = results.map((row) => row.name);
            res.json(formatted);
        });
    });

    app.get('/types', (req, res)=> {
        const sql = "SELECT * FROM Types";
        db.query(sql, (err, data)=> {
            if (err) return res.json(err);
            return res.json(data);
        })
    })

    app.get('/teraType/:id', (req, res)=> {
        const id = req.params.id;
        const sql = `SELECT teraType FROM MyPokemon WHERE instanceID=${id}`;
        db.query(sql, (err, data)=> {
            if (err) return res.json(err);
            return res.json(data[0]);
        })
    })
    
    /**
     * GET /pokemon/items/:pID
     * Returns a list of items a pokemon can hold.
     * Response: [ {name, effect, description, icon, variant?}, ... ]
     */
    app.get('/pokemon/items/:pID', (req, res) => {
    const pID = req.params.pID;
    const sql = `(SELECT name, effect, description, icon, null AS variant FROM Items WHERE type!='mega-stones')
    UNION (SELECT i.name, effect, description, icon, result AS Variant FROM Items i, MegaStones m WHERE type='mega-stones' AND pID=${pID} AND i.name=m.name)
    ORDER BY name;`;

    db.query(sql, (err, results) => {
        if (err) {
        console.error("Error fetching Pokémon names:", err);
        return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
    });

    /**
     * GET /pokemon/items/:pID
     * Returns a list of items a pokemon can hold.
     * Response: [ {name, effect, description, icon, variant?}, ... ]
     */
    app.get('/EVsIVs/:instanceID', (req, res) => {
    const instanceID = req.params.instanceID;
    const sql = `SELECT hpEV, atkEV, defEV, spAtkEV, spDefEV, speedEV, hpIV, atkIV, defIV, spAtkIV, spDefIV, speedIV
    FROM MyPokemon WHERE instanceID=${instanceID}`;

    db.query(sql, (err, results) => {
        if (err) {
        console.error("Error fetching Pokémon EVs / IVs:", err);
        return res.status(500).json({ error: "Database error" });
        }
        res.json(results[0]);
    });
    });

    /**
     * GET /pokemon/:id
     * URL params:
     *  - id (number): pID to fetch from Pokedex
     * Response: { id, name, types: [], stats: {}, legendary: boolean, description }
     * NOTE: SQL uses template interpolation: `WHERE pID=${pID}` -> SQL injection risk.
     * Also the code reads `row.legendary[0] === 1` which assumes the driver returns
     * legendary as a Buffer/array. Prefer explicit coercion.
     */
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
                pID: row.pID,
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
                // Safer: coerce numeric/Buffer to boolean
                legendary: row.legendary[0] === 1,
                description: row.description,
                imgID: row.pID.toString().padStart(3, '0')
            }))
            return res.json(formatted[0]);
        });
    });

    /**
     * GET /userPokemon/:id
     * URL params:
     *  - id (number): instanceID from MyPokemon
     * Response: single object { id, pID, name, nickname, level, favourite, onTeam, types, stats, legendary, description }
     * NOTE: `favourite` and `onteam` are read with `[0] === 1` pattern which should be made explicit.
     */
    app.get(`/userPokemon/:id`, (req, res) => {
        const id = req.params.id;

        const sql = `
            SELECT mp.instanceID,
            mp.pID,
            mp.form,
            mp.nature,
            mp.ability,
            p.name,
            nickname,
            level,
            favourite,
            onteam,
            type1,
            type2,
            hp, atk, def, spAtk, spDef, speed,
            legendary, 
            p.description, 
            mi.item, mi.icon
            FROM Pokedex p
            RIGHT JOIN MyPokemon mp ON p.pID=mp.pID
            LEFT JOIN (
                SELECT h.item, i.icon, h.instanceID
                FROM Items i, HeldItems h
                WHERE h.instanceID=${id} AND i.name=h.item
            ) as mi ON mi.instanceID=mp.instanceID
            WHERE mp.instanceID=${id}
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
                form: row.form,
                nickname: row.nickname,
                level: row.level,
                nature: row.nature,
                ability: row.ability,
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
                description: row.description,
                heldItem: row.item,
                heldItemIcon: row.icon,
                imgID: row.pID.toString().padStart(3, '0')
            }))
            return res.json(formatted[0]);
        });
    });

    /**
     * GET /pokemon/attacks/:id
     * Returns all attacks learnable by the given pID.
     * NOTE: The SQL selects `type, category` but the mapping mistakenly assigns them
     * swapped (type: row.category, category: row.type). Check database column meanings
     * and correct mapping. Also `tm` probably indicates a boolean (TM-compatible) but
     * is mapped as `row.tm[0] === 1` in other places — be consistent.
     */
    app.get(`/pokemon/attacks/:id`, (req, res) => {
        const pID = req.params.id;
        const sql = `
            SELECT a.aID, a.attack_name, type, category, power, accuracy, PP, effect, tm
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
                // NOTE: these two fields are probably reversed below — double-check your columns
                type: row.category,
                category: row.type,
                stats: {
                    power: row.power,
                    accuracy: row.accuracy,
                    pp: row.PP
                },
                effect: row.effect,
                TM: row.tm[0]===1
            }))
            return res.json(formatted);
        });
    });

    /**
     * GET /pokemon/knownAttacks/:id
     * Returns attacks currently known by the instanceID.
     * Very similar to /pokemon/attacks, with same mapping caveat.
     */
    app.get(`/pokemon/knownAttacks/:id`, (req, res) => {
        const id = req.params.id;
        const sql = `
            SELECT a.aID, a.attack_name, type, category, power, accuracy, PP, effect, tm
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
                type: row.category,
                category: row.type,
                stats: {
                    power: row.power,
                    accuracy: row.accuracy,
                    pp: row.PP
                },
                effect: row.effect,
                TM: row.tm[0]===1
            }))
            return res.json(formatted);
        });
    });
    
    /**
     * GET /pokemon/abilities/:pID/:variant
     * Returns all abilities associated with the given pID and variant (default 'original').
     */
    app.get(`/pokemon/abilities/:pID/:variant`, (req, res) => {
        const pID = req.params.pID;
        const variant = req.params.variant;
        const sql = `
            with aNames as (
                SELECT DISTINCT(ability) FROM PokemonAbilities
                WHERE pID=${pID} AND (variant=${variant} || variant='original')
            )
            SELECT a.name, a.effect, a.description
            FROM aNames n JOIN Abilities a ON n.ability=a.name;
        `
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching pokemon's data", err);
                return res.status(500).json({error: "Database error"});
            }
            return res.json(results);
        });
    });

    app.get('/pokemon/variants/:id', (req, res) => {
        const pID = req.params.id;
        const sql = `
        SELECT pID, name, form, type1, type2, hp, atk, def, spAtk, spDef, speed, mega, description, img_suffix
        FROM PokemonVariants WHERE pID=${pID};
        `
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching pokemon's data", err);
                return res.status(500).json({error: "Database error"});
            }

            const formatted = results.map((row) => ({
                pID: row.pID,
                name: row.name,
                form: row.form,
                types: row.type2 ? [row.type1, row.type2] : [row.type1],
                stats: {
                    hp: row.hp,
                    atk: row.atk, 
                    def: row.def, 
                    spAtk: row.spAtk, 
                    spDef: row.spDef, 
                    speed: row.speed
                },
                mega: row.mega[0] === 1, 
                description: row.description,
                imgID: row.img_suffix// `${row.pID.toString().padStart(3, "0")}_${row.img_suffix}`
            }))
            return res.json(formatted);
        });
    })

    /**
     * GET /pokemon/evolutions/:id
     * Returns evolution chains (double and triple evolutions) that contain the given pID.
     * Response: [ { base: {...}, stage1: {...}, stage2: {...} }, ... ]
     * Notes: This query builds `tripleEvo` and `doubleEvo` unions. Results use a placeholder
     * image path for now.
     */
    app.get(`/pokemon/evolutions/:id`, (req, res) => {
        const pID = req.params.id;
        const sql = `
            WITH tripleEvo AS (
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
                FROM evolutions e1, evolutions e2, Pokedex p1, Pokedex p2, Pokedex p3
                WHERE e1.evolvesInto = e2.evolvesFrom AND p1.pID=e1.evolvesFrom
                  AND p2.pID=e1.evolvesInto AND p3.pID=e2.evolvesInto
            ),
                 doubleEvo AS (
                     SELECT
                         p1.pID as pID1
                          , p1.name as name1
                          , p1.type1 as type11
                          , p1.type2 as type21
                          , p2.pID as pID2
                          , p2.name as name2
                          , p2.type1 as type12
                          , p2.type2 as type22
                          , NULL as pID3
                          , NULL as name3
                          , NULL as type13
                          , NULL as type23
                     FROM evolutions, Pokedex p1, Pokedex p2
                     WHERE p1.pID=evolvesFrom AND p2.pID=evolvesInto AND NOT EXISTS (
                         SELECT * FROM tripleEvo
                         WHERE (evolvesFrom = pID1 AND evolvesInto = pID2)
                            OR (evolvesFrom = pID2 AND evolvesInto = pID3)
                     )
                 )
            SELECT *
            FROM (SELECT * FROM tripleEvo UNION SELECT * FROM doubleEvo) as evo
            WHERE (pID1 = ${pID} OR pID2 = ${pID} OR pID3 = ${pID});
        `;

        const placeholderImg = "/placeholder.png";
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching pokemon's data", err);
                return res.status(500).json({error: "Database error"});
            }

            const formatted = results.map((row) => ({
                base: {
                    pID: row.pID1,
                    name: row.name1,
                    types: row.type21 ? [row.type11, row.type21] : [row.type11],
                    imgID: row.pID1.toString().padStart(3, '0'),
                },
                stage1: {
                    pID: row.pID2,
                    name: row.name2,
                    types: row.type22 ? [row.type12, row.type22] : [row.type12],
                    imgID: row.pID2.toString().padStart(3, '0'),
                },
                stage2: {
                    pID: row.pID3,
                    name: row.name3,
                    types: row.type23 ? [row.type13, row.type23] : [row.type13],
                    imgID: row.pID3?.toString().padStart(3, '0'),
                }
            }));
            return res.json(formatted);
        });
    });

    /**
     * GET /user/:id
     * Returns a simple user object for the given uID.
     * Response: { id, displayName, tradeCount, username }
     */
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

    /**
     * GET /teamSummary/:id
     * Returns attack/defense averages per type for the user's team.
     * WARNING: the SQL below hardcodes `uID=95` in many places. That is almost certainly
     * a bug. It should use the `uID` from the route param (e.g. via a `?` placeholder).
     * The SQL is fairly complex and may be slow; consider precomputing or simplifying.
     */
    app.get('/teamSummary/:id', (req,res) => {
        const uID = req.params.id;
        const sql = `
            WITH FX as (
                SELECT type1, type2, (
                    CASE
                        WHEN double_strength=1 THEN 2
                        WHEN half_strength=1 THEN 0.5
                        ELSE 0
                        END
                    ) as effect FROM TypeFX
            ), full as (
                SELECT * FROM FX
                UNION
                SELECT t1.type as type1, t2.type as type2, 1 as effect
                FROM Types t1, Types t2
                WHERE t1.type!=t2.type AND t2.type NOT IN (
                SELECT type2 FROM typeFX t WHERE t.type1=t1.type
                )
                ), crossed1 as (
            SELECT t1.type1 typeA, t2.type1 typeB, t1.type2,
                (t1.effect*t2.effect) as effect
            FROM full t1, full t2 WHERE t1.type1!=t2.type1 AND t1.type2=t2.type2
                ), crossed2 as (
            SELECT t1.type1, t1.type2 as typeA, t2.type2 as typeB,
                (t1.effect*t2.effect) as effect
            FROM full t1, full t2 WHERE t1.type1=t2.type1 AND t1.type2!=t2.type2
                )

            SELECT atk.type, atkSum, defSum FROM (
            SELECT type, SUM(effect)/(SELECT COUNT(*) FROM MyPokemon WHERE uID=${uID} AND onteam=1) as defSum FROM (
                SELECT type1 type, effect*(
                    SELECT COUNT(*) from Pokedex p WHERE pID IN (
                        SELECT pID FROM MyPokemon WHERE uID=${uID} AND onteam=1
                    )
                                                        AND p.type1=typeA AND p.type2=typeB
                ) as effect
                FROM crossed2 WHERE typeA IN (
                    SELECT p.type1 from Pokedex p WHERE pID IN (
                        SELECT pID FROM MyPokemon WHERE uID=${uID} AND onteam=1
                    )
                                                    AND p.type2=typeB
                ) UNION ALL
                SELECT type1 type, effect*(
                    SELECT COUNT(*) from Pokedex p WHERE pID IN (
                        SELECT pID FROM MyPokemon WHERE uID=${uID} AND onteam=1
                    )
                                                        AND p.type1=full.type2 AND p.type2=""
                ) as effect FROM full WHERE type2 IN (
                    SELECT p.type1 FROM Pokedex p WHERE pID IN (
                        SELECT pID FROM MyPokemon WHERE uID=${uID} AND onteam=1
                    )AND p.type2="")
            )as subDef GROUP BY type
            ) as def, (SELECT type, SUM(effect)/(SELECT COUNT(*) FROM MyPokemon WHERE uID=${uID} AND onteam=1)
                as atkSum FROM (
                                   SELECT type2 as type, effect*(
                                       SELECT COUNT(*) from Pokedex p WHERE pID IN (
                                           SELECT pID FROM MyPokemon WHERE uID=${uID} AND onteam=1
                                       )
                                                                        AND p.type1=typeA AND p.type2=typeB
                                   ) as effect
                                   FROM crossed1 WHERE typeA IN (
                                       SELECT type1 from Pokedex p WHERE pID IN (
                                           SELECT pID FROM MyPokemon WHERE uID=${uID} AND onteam=1
                                       )
                                                                     AND p.type2=typeB
                                   ) UNION ALL
                                   SELECT type2 type, effect*(
                                       SELECT COUNT(*) from Pokedex p WHERE pID IN (
                                           SELECT pID FROM MyPokemon WHERE uID=${uID} AND onteam=1
                                       )
                                                                        AND p.type1=full.type1 AND p.type2=""
                                   ) as effect FROM full WHERE type1 IN (
                                       SELECT type1 FROM Pokedex p WHERE pID IN (
                                           SELECT pID FROM MyPokemon WHERE uID=${uID} AND onteam=1
                                       )
                                                                     AND p.type2=""
                                   )) as subAtk GROUP BY type
                                                 ) as atk WHERE def.type=atk.type;
        `;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching user's Pokémon data:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const formatted = results.map((row) => ({
                type: row.type,
                atkAvg: parseFloat(row.atkSum),
                defAvg: parseFloat(row.defSum)===0 ? 100 : 1/row.defSum
            }));

            return res.json(formatted);
        });


    });

    /**
     * GET /userPokemon?uID=123
     * Returns all MyPokemon rows for a user, joined to Pokedex for stats.
     * Uses parameterized `?` placeholder so this route is safer than many others above.
     * Response: [ { id, number, name, types, stats, level, nickname, showcase, onTeam } ]
     */
    app.get('/userPokemon', (req, res) => {
        const uID = req.query.uID;
        console.log("Incoming request to /userPokemon with uID:", uID);

        const sql = `
            SELECT
            mp.instanceID AS id,
            p.pID,
            p.name,
            p.type1,
            p.type2,
            p.hp,
            p.atk,
            p.def,
            p.spAtk,
            p.spDef,
            p.speed,
            mp.hpEV,
            mp.atkEV,
            mp.defEV,
            mp.spAtkEV,
            mp.spDefEV,
            mp.speedEV,
            mp.hpIV,
            mp.atkIV,
            mp.defIV,
            mp.spAtkIV,
            mp.spDefIV,
            mp.speedIV,
            v.type1 vtype1,
            v.type2 vtype2,
            v.hp vhp,
            v.atk vatk,
            v.def vdef,
            v.spAtk vspAtk,
            v.spDef vspDef,
            v.speed vspeed,
            mp.level,
            mp.nickname,
            mp.showcase,
            mp.form,
            mp.nature,
            mp.onteam,
            icon,
            v.imgID
            FROM MyPokemon mp
            JOIN Pokedex p ON mp.pID = p.pID
            JOIN (
                SELECT h.instanceID, icon FROM heldItems h, items i, MyPokemon mp2
                WHERE h.instanceID=mp2.instanceID AND h.item=i.name
                UNION
                SELECT instanceID, null as icon FROM MyPokemon mp2 WHERE mp2.instanceID NOT IN (Select instanceID FROM HeldItems)
            ) as ico ON mp.instanceID=ico.instanceID
            LEFT JOIN (
                SELECT name, img_suffix AS imgID, hp, atk, def, spDef, spAtk, speed, type1, type2
                FROM PokemonVariants pv
            ) as v ON v.name=mp.form
            WHERE mp.uID = ?
            ORDER BY pID;
        `;

        db.query(sql, [uID], (err, results) => {
            if (err) {
                console.error("Error fetching user's Pokémon data:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const formatted = results.map((row) => ({
                id: row.id,
                pID: row.pID,
                name: (row.form === 'original' || row.form === null) ? row.name : row.form,
                types: row.vtype1 ? row.vtype2 ? [row.vtype1, row.vtype2] : [row.vtype1] : row.type2 ? [row.type1, row.type2] : [row.type1],
                stats: {
                    hp: row.vhp === null ? row.hp : row.vhp,
                    atk: row.vatk === null ? row.atk : row.vatk,
                    def: row.vdef === null ? row.def : row.vdef,
                    spAtk: row.vspAtk === null ? row.spAtk : row.vspAtk,
                    spDef: row.vspDef === null ? row.spDef : row.vspDef,
                    speed: row.vspeed === null ? row.speed : row.vspeed,
                },
                evs: {
                    hp: row.hpEV,
                    atk: row.atkEV,
                    def: row.defEV,
                    spAtk: row.spAtkEV,
                    spDef: row.spDefEV,
                    speed: row.speedEV
                },
                ivs: {
                    hp: row.hpIV,
                    atk: row.atkIV,
                    def: row.defIV,
                    spAtk: row.spAtkIV,
                    spDef: row.spDefIV,
                    speed: row.speedIV
                },
                level: row.level,
                nature: row.nature,
                nickname: row.nickname,
                showcase: row.showcase[0]===1,
                onTeam: row.onteam[0]===1,
                item: row.icon,
                imgID: row.imgID ?? row.pID.toString().padStart(3, '0')
            }));
            // console.log((formatted));
            return res.json(formatted);
        });
    });

    /**
     * GET /availableListings/:uID
     * Returns listings that are available to a user (not their own and not already traded).
     * Response: [ { id, userId, userName, pokemon: { id, name, type, level, image }, description, replies: [] }, ... ]
     */
    app.get('/availableListings/:uID', (req, res) => {
        const uID = req.params.uID;
        console.log("Incoming request to /availableListings with uID:", uID);

        const sql = `
            SELECT
                l.listingID
                 , u.uID
                 , u.username
                 , p.pID
                 , p.name
                 , type1
                 , type2
                 , level
                 , l.description
                 , COUNT(replyID) as replyCount
            FROM Listing l
                     LEFT JOIN MyPokemon mp ON mp.instanceID=l.instanceID
                     LEFT JOIN Pokedex p ON p.pID=mp.pID
                     LEFT JOIN User u ON u.uID=mp.uID
                     LEFT JOIN Reply r ON l.listingID=r.listingID
            WHERE l.sellerID!=${uID} AND l.listingID NOT IN (SELECT listingID FROM trades)
            GROUP BY l.listingID, u.uID, u.username, p.pID, p.name,
                type1, type2, level, l.description;
        `;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching user's Pokémon data:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const formatted = results.map((row) => ({
                id: row.listingID,
                userId: row.uID,
                userName: row.username,
                pokemon: {
                    id: row.pID,
                    name: row.name,
                    type: row.type2 ? `${row.type1}/${row.type2}` : row.type1,
                    level: row.level,
                    image: `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${row.pID.toString().padStart(3, "0")}.png`
                },
                description: row.description,
                replies: []
            }));

            return res.json(formatted);
        });
    });

    /**
     * GET /myListings/:uID
     * Returns listings owned by the specified user that are not yet traded.
     */
    app.get("/myListings/:uID", (req, res) => {
        const uID = req.params.uID;
        console.log("Incoming request to /myListings with uID:", uID);

        const listingSql = `
            SELECT
                l.listingID
                 , u.uID
                 , u.username
                 , p.pID
                 , p.name
                 , type1
                 , type2
                 , level
                 , l.description
                 , COUNT(replyID) as replyCount
            FROM Listing l
                     LEFT JOIN MyPokemon mp ON mp.instanceID=l.instanceID
                     LEFT JOIN Pokedex p ON p.pID=mp.pID
                     LEFT JOIN User u ON u.uID=mp.uID
                     LEFT JOIN Reply r ON l.listingID=r.listingID
            WHERE u.uID=${uID} AND l.listingID NOT IN (SELECT listingID FROM trades)
            GROUP BY l.listingID, u.uID, u.username, p.pID, p.name,
                     type1, type2, level, l.description;
        `;

        db.query(listingSql, (err, results) => {
            if (err) {
                console.error("Error fetching user's Pokémon data:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const listingFormatted = results.map((row) => ({
                id: row.listingID,
                userId: row.uID,
                userName: row.username,
                pokemon: {
                    id: row.pID,
                    name: row.name,
                    type: row.type2 ? `${row.type1}/${row.type2}` : row.type1,
                    level: row.level,
                    image: `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${row.pID.toString().padStart(3, "0")}.png`
                },
                description: row.description,
                replyCount: row.replyCount
            }));

            return res.json(listingFormatted);
        });
    });

    /**
     * GET /replies/:listingID
     * Returns replies for a given listing with associated pokemon and user info.
     * NOTE: There are inconsistent column name cases (p.pid vs p.pID, u.uid vs u.uID)
     * and the query uses template interpolation for listingID. Those issues can
     * cause bugs or SQL injection vulnerabilities.
     */
    app.get("/replies/:listingID", (req, res) => {
        const listingID = req.params.listingID;
        console.log("Incoming request to /replies with listingID:", listingID);

        const repliesSql = `
            SELECT
                mp.instanceID,
                p.pID,
                p.name AS species,
                p.type1,
                p.type2,
                mp.level,
                mp.nickname,
                mp.uid,
                u.name AS respondantName,
                r.message,
                r.sentTime,
                r.replyID
            FROM listing l, reply r, mypokemon mp, pokedex p, user u
            WHERE l.listingID = ${listingID}
              AND l.listingID = r.listingID
              AND mp.instanceID = r.instanceID
              AND p.pid = mp.pID
              AND u.uid = r.respondantID;
        `;

        db.query(repliesSql, (err, results) => {
            if (err) {
                console.error("Error fetching reply data:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const repliesFormatted = results.map((row) => ({
                id: row.replyID,
                userName: row.respondantName,
                pokemon: {
                    id: row.instanceID,
                    nickname: row.nickname,
                    name: row.species,
                    type: row.type2 ? `${row.type1}/${row.type2}` : row.type1,
                    level: row.level,
                    image: `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${row.pID.toString().padStart(3, "0")}.png`
                },
                message: row.message,
                sentTime: row.sentTime
            }));

            return res.json(repliesFormatted);
        });

    });


    /**
     * GET /availablePokemon/:uID
     * Returns the user's available Pokemon not listed in active listings.
     * NOTE: there may be a logic error in the subquery conditions used to exclude
     * listed Pokemon. Also the image uses `instanceID` as the pID in the URL — that
     * may be incorrect (should probably use pokedex pID instead of instanceID).
     */
    app.get('/availablePokemon/:uID', (req, res) => {
        const uID = req.params.uID;
        console.log("Incoming request to /availablePokemon with uID:", uID);

        const sql = `
            SELECT
                myPokemon.instanceID,
                myPokemon.nickname,
                pokedex.name,
                pokedex.type1,
                pokedex.type2,
                myPokemon.level
            FROM myPokemon JOIN pokedex ON myPokemon.pid = pokedex.pid
            WHERE uid = ${uID} AND myPokemon.instanceID NOT IN (
                SELECT instanceID from listing WHERE listingID NOT IN (
                    SELECT listingID FROM Trades
                ));
        `;

        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching user's available Pokémon:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const formatted = results.map((row) => ({
                id: row.instanceID,
                nickname: row.nickname,
                name: row.name,
                type: row.type2 ? `${row.type1}/${row.type2}` : row.type1,
                level: row.level,
                // POTENTIAL BUG: this uses instanceID to build the Pokedex image URL
                image: `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${row.instanceID.toString().padStart(3, "0")}.png`
            }));

            return res.json(formatted);
        });

    });

    /**
     * GET /opponent/:name/:uID
     * Given an opponent's species name and the current user id, returns recommended counters
     * from the user's MyPokemon based on type effectiveness and level.
     *
     * Flow:
     *  1. Query Pokedex to find the opponent pID.
     *  2. Build and run a large SQL that computes effectiveness across type combos.
     *
     * NOTES and ISSUES:
     *  - The initial call `SELECT pID FROM Pokedex WHERE name='${opPokemon}'` interpolates the name -> SQL injection.
     *  - The mega-query uses tables like TYPES, TypeFX etc; ensure those tables exist and that column casing matches.
     *  - The logic is fairly complex: consider moving to stored procedures or compute in multiple smaller queries.
     */
    app.get("/opponent/:name/:uID", (req, res) => {
        const opPokemon = req.params.name;
        const user_id = req.params.uID;
        console.log("Incoming request to /opponent with pokemon:", opPokemon);
        db.query(`SELECT pID FROM Pokedex WHERE name='${opPokemon}' LIMIT 1`, (err, results) => {
            if (err) {
                console.error("Error fetching Pokémon pID:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const opPID = results[0]?.pID;
            const sql = `
-- ==========================================================
-- Purpose: Find the best Pokémon a user owns to counter an
--          opponent's Pokémon (identified by ${opPID}).
-- 
-- Criteria:
--   1. Uses type effectiveness multipliers (super/half/neutral).
--   2. Considers Pokémon level.
--   3. If multiple Pokémon are equally effective (same multiplier
--      and level), return all of them.
-- ==========================================================

-- ======================================
-- Build type effectiveness lookup table
-- ======================================
WITH FX AS (
    SELECT type1, type2,
        CASE 
            WHEN double_strength = 1 THEN 2      -- Super effective
            WHEN half_strength = 1 THEN 0.5      -- Not very effective
            ELSE 0                               -- Missing (handled later)
        END AS effect
    FROM TypeFX
),

-- Add neutral effectiveness for any missing pairs
full AS (
    SELECT * FROM FX
    UNION
    SELECT t1.type AS type1, t2.type AS type2, 1 AS effect
    FROM Types t1, Types t2
    WHERE NOT EXISTS (
        SELECT 1 FROM TypeFX tf
        WHERE tf.type1 = t1.type AND tf.type2 = t2.type
    )
),

-- ======================================
-- Generate attacker type combinations
-- Each attacker can have:
--   - A single type (atkType1, atkType2 = NULL)
--   - A dual type (ordered to avoid duplicates)
-- ======================================
attacker_types AS (
    SELECT t1.type AS atkType1, NULL AS atkType2 FROM Types t1
    UNION
    SELECT t1.type AS atkType1, t2.type AS atkType2
    FROM Types t1, Types t2
    WHERE t1.type < t2.type  -- ensures no duplication like (Fire, Water) and (Water, Fire)
),

-- Same logic for defender type combinations
defender_types AS (
    SELECT t1.type AS defType1, NULL AS defType2 FROM Types t1
    UNION
    SELECT t1.type AS defType1, t2.type AS defType2
    FROM Types t1, Types t2
    WHERE t1.type < t2.type
),

-- ======================================
-- Combine attacker and defender type pairs
-- Calculate total effectiveness by multiplying
-- all relevant type matchups (up to 2x2 combos).
-- ======================================
all_combos AS (
    SELECT 
        atk.atkType1, atk.atkType2,
        def.defType1, def.defType2,
        COALESCE(f1.effect, 1) * COALESCE(f2.effect, 1) *
        COALESCE(f3.effect, 1) * COALESCE(f4.effect, 1) AS total_effect
    FROM attacker_types atk
    CROSS JOIN defender_types def
    LEFT JOIN full f1 ON f1.type1 = atk.atkType1 AND f1.type2 = def.defType1
    LEFT JOIN full f2 ON f2.type1 = atk.atkType1 AND f2.type2 = def.defType2
    LEFT JOIN full f3 ON f3.type1 = atk.atkType2 AND f3.type2 = def.defType1
    LEFT JOIN full f4 ON f4.type1 = atk.atkType2 AND f4.type2 = def.defType2
),

-- ======================================
-- Find the "best" values:
--   - Highest total effectiveness multiplier
--   - Break ties by Pokémon level
-- ======================================
best_values AS (
    SELECT level, total_effect 
    FROM all_combos, myPokemon mp, pokedex p, user u
    WHERE 
        -- Match Pokémon types with attacker type combos
        (
            (p.type1 = atkType1 AND p.type2 = atkType2) OR 
            (p.type1 = atkType2 AND p.type2 = atkType1) OR 
            (p.type2 NOT IN (SELECT * FROM TYPES) AND atkType2 IS NULL AND p.type1 = atkType1) 
        )
        AND mp.pid = p.pid
        -- Ensure defender combo matches the opponent’s Pokémon types
        AND (
            (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) 
             AND defType2 IN (SELECT type2 FROM pokedex WHERE pid = ${opPID})) OR
            (defType2 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) 
             AND defType1 IN (SELECT type2 FROM pokedex WHERE pid = ${opPID})) OR 
            (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID} AND type2='') 
             AND defType2 IS NULL)
        )
        -- Restrict to the current user’s Pokémon
        AND u.uid = mp.uid 
        AND u.uid = ${user_id}
    ORDER BY total_effect DESC, level DESC, atkType1, atkType2, defType1, defType2
    LIMIT 1
)

-- ======================================
-- Final query:
--   - Return all Pokémon that match the "best" total effectiveness
--   - If multiple share the same score/level, return them all
-- ======================================
SELECT DISTINCT 
    p.pid,                  -- Pokémon ID from the Pokédex
    p.name,                 -- Pokémon name from the Pokédex
    mp.instanceID,          -- Unique instance ID of the user's Pokémon
    mp.level,               -- Current level of the user's Pokémon
    atkType1,               -- Primary attacking type from pre-calculated combos
    atkType2,               -- Secondary attacking type (can be null)
    defType1,               -- Primary defending type of opponent
    defType2,               -- Secondary defending type of opponent (can be null)
    all_combos.total_effect -- Calculated effectiveness score from combo table
FROM 
    all_combos, myPokemon mp, pokedex p, user u, best_values bv
WHERE 
    (
        -- Match attack type combos to the Pokémon’s type combination
        (p.type1 = atkType1 AND p.type2 = atkType2) OR 
        (p.type1 = atkType2 AND p.type2 = atkType1) OR 
        -- Handle single-type Pokémon (no secondary type)
        (p.type2 NOT IN (SELECT * FROM TYPES) AND atkType2 IS NULL AND p.type1 = atkType1) 
    )
    AND mp.pid = p.pid -- Link user's Pokémon to Pokédex entry
    AND (
        -- Check if the defending types align with the opponent Pokémon (opPID)
        (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) 
            AND defType2 IN (SELECT type2 FROM pokedex WHERE pid = ${opPID})) OR
        (defType2 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) 
            AND defType1 IN (SELECT type2 FROM pokedex WHERE pid = ${opPID})) OR 
        -- Handle opponent being single-typed
        (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID} AND type2='') 
            AND defType2 IS NULL)
    )
    AND u.uid = mp.uid                 -- Ensure Pokémon belongs to the logged-in user
    AND u.uid = ${user_id}             -- Filter by specific user ID
    AND all_combos.total_effect = bv.total_effect -- Match best effectiveness value
    AND mp.level = bv.level            -- Match best level values
;
`;

            db.query(sql, (err, results) => {
                if (err) {
                    console.error("Error fetching user's Pokémon data:", err);
                    return res.status(500).json({ error: "Database error" });
                }

                // Format the query results into a clean JSON response
                const formatted = results.map((row) => ({
                    id: row.pid,                                 // Pokédex ID
                    instance: row.instanceID,                    // Instance ID of the user’s Pokémon
                    name: row.name,                              // Pokémon name
                    type1: row.atkType1,                         // Primary attack type
                    type2: row.atkType2,                         // Secondary attack type (if present)
                    level: row.level,                            // Pokémon’s level
                    cp: 0,                                       // Placeholder for CP (not calculated here)
                    effectiveness_score: parseFloat(row.total_effect) * 100, // Effectiveness as a percentage
                    def1: row.defType1,                          // Opponent’s primary defense type
                    def2: row.defType2,                          // Opponent’s secondary defense type
                }));

                return res.json({
                    targetPokemon: opPokemon,
                    targetPID: opPID,
                    counters: formatted,
                });
            });
        });


    });

// ============================================================================
// Route: GET /replyablePokemon/uID=:user&listingID=:lid
// Description: Returns a list of the user's Pokémon that are eligible to reply
// to a given trade listing. This excludes Pokémon that have already been used
// in replies for the specified listing.
// ============================================================================
    app.get('/replyablePokemon/uID=:user&listingID=:lid', (req, res) => {
        const uID = req.params.user;              // Extract user ID from request params
        const listingID = req.params.lid;         // Extract listing ID from request params
        console.log("Incoming request to /replyablePokemon with uID:", uID, "and listingID:", listingID);

        // SQL query to fetch all Pokémon owned by this user that:
        // 1. Exist in the `myPokemon` table joined with their base data in `pokedex`.
        // 2. Are NOT already used in any reply to the specified listing.
        const sql = `
        SELECT 
            myPokemon.instanceID,
            myPokemon.nickname,
            pokedex.name,
            pokedex.type1,
            pokedex.type2,
            myPokemon.level
        FROM myPokemon 
            JOIN pokedex ON myPokemon.pid = pokedex.pid
        WHERE uid = ${uID} 
            AND myPokemon.instanceID NOT IN (
                SELECT instanceID FROM Reply WHERE listingID = ${listingID}
            );
    `;

        // Execute SQL query against the database
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching user's available Pokémon:", err);
                return res.status(500).json({ error: "Database error" });
            }

            // Transform database results into a cleaner, frontend-friendly format
            const formatted = results.map((row) => ({
                id: row.instanceID,
                nickname: row.nickname,
                name: row.name,
                type: row.type2 ? `${row.type1}/${row.type2}` : row.type1, // Combine dual types if applicable
                level: row.level,
                image: `https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${row.instanceID.toString().padStart(3, "0")}.png` // Format with leading zeros
            }));

            return res.json(formatted);
        });
    });


// ============================================================================
// Route: GET /pastTrades/:instanceID
// Description: Returns a history of all trades involving a specific Pokémon
// instance. Includes trade partners, the Pokémon exchanged, and trade metadata.
// ============================================================================
    app.get('/pastTrades/:instanceID', (req, res) => {
        const instanceID = req.params.instanceID;   // Extract Pokémon instance ID
        console.log("Incoming request to /pastTrades with instanceID:", instanceID);

        var username = ""; // Will hold the username of the Pokémon’s owner

        // First, find the username of the owner of this Pokémon instance
        db.query(
            `SELECT username 
         FROM User 
         WHERE uID = (SELECT uID FROM MyPokemon WHERE instanceID=${instanceID})`,
            (err, results) => {
                if (err) {
                    console.error("Error fetching user's data:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                username = results[0].username; // Owner’s username
            }
        );

        // SQL query to gather all trades where this Pokémon was involved,
        // either as the offered Pokémon (fromMP) or the replied Pokémon (toMP).
        const sql = `
        SELECT 
            t.time, 
            fromU.username as fromUser, 
            toU.username as toUser, 
            l.description, 
            CASE 
                WHEN toMP.instanceID=${instanceID} THEN TRUE
                ELSE FALSE
            END as isTo,

            fromP.name as fromName, fromMP.nickname as fromNickname, 
            fromMP.level as fromLevel, fromP.type1 as fromType1, fromP.type2 as fromType2,

            toP.name as toName, toMP.nickname as toNickname, 
            toMP.level as toLevel, toP.type1 as toType1, toP.type2 as toType2 

        FROM Trades t 
            JOIN Listing l ON t.listingID=l.listingID
            JOIN MyPokemon fromMP ON l.instanceID=fromMP.instanceID
            JOIN User fromU ON l.sellerID=fromU.uID
            JOIN Pokedex fromP ON fromMP.pID=fromP.pID
            JOIN Reply r ON t.replyID=r.replyID
            JOIN MyPokemon toMP ON r.instanceID=toMP.instanceID
            JOIN User toU ON r.respondantID=toU.uID
            JOIN Pokedex toP ON toMP.pID=toP.pID
        WHERE fromMP.instanceID=${instanceID} OR toMP.instanceID=${instanceID}
        ORDER BY time DESC;
    `;

        // Execute SQL query and format the results
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching user's Pokémon data:", err);
                return res.status(500).json({ error: "Database error" });
            }

            console.log(username);

            // Map raw SQL rows into structured trade records
            const formatted = results.map((row, index) => (
                row.isTo
                    // Case: The tracked Pokémon was the one being received
                    ? {
                        id: index,
                        date: row.time,
                        fromTrainer: row.toUser === username ? 'You' : row.toUser,
                        toTrainer: row.fromUser === username ? 'You' : row.fromUser,
                        tradedAway: { // Opponent’s Pokémon
                            pokemon: row.fromName,
                            nickname: row.fromNickname,
                            level: row.fromLevel,
                            types: row.fromType2 ? [row.fromType1, row.fromType2] : [row.fromType1],
                        },
                        tradedFor: { // Your Pokémon
                            pokemon: row.toName,
                            nickname: row.toNickname,
                            level: row.toLevel,
                            types: row.toType2 ? [row.toType1, row.toType2] : [row.toType1],
                        },
                        notes: row.description,
                    }
                    // Case: The tracked Pokémon was the one being traded away
                    : {
                        id: index,
                        date: row.time,
                        fromTrainer: row.fromUser === username ? 'You' : row.fromUser,
                        toTrainer: row.toUser === username ? 'You' : row.toUser,
                        tradedAway: { // Your Pokémon
                            pokemon: row.toName,
                            nickname: row.toNickname,
                            level: row.toLevel,
                            types: row.toType2 ? [row.toType1, row.toType2] : [row.toType1],
                        },
                        tradedFor: { // Opponent’s Pokémon
                            pokemon: row.fromName,
                            nickname: row.fromNickname,
                            level: row.fromLevel,
                            types: row.fromType2 ? [row.fromType1, row.fromType2] : [row.fromType1],
                        },
                        notes: row.description,
                    }
            ));

            return res.json(formatted);
        });
    });


// ============================================================================
// Route: GET /searchUser?query=<username|uID>
// Description: Searches for users by either numeric ID or username substring.
// Supports partial matches for usernames, exact matches for IDs.
// ============================================================================
    app.get("/searchUser", async (req, res) => {
        const { query } = req.query; // Extract search query string

        if (!query) {
            return res.status(400).json({ error: "No user found" });
        }

        try {
            // Create a new DB connection using environment variables
            const db = await mysqlPromise.createConnection({
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            // Check if the query is numeric (search by uID) or text (search by username)
            const isNumeric = /^\d+$/.test(query);
            const [results] = isNumeric
                ? await db.execute("SELECT uID, name, username FROM User WHERE uID = ?", [query])
                : await db.execute("SELECT uID, name, username FROM User WHERE username LIKE ?", [`%${query}%`]);

            await db.end(); // Close connection after query is done

            // Return matched user(s)
            res.json(results);
        } catch (err) {
            console.error("Search error:", err);
            res.status(500).json({ error: "Server error while searching" });
        }
    });

    function formatEVIV(stats, base) {
        stats = Object.entries(stats).filter(([stat, value]) => value !== base)
        stats = stats.map(([stat, value]) => value + " " + stat)
        return stats.join(" / ")
    }

    function toTitleCase(str) {
        return str.replace(
            /[\w+]*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    app.get(`/pokemon/teamExport/:uID`, async (req, res) => {
        const uID = req.params.uID;
        const sql = `
            WITH ids as (
                SELECT instanceID FROM MyPokemon
                WHERE uID=${uID} AND onTeam=1
            ), variants as (
                (SELECT ids.instanceID, mp.form
                FROM ids 
                LEFT JOIN MyPokemon mp ON ids.instanceID=mp.instanceID
                JOIN PokemonVariants v ON mp.form=v.name)
                UNION
                (SELECT ids.instanceID, p.name as form
                FROM ids
                LEFT JOIN MyPokemon mp ON ids.instanceID=mp.instanceID
                LEFT JOIN Pokedex p ON mp.pID=p.pID
                WHERE mp.form NOT IN (SELECT name FROM PokemonVariants))
            ), numbered_attacks AS (
                SELECT 
                    ca.instanceID,
                    a.attack_name,
                    ROW_NUMBER() OVER (PARTITION BY ca.instanceID ORDER BY a.aID) AS attack_num
                FROM ids
                LEFT JOIN CurrentAttacks ca ON ca.instanceID = ids.instanceID
                LEFT JOIN Attacks a ON a.aID = ca.aID
            ), attacks AS (
                SELECT 
                    ids.instanceID,
                    MAX(CASE WHEN na.attack_num = 1 THEN na.attack_name END) AS atk1,
                    MAX(CASE WHEN na.attack_num = 2 THEN na.attack_name END) AS atk2,
                    MAX(CASE WHEN na.attack_num = 3 THEN na.attack_name END) AS atk3,
                    MAX(CASE WHEN na.attack_num = 4 THEN na.attack_name END) AS atk4
                FROM ids LEFT JOIN numbered_attacks na ON na.instanceID = ids.instanceID
                GROUP BY ids.instanceID
            )
            SELECT mp.instanceID,
                mp.nickname,
                mp.teraType,
                p.type1,
                v.form,
                i.item,
                mp.ability,
                mp.hpEV,
                mp.atkEV,
                mp.defEV,
                mp.spAtkEV,
                mp.spDefEV,
                mp.speedEV,
                mp.hpIV,
                mp.atkIV,
                mp.defIV,
                mp.spAtkIV,
                mp.spDefIV,
                mp.speedIV,
                mp.nature,
                a.atk1,
                a.atk2,
                a.atk3,
                a.atk4
            FROM ids
            LEFT JOIN MyPokemon mp ON ids.instanceID=mp.instanceID
            LEFT JOIN variants v ON ids.instanceID=v.instanceID
            LEFT JOIN heldItems i ON ids.instanceID=i.instanceID
            LEFT JOIN attacks a ON ids.instanceID=a.instanceID
            LEFT JOIN Pokedex p ON mp.pID=p.pID;
        `
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Error fetching pokemon's data", err);
                return res.status(500).json({error: "Database error"});
            } 
            results = results.map((row) => ({...row, evs: formatEVIV({
                    HP: row.hpEV, 
                    Atk: row.atkEV, 
                    Def: row.defEV,
                    SpA: row.spAtkEV, 
                    SpD: row.spDefEV, 
                    Spe: row.speedEV
                }, 0), ivs: formatEVIV({
                    HP: row.hpIV, 
                    Atk: row.atkIV,
                    Def: row.defIV,
                    SpA: row.spAtkIV, 
                    SpD: row.spDefIV, 
                    Spe: row.speedIV}, 31
                )
            }))
            const mon = results.map((row) =>`${
                    row.nickname !== null ? `${row.nickname} (${row.form})` : row.form
                }${
                    row.item !== null ? ` @ ${toTitleCase(row.item)}`:''
                } ${
                    row.ability !== null ? `\nAbility: ${toTitleCase(row.ability)}` : ''
                }${
                    row.teraType !== null ? `\nTera Type: ${row.teraType}` : `\nTera Type: ${row.type1}`
                }${ row.evs !== '' ? `\nEVs: ${row.evs}` : '' }${
                    row.nature !== null ? `\n${row.nature} Nature` : ''
                }${ row.ivs !== '' ? `\nIVs: ${row.ivs}` : '' }${
                    [row.atk1, row.atk2, row.atk3, row.atk4]
                    .filter((atk) => atk !== null)
                    .map((a) => '\n- ' + a).join('')
                }`
            )
            return res.json(mon.join('\n\n'));
        });
    });



}

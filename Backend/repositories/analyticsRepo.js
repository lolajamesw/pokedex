const pool = require('../db');

exports.typeSummary = async (tID) => {
    const sql = `
    WITH ids as (
        SELECT * FROM (
            SELECT p1 as id FROM Teams WHERE tID=? UNION
            SELECT p2 as id FROM Teams WHERE tID=? UNION
            SELECT p3 as id FROM Teams WHERE tID=? UNION
            SELECT p4 as id FROM Teams WHERE tID=? UNION
            SELECT p5 as id FROM Teams WHERE tID=? UNION
            SELECT p6 as id FROM Teams WHERE tID=? 
        ) as team WHERE id IS NOT NULL
    ), FX as (
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
        SELECT t1.type1 typeA, t2.type1 typeB, t1.type2, (t1.effect*t2.effect) as effect
        FROM full t1, full t2 WHERE t1.type1!=t2.type1 AND t1.type2=t2.type2
    ), crossed2 as (
        SELECT t1.type1, t1.type2 as typeA, t2.type2 as typeB, (t1.effect*t2.effect) as effect
        FROM full t1, full t2 WHERE t1.type1=t2.type1 AND t1.type2!=t2.type2
    )

    SELECT atk.type, atkSum, defSum FROM (
        SELECT type, SUM(effect)/(SELECT COUNT(*) FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)) as defSum FROM (
            SELECT type1 type, effect*(
                SELECT COUNT(*) from Pokedex p WHERE pID IN (
                    SELECT pID FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)
                ) AND p.type1=typeA AND p.type2=typeB
            ) as effect
            FROM crossed2 WHERE typeA IN (
                SELECT p.type1 from Pokedex p WHERE pID IN (
                    SELECT pID FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)
                ) AND p.type2=typeB
            ) UNION ALL
            SELECT type1 type, effect*(
                SELECT COUNT(*) from Pokedex p WHERE pID IN (
                    SELECT pID FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)
                ) AND p.type1=full.type2 AND p.type2=""
            ) as effect FROM full WHERE type2 IN (
                SELECT p.type1 FROM Pokedex p WHERE pID IN (
                    SELECT pID FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)
                ) AND p.type2="")
        ) as subDef GROUP BY type
    ) as def, (
        SELECT type, SUM(effect)/(SELECT COUNT(*) FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)) as atkSum 
        FROM (
            SELECT type2 as type, effect*(
                SELECT COUNT(*) from Pokedex p WHERE pID IN (
                    SELECT pID FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)
                ) AND p.type1=typeA AND p.type2=typeB
            ) as effect
            FROM crossed1 WHERE typeA IN (
                SELECT type1 from Pokedex p WHERE pID IN (
                    SELECT pID FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)
                ) AND p.type2=typeB
            ) UNION ALL
            SELECT type2 type, effect*(
                SELECT COUNT(*) from Pokedex p WHERE pID IN (
                    SELECT pID FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)
                ) AND p.type1=full.type1 AND p.type2=""
            ) as effect FROM full WHERE type1 IN (
                SELECT type1 FROM Pokedex p WHERE pID IN (
                    SELECT pID FROM MyPokemon WHERE instanceID IN (SELECT id FROM ids)
                ) AND p.type2=""
            )
        ) as subAtk GROUP BY type
    ) as atk 
    WHERE def.type=atk.type;`;
    const [rows] = await pool.query(sql, [tID, tID, tID, tID, tID, tID]);
    const formatted = rows.map((row) => ({
        type: row.type,
        atkAvg: parseFloat(row.atkSum),
        defAvg: parseFloat(row.defSum)===0 ? 100 : 1/row.defSum
    }));
    return formatted;
}


exports.export = async (tID) => {
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

    const sql = `
    WITH  ids as (
        SELECT * FROM (
            SELECT p1 as id FROM Teams WHERE tID=? UNION
            SELECT p2 as id FROM Teams WHERE tID=? UNION
            SELECT p3 as id FROM Teams WHERE tID=? UNION
            SELECT p4 as id FROM Teams WHERE tID=? UNION
            SELECT p5 as id FROM Teams WHERE tID=? UNION
            SELECT p6 as id FROM Teams WHERE tID=? 
        ) as team WHERE id IS NOT NULL
    ), variants as ((
            SELECT ids.id, mp.form
            FROM ids 
            LEFT JOIN MyPokemon mp ON ids.id=mp.instanceID
            JOIN PokemonVariants v ON mp.form=v.name
        )
        UNION
        (
            SELECT ids.id, p.name as form
            FROM ids
            LEFT JOIN MyPokemon mp ON ids.id=mp.instanceID
            LEFT JOIN Pokedex p ON mp.pID=p.pID
            WHERE mp.form NOT IN (SELECT name FROM PokemonVariants)
                OR mp.form IS NULL
        )
    ), numbered_attacks AS (
        SELECT 
            ca.instanceID,
            a.attack_name,
            ROW_NUMBER() OVER (PARTITION BY ca.instanceID ORDER BY a.aID) AS attack_num
        FROM ids
        LEFT JOIN CurrentAttacks ca ON ca.instanceID = ids.id
        LEFT JOIN Attacks a ON a.aID = ca.aID
    ), attacks AS (
        SELECT 
            ids.id,
            MAX(CASE WHEN na.attack_num = 1 THEN na.attack_name END) AS atk1,
            MAX(CASE WHEN na.attack_num = 2 THEN na.attack_name END) AS atk2,
            MAX(CASE WHEN na.attack_num = 3 THEN na.attack_name END) AS atk3,
            MAX(CASE WHEN na.attack_num = 4 THEN na.attack_name END) AS atk4
        FROM ids LEFT JOIN numbered_attacks na ON na.instanceID = ids.id
        GROUP BY ids.id
    )
    SELECT mp.instanceID,
        mp.nickname, v.form, i.item, mp.ability, mp.teraType, p.type1,
        mp.hpEV, mp.atkEV, mp.defEV, mp.spAtkEV, mp.spDefEV, mp.speedEV,
        mp.hpIV, mp.atkIV, mp.defIV, mp.spAtkIV, mp.spDefIV, mp.speedIV,
        mp.nature,
        a.atk1, a.atk2, a.atk3, a.atk4
    FROM ids
    LEFT JOIN MyPokemon mp ON ids.id=mp.instanceID
    LEFT JOIN variants v ON ids.id=v.id
    LEFT JOIN heldItems i ON ids.id=i.instanceID
    LEFT JOIN attacks a ON ids.id=a.id
    LEFT JOIN Pokedex p ON mp.pID=p.pID`;
    const [rows] = await pool.query(sql, [tID, tID, tID, tID, tID, tID]);
    const formatted = rows.map((row) => ({
        ...row, 
        evs: formatEVIV({
            HP: row.hpEV, 
            Atk: row.atkEV, 
            Def: row.defEV,
            SpA: row.spAtkEV, 
            SpD: row.spDefEV, 
            Spe: row.speedEV
        }, 0), 
        ivs: formatEVIV({
            HP: row.hpIV, 
            Atk: row.atkIV,
            Def: row.defIV,
            SpA: row.spAtkIV, 
            SpD: row.spDefIV, 
            Spe: row.speedIV
        }, 31)
    }));
    const title = (row) => {return row.nickname !== null 
        ? `${row.nickname} (${row.form})` 
        : row.form};
    const item = (row) => {return row.item !== null 
        ? ` @ ${toTitleCase(row.item)}` 
        : ''};
    const ability = (row) => {return row.ability !== null 
        ? `\nAbility: ${toTitleCase(row.ability)}` 
        : ''};
    const type = (row) => {return row.teraType !== null 
        ? `\nTera Type: ${row.teraType}` 
        : `\nTera Type: ${row.type1}`};
    const evs = (row) => {return row.evs !== '' 
        ? `\nEVs: ${row.evs}` 
        : ''};
    const ivs = (row) => {return row.ivs !== '' 
        ? `\nIVs: ${row.ivs}` 
        : ''};
    const moves = (row) => {return 
        [row.atk1, row.atk2, row.atk3, row.atk4]
            .filter((atk) => atk !== null)
            .map((a) => '\n- ' + a).join('')
    };
    const descriptions = formatted.map((row) => 
        title(row) + item(row) + ability(row) + type(row) 
        + evs(row) + ivs(row) + moves(row)
    );
    return descriptions.join('\n\n');
}

exports.opponent = async (name, uID) => {
    const sql1 = 'SELECT pID FROM Pokedex WHERE name=? LIMIT 1';
    const [pIDs] = await pool.query(sql1, [name]);
    if (!pIDs || pIDs.length === 0) throw new Error("Pokemon name not recognized");
    const pID = pIDs[0].pID;

    const sql2 = `
    -- ==========================================================
    -- Purpose: Find the best Pokémon a user owns to counter an
    --          opponent's Pokémon (identified by pID).
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
                (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ?) 
                AND defType2 IN (SELECT type2 FROM pokedex WHERE pid = ?)) OR
                (defType2 IN (SELECT type1 FROM pokedex WHERE pid = ?) 
                AND defType1 IN (SELECT type2 FROM pokedex WHERE pid = ?)) OR 
                (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ? AND type2='') 
                AND defType2 IS NULL)
            )
            -- Restrict to the current user’s Pokémon
            AND u.uid = mp.uid 
            AND u.uid = ?
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
            (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ?) 
                AND defType2 IN (SELECT type2 FROM pokedex WHERE pid = ?)) OR
            (defType2 IN (SELECT type1 FROM pokedex WHERE pid = ?) 
                AND defType1 IN (SELECT type2 FROM pokedex WHERE pid = ?)) OR 
            -- Handle opponent being single-typed
            (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ? AND type2='') 
                AND defType2 IS NULL)
        )
        AND u.uid = mp.uid                 -- Ensure Pokémon belongs to the logged-in user
        AND u.uid = ?             -- Filter by specific user ID
        AND all_combos.total_effect = bv.total_effect -- Match best effectiveness value
        AND mp.level = bv.level            -- Match best level values
    `;
    const [rows] = await pool.query(
        sql2, 
        [pID, pID, pID, pID, pID, uID, pID, pID, pID, pID, pID, uID]
    );
    const formatted = rows.map((row) => ({
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
    return {
        targetPokemon: name,
        targetPID: pID,
        counters: formatted,
    };
}
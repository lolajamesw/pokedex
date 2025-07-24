-- find the best pokemon to fight given an oponent pokemon
-- if multiple pokemon considered to be equally as good (level and type effectiveness) will return all of them
-- let the opponent pokemon be ${opPID}, current user id is {user_id}

WITH FX AS (
    SELECT type1, type2,
        CASE 
            WHEN double_strength = 1 THEN 2
            WHEN half_strength = 1 THEN 0.5
            ELSE 0
        END AS effect
    FROM TypeFX
),
full AS (
    SELECT * FROM FX
    UNION
    -- Fill in missing pairs with neutral effectiveness
    SELECT t1.type AS type1, t2.type AS type2, 1 AS effect
    FROM Types t1, Types t2
    WHERE NOT EXISTS (
        SELECT 1 FROM TypeFX tf
        WHERE tf.type1 = t1.type AND tf.type2 = t2.type
    )
),
-- All attacker combinations: (A1, A2) where A2 may be NULL
attacker_types AS (
    SELECT t1.type AS atkType1, NULL AS atkType2 FROM Types t1
    UNION
    SELECT t1.type AS atkType1, t2.type AS atkType2
    FROM Types t1, Types t2
    WHERE t1.type < t2.type  -- avoid dupes like (Fire, Water) and (Water, Fire)
),
-- All defender combinations: (D1, D2) where D2 may be NULL
defender_types AS (
    SELECT t1.type AS defType1, NULL AS defType2 FROM Types t1
    UNION
    SELECT t1.type AS defType1, t2.type AS defType2
    FROM Types t1, Types t2
    WHERE t1.type < t2.type
),
-- Combine and calculate total effect
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

best_values AS (
SELECT level, total_effect 
FROM all_combos, myPokemon mp, pokedex p, user u
WHERE 
	(
    (p.type1 = atkType1 AND p.type2 = atkType2) OR 
    (p.type1 = atkType2 AND p.type2 = atkType1) OR 
    (p.type2 NOT IN (SELECT * FROM TYPES) AND atkType2 IS NULL AND p.type1 = atkType1) 
    ) AND
    mp.pid = p.pid AND
    (
    (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) AND defType2 IN (SELECT type2 FROM pokedex WHERE pid = ${opPID})) OR
    (defType2 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) AND defType1 IN (SELECT type2 FROM pokedex WHERE pid = ${opPID})) OR 
    (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) AND defType2 IS NULL) OR
    (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) AND defType2 = '')
    )
    
    AND
    u.uid = mp.uid AND
    u.uid = ${user_id}
ORDER BY total_effect DESC, level DESC, atkType1, atkType2, defType1, defType2 limit 1
)

SELECT p.pid, p.name, mp.instanceID, mp.level, atkType1, atkType2, defType1, defType2, all_combos.total_effect 
FROM all_combos, myPokemon mp, pokedex p, user u, best_values bv
WHERE 
	(
    (p.type1 = atkType1 AND p.type2 = atkType2) OR 
    (p.type1 = atkType2 AND p.type2 = atkType1) OR 
    (p.type2 NOT IN (SELECT * FROM TYPES) AND atkType2 IS NULL AND p.type1 = atkType1) 
    ) AND
    mp.pid = p.pid AND
	(
    (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) AND defType2 IN (SELECT type2 FROM pokedex WHERE pid = ${opPID})) OR
    (defType2 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) AND defType1 IN (SELECT type2 FROM pokedex WHERE pid = ${opPID})) OR 
    (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) AND defType2 IS NULL) OR
    (defType1 IN (SELECT type1 FROM pokedex WHERE pid = ${opPID}) AND defType2 = '')
    ) AND
    u.uid = mp.uid AND
    u.uid = ${user_id} AND
    all_combos.total_effect = bv.total_effect AND
    mp.level = bv.level
;

-- Fancy Feature 5: Display complex Pokedex information and move list
-- Select pokemon details
SELECT pID, name, type1, type2, hp, atk, def, spAtk, spDef, speed, CAST(legendary AS UNSIGNED) AS legendary, description
FROM Pokedex WHERE pID=133;

-- Select MyPokemon details
SELECT instanceID, mp.pID, name, nickname, level, CAST(favourite AS UNSIGNED) AS favourite, CAST(onteam AS UNSIGNED) AS onTeam, type1, type2, hp, atk, def, spAtk, spDef, speed, CAST(legendary AS UNSIGNED) AS legendary, description
FROM Pokedex p, MyPokemon mp WHERE instanceID=62 AND p.pID=mp.pID;

-- Select a pokemon's learnable attacks
SELECT a.aID, a.attack_name, type, category, power, accuracy, PP, effect
FROM Attacks a, LearnableAttacks l 
WHERE pID=150 AND a.aID=l.aID LIMIT 10;

-- Select a pokemon's known attacks
SELECT a.aID, a.attack_name, type, category, power, accuracy, PP, effect
FROM Attacks a, CurrentAttacks c
WHERE instanceID=62 AND a.aID=c.aID;

-- Get a pokemon's evolutionary line
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
WHERE (pID1 = 133 OR pID2 = 133 OR pID3 = 133);

-- Select pokemon for pokedex page
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
      EXISTS (
        SELECT 1 
        FROM MyPokemon mp 
        WHERE mp.pID = p.pID AND mp.uID = 50
      ) AS caught
    FROM Pokedex p
    LIMIT 10;
    
    -- Select pokemon details
    SELECT pID, name, type1, type2, hp, atk, def, spAtk, spDef, speed, legendary, description
    FROM Pokedex WHERE pID=133;
    
    -- Select MyPokemon details
    SELECT instanceID, mp.pID, name, nickname, level, favourite, onteam, type1, type2, hp, atk, def, spAtk, spDef, speed, legendary, description
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
    
    -- Get user information
    SELECT uID, name, tradeCount, username
        FROM User WHERE uID=5;
        
	SELECT username, uID, name, tradeCount FROM User WHERE username LIKE '%User5%';
        
	-- Get MyPokemon details
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
    WHERE mp.uID = 50;
    
-- Writing

-- Add to MyPokemon
INSERT INTO MyPokemon (pID, uID, nickname, level, dateAdded)
       VALUES (38, 50, "Lady", 54, CURRENT_TIMESTAMP);
       
-- Set showcased pokemon
UPDATE MyPokemon
SET showcase=0
WHERE instanceID NOT IN (291,292,297) AND uID=50;
UPDATE MyPokemon
SET showcase=1
WHERE instanceID IN (291,292,297) AND uID=50;

-- Set a pokemon as a favourite
UPDATE MyPokemon
SET favourite=1
WHERE instanceID = 292 AND uID=50;

-- Set team pokemon
UPDATE MyPokemon
SET onteam=0
WHERE instanceID NOT IN (291,292,297) AND uID=50;
UPDATE MyPokemon
SET onteam=1
WHERE instanceID IN (291,292,297) AND uID=50;

-- Update a user's display name
UPDATE User
SET name='Lola'
WHERE uID=50;



-- We'll reread the user and mypokemon tables to check the additions

SELECT uID, name, tradeCount, username
        FROM User WHERE uID=5;
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
      CAST(mp.showcase AS UNSIGNED) AS showcase,
      CAST(mp.onteam AS UNSIGNED) AS onTeam
    FROM MyPokemon mp
    JOIN Pokedex p ON mp.pID = p.pID
    WHERE mp.uID = 50;
SELECT instanceID, mp.pID, name, nickname, level, favourite, onteam, type1, type2, hp, atk, def, spAtk, spDef, speed, legendary, description
    FROM Pokedex p, MyPokemon mp WHERE instanceID=1228 AND p.pID=mp.pID;

-- Basic Feature 3: Mark pokemon as favourite, caught, on-team, and showcase
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



-- We'll reread the user and mypokemon tables to check the changes

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


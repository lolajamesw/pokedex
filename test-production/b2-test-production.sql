-- Basic Feature 2: Manually enter caught pokemon
-- Add to MyPokemon
INSERT INTO MyPokemon (pID, uID, nickname, level, dateAdded)
       VALUES (38, 50, "Lady", 54, CURRENT_TIMESTAMP);

-- Display the changes 
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

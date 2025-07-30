-- Basic Feature 5: Display trade history
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

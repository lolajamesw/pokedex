-- Basic Feature 1: Select pokemon for pokedex page
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
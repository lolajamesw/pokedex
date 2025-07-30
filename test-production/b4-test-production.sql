-- Basic Feature 4: Search for another user
-- Get user information
SELECT uID, name, tradeCount, username
FROM User WHERE uID=81;

-- Get showcase
SELECT mp.pID, mp.nickname, mp.level, p.name 
FROM pokedex p, MyPokemon mp 
WHERE mp.uid = 81 AND mp.pID = p.pID AND showcase = 1;

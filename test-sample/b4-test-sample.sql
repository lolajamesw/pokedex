-- Basic Feature 4: Search for another user
SELECT username, uID, name, tradeCount FROM User WHERE username LIKE '%gary%';
SELECT username, uID, name, tradeCount FROM User WHERE uID = 4;
SELECT mp.pID, mp.nickname, mp.level, p.name FROM pokedex p, MyPokemon mp WHERE mp.uid = 4 AND mp.pID = p.pID AND showcase = 1;

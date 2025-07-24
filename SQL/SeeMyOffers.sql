-- my trade replies

SELECT p.pid, p.name, p.type1, p.type2, mp.level, mp.nickname, mp.uid, u.name
FROM reply r, mypokemon mp, pokedex p, user u
WHERE r.listingID = {selected trade} AND mp.instanceID = r.instanceID AND p.pid = mp.pID AND u.uid = r.respondantID;
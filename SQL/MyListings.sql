Select p.pid, p.name, p.type1, p.type2, mp.level, mp.nickname, mp.uid, u.name, l.description
FROM listing l, mypokemon mp, pokedex p, user u, trades t
WHERE l.instanceID = mp.instanceID AND p.pid = mp.pid AND mp.uid = u.uid AND l.listingID NOT IN (Select listingID from trades) AND u.uid = {user id};

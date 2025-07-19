-- see all listings except your own
Select p.pid, p.name, p.type1, p.type2, mp.level, mp.nickname, mp.uid, u.name, l.description
FROM listing l, mypokemon mp, pokedex p, user u
WHERE l.instanceID = mp.instanceID AND p.pid = mp.pid AND mp.uid = u.uid AND u.uid NOT IN (SELECT uid FROM user WHERE uid = {user id}) AND l.listingID NOT IN (SELECT listingID FROM trades);
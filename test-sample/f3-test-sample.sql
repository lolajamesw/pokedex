-- Fancy Feature 3: Market and trades
--listable pokemon
SELECT 
    myPokemon.instanceID,
    myPokemon.nickname,
    pokedex.name,
    pokedex.type1,
    pokedex.type2,
    myPokemon.level
FROM myPokemon JOIN pokedex ON myPokemon.pid = pokedex.pid
WHERE uid = 8 AND myPokemon.instanceID NOT IN (
    SELECT instanceID from listing WHERE listingID NOT IN (
        SELECT listingID FROM Trades
));
-- create listing
INSERT INTO Listing (instanceID, sellerID, description, postedTime)
      VALUES (19, 8, ‘Looking for a level 5 Bulbasaur’, NOW());

-- browse public listings
SELECT 
    l.listingID
, u.uID
, u.username
, p.pID
, p.name
, type1
, type2
, level
, l.description
, COUNT(replyID) as replyCount
FROM Listing l
LEFT JOIN MyPokemon mp ON mp.instanceID=l.instanceID
LEFT JOIN Pokedex p ON p.pID=mp.pID
LEFT JOIN User u ON u.uID=mp.uID
LEFT JOIN Reply r ON l.listingID=r.listingID
WHERE l.sellerID!=6 AND l.listingID NOT IN (SELECT listingID FROM trades)
GROUP BY l.listingID, u.uID, u.username, p.pID, p.name, 
    type1, type2, level, l.description;

-- replyable pokemon
SELECT 
    myPokemon.instanceID,
    myPokemon.nickname,
    pokedex.name,
    pokedex.type1,
    pokedex.type2,
    myPokemon.level
FROM myPokemon JOIN pokedex ON myPokemon.pid = pokedex.pid
WHERE uid = 9 AND myPokemon.instanceID NOT IN (SELECT instanceID FROM Reply WHERE listingID = 7);
-- send reply
INSERT INTO Reply (listingID, instanceID, respondantID, message, sentTime)
VALUES (7, 20, 9, ‘’, NOW());

-- my listings
SELECT 
l.listingID
, u.uID
, u.username
, p.pID
, p.name
, type1
, type2
, level
, l.description
, COUNT(replyID) as replyCount
FROM Listing l
LEFT JOIN MyPokemon mp ON mp.instanceID=l.instanceID
LEFT JOIN Pokedex p ON p.pID=mp.pID
LEFT JOIN User u ON u.uID=mp.uID
LEFT JOIN Reply r ON l.listingID=r.listingID
WHERE u.uID=6 AND l.listingID NOT IN (SELECT listingID FROM trades)
GROUP BY l.listingID, u.uID, u.username, p.pID, p.name, 
    type1, type2, level, l.description;

-- replies for listing 2
SELECT 
    mp.instanceID, 
    p.pID,
    p.name AS species, 
    p.type1, 
    p.type2, 
    mp.level, 
    mp.nickname, 
    mp.uid, 
    u.name AS respondantName,
    r.message,
    r.sentTime,
    r.replyID
FROM listing l, reply r, mypokemon mp, pokedex p, user u
WHERE l.listingID = 2
    AND l.listingID = r.listingID 
    AND mp.instanceID = r.instanceID 
    AND p.pid = mp.pID 
    AND u.uid = r.respondantID;

-- accept a trade offer
CALL doTrade(9);
SELECT
    tradeID,
    listingID,
    replyID
FROM trades;
SELECT
    user.name,
    nickname AS pokemon
FROM myPokemon JOIN user ON user.uid = myPokemon.uid
ORDER BY user.uid;


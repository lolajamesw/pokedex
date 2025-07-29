-- listable pokemon for user 27
	SELECT 
            myPokemon.instanceID,
            myPokemon.nickname,
            pokedex.name,
            pokedex.type1,
            pokedex.type2,
            myPokemon.level
        FROM myPokemon JOIN pokedex ON myPokemon.pid = pokedex.pid
        WHERE uid = 27 AND myPokemon.instanceID NOT IN (
            SELECT instanceID from listing WHERE listingID NOT IN (
                SELECT listingID FROM Trades
        ));

-- create listing for instance 80
INSERT INTO Listing (instanceID, sellerID, description, postedTime)
  VALUES (80, 27, 'Jigglypuff', NOW());
  
-- browse public listings as user 39
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
WHERE l.sellerID!=39 AND l.listingID NOT IN (SELECT listingID FROM trades)
GROUP BY l.listingID, u.uID, u.username, p.pID, p.name, 
	type1, type2, level, l.description;
                
-- Get pokemon that User39 can send as a reply to listing 555
SELECT 
	myPokemon.instanceID,
	myPokemon.nickname,
	pokedex.name,
	pokedex.type1,
	pokedex.type2,
	myPokemon.level
FROM myPokemon JOIN pokedex ON myPokemon.pid = pokedex.pid
WHERE uid = 39 AND myPokemon.instanceID NOT IN (SELECT instanceID FROM Reply WHERE listingID = 555);

-- Send instance 173 as a reply to listing 555
INSERT INTO Reply (listingID, instanceID, respondantID, message, sentTime)
	VALUES (555, 173, 39, 'Is Wigglytuff close enough?', NOW());
    
-- View listings for user 96 (iv)
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
WHERE u.uID=96 AND l.listingID NOT IN (SELECT listingID FROM trades)
GROUP BY l.listingID, u.uID, u.username, p.pID, p.name, 
	type1, type2, level, l.description;

-- Get replies to listing 77
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
WHERE l.listingID = 77
	AND l.listingID = r.listingID 
	AND mp.instanceID = r.instanceID 
	AND p.pid = mp.pID 
	AND u.uid = r.respondantID;
    
-- Accept trade offer 1397
CALL doTrade(1397);








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

-- create listing
INSERT INTO Listing (instanceID, sellerID, description, postedTime)
  VALUES ({instanceID}, {uID for the current user}, {description from text box}, NOW());
  
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
            WHERE l.sellerID!={uID for the current user} AND l.listingID NOT IN (SELECT listingID FROM trades)
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
WHERE uid = {uid} AND myPokemon.instanceID NOT IN (SELECT instanceID FROM Reply WHERE listingID = {lid});

-- send a reply
INSERT INTO Reply (listingID, instanceID, respondantID, message, sentTime)
	VALUES ({lid}, {iid}, {uID}, {message from text box}, NOW());
    
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
WHERE u.uID=${uID} AND l.listingID NOT IN (SELECT listingID FROM trades)
GROUP BY l.listingID, u.uID, u.username, p.pID, p.name, 
	type1, type2, level, l.description;

-- replies for a listing
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
WHERE l.listingID = ${listingID}
	AND l.listingID = r.listingID 
	AND mp.instanceID = r.instanceID 
	AND p.pid = mp.pID 
	AND u.uid = r.respondantID;
    
-- trade
CALL doTrade({rid});








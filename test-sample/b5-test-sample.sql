-- Basic Feature 5: Trade History
SELECT t.time, fromU.username fromUser, toU.username toUser, 
    l.description,

    fromP.name fromName, fromMP.nickname fromNickname, 
    fromMP.level fromLevel, fromP.type1 fromType1, 
    fromP.type2 fromType2,

    toP.name toName, toMP.nickname toNickname, 
    toMP.level toLevel, toP.type1 toType1, toP.type2 toType2 

FROM Trades t 
    JOIN Listing l ON t.listingID=l.listingID
    JOIN MyPokemon fromMP ON l.instanceID=fromMP.instanceID
    JOIN User fromU ON l.sellerID=fromU.uID
    JOIN Pokedex fromP ON fromMP.pID=fromP.pID
    JOIN Reply r ON t.replyID=r.replyID
    JOIN MyPokemon toMP ON r.instanceID=toMP.instanceID
    JOIN User toU ON r.respondantID=toU.uID
    JOIN Pokedex toP ON toMP.pID=toP.pID
WHERE fromMP.instanceID=1227 OR toMP.instanceID=1227
ORDER BY time DESC;

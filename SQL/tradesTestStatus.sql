DROP PROCEDURE IF EXISTS tradeStatus;
DELIMITER \\
CREATE PROCEDURE tradeStatus()
BEGIN

SELECT 
    tradeID,
    listingID,
    replyID
FROM trades;

SELECT
	listingID,
    nickname AS pokemon,
    user.name AS seller
FROM listing JOIN myPokemon ON listing.instanceID = myPokemon.instanceID 
    JOIN user ON listing.sellerID = user.uid;

SELECT
	replyID,
    listingID,
    nickname AS pokemon,
    user.name AS respondant
FROM reply JOIN myPokemon ON reply.instanceID = myPokemon.instanceId 
    JOIN user ON reply.respondantID = user.uid;

SELECT 
	user.name,
    nickname AS pokemon
FROM myPokemon JOIN user ON user.uid = myPokemon.uid
ORDER BY user.uid;


END\\
DELIMITER ;

CALL tradeStatus();
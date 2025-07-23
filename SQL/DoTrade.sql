
DROP TABLE IF EXISTS tradeGoingThrough;

CREATE TEMPORARY TABLE tradeGoingThrough as (
SELECT l.listingID, r.replyID, l.instanceID as forSalePokemon, l.sellerID AS seller, r.instanceID AS replyPokemon, r.respondantID as replyer
FROM reply r, listing l
WHERE r.listingID = l.listingID AND r.replyID = {reply id});

-- actually swap ownership
UPDATE mypokemon seller, mypokemon replyer, tradeGoingThrough
SET seller.uid = tradeGoingThrough.replyer, replyer.uid = tradeGoingThrough.seller
WHERE seller.instanceID = tradeGoingThrough.forSalePokemon AND replyer.instanceID = tradeGoingThrough.replyPokemon;

-- increment each users trade count
UPDATE user, tradeGoingThrough
SET tradeCount = tradecount + 1
WHERE uID = tradeGoingThrough.seller;

UPDATE user, tradeGoingThrough
SET tradeCount = tradecount + 1
WHERE uID = tradeGoingThrough.replyer;

-- add completed trade to trade table
INSERT INTO trades (listingID, replyID)
SELECT listingID, replyID FROM tradeGoingThrough;

drop TABLE tradeGoingThrough;

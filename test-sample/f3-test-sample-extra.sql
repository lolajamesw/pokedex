CALL tradeStatus(); -- print myPokemon, listing, reply, and trades to show the effects of doing trades

CALL doTrade(1); -- basic 1-1 trade
CALL tradeStatus();

CALL doTrade(2); -- choosing 1 of 2 offers with no conflicts
CALL tradeStatus();

CALL doTrade(4); -- G to C. G to F should be removed.
CALL tradeStatus();

CALL doTrade(5); -- accept reply to D. D should be removed as reply to F.
CALL tradeStatus();

CALL doTrade(6); -- accept F to E. F should be removed as listing.
CALL tradeStatus();

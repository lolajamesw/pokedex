
INSERT INTO Pokedex (pid, Name, type1, type2, HP, atk, Def, SpAtk, SpDef, Speed, Legendary, Description) VALUES
(1, 'Bulbasaur', 'Grass', 'Poison', 45, 49, 49, 65, 65, 45, 0, 'A strange seed was planted on its back at birth.'),
(2, 'Ivysaur', 'Grass', 'Poison', 60, 62, 63, 80, 80, 60, 0, 'The bulb on its back grows by drawing energy.'),
(3, 'Venusaur', 'Grass', 'Poison', 80, 82, 83, 100, 100, 80, 0, 'The plant blooms when it is absorbing solar energy.'),
(25, 'Pikachu', 'Electric', NULL, 35, 55, 40, 50, 50, 90, 0, 'It keeps its tail raised to monitor surroundings.'),
(26, 'Raichu', 'Electric', NULL, 60, 90, 55, 90, 80, 110, 0, 'Its tail discharges electricity into the ground.'),
(133, 'Eevee', 'Normal', NULL, 55, 55, 50, 45, 65, 55, 0, 'Its ability to evolve into many forms allows it to adapt smoothly and perfectly to any environment.'),
(134, 'Vaporeon', 'Water', NULL, 130, 65, 60, 110, 95, 65, 0, 'It lives close to water. Its long tail is ridged with a fin, which is often mistaken for a mermaid’s.'),
(135, 'Jolteon', 'Electric', NULL, 65, 65, 60, 110, 95, 130, 0, 'It concentrates the weak electric charges emitted by its cells and launches wicked lightning bolts.'),
(136, 'Flareon', 'Fire', NULL, 65, 130, 60, 95, 110, 65, 0, 'Inhaled air is carried to its flame sac, heated, and exhaled as fire that reaches over 3,000 degrees Fahrenheit.'),
(150, 'Mewtwo', 'Psychic', NULL, 106, 110, 90, 154, 90, 130, 1, 'It was created by a scientist after years of horrific gene splicing.');

-- sample attacks
INSERT INTO Attacks (aid, attack_name, type, category, power, accuracy, PP, effect) VALUES
(1, 'Thunderbolt', 'Electric', 'Special', 90, 100, 15, 'May paralyze the target.'),
(2, 'Vine Whip', 'Grass', 'Physical', 45, 100, 25, 'Hits the target with slender vines.'),
(3, 'Solar Beam', 'Grass', 'Special', 120, 100, 10, 'Charges on first turn, attacks on second.'),
(4, 'Psychic', 'Psychic', 'Special', 90, 100, 10, 'May lower Sp. Def of target.');


INSERT INTO LearnableAttacks (pid, aid) VALUES
(1, 2), (1, 3), -- Bulbasaur can learn Vine Whip and Solar Beam
(3, 2), (3, 3), -- Venusaur can learn Vine Whip and Solar Beam
(25, 1), -- Pikachu can learn Thunderbolt
(26, 4); -- Raichu


-- A user with 8 pokemon: 6 on their team, 6 showcased, some overlap between them--
INSERT INTO User (uid, Name, tradeCount, username, password) VALUES
(4, 'Cynthia', 5, 'championcyn', 'Garchomp142*');

INSERT INTO MyPokemon (instanceID, pid, uid, nickname, favourite, onteam, level, showcase) VALUES
(1, 150, 4, 'CloneGod', 0, 1, 70, 1),  -- On team + Showcased
(2, 3, 4, 'Bulky', 1, 1, 42, 1),     -- On team + Showcased
(3, 25, 4, 'Zaps', 0, 1, 35, 0),      -- On team
(4, 26, 4, 'Zoomer', 0, 1, 55, 1),    -- On team + Showcased
(5, 1, 4, 'Leafy', 0, 1, 14, 0),     -- On team
(6, 2, 4, 'Evolver', 0, 1, 25, 1),   -- On team + Showcased
(7, 1, 4, 'Seedling', 0, 0, 9, 1),   -- Not on team, but Showcased
(8, 3, 4, 'Tanky', 0, 0, 40, 1);     -- Not on team, but Showcased

INSERT INTO CurrentAttacks (instanceID, aID) VALUES
(1, 7), (1,24), (1,53);

-- User with 2 pokemon: 1 favourite, 1 not--
INSERT INTO User (uid, Name, tradeCount, username, password) VALUES
(5, 'Gary Oak', 2, 'rivalgary', 'Eeveelutions21*');

INSERT INTO MyPokemon (instanceID, pid, uid, nickname, favourite, onteam, level, showcase) VALUES
(9, 25, 5, 'Sparkles', 1, 0, 18, 0),  -- Favourite
(10, 2, 5, 'IvyBoy', 0, 1, 25, 0);    -- On team


-- User with 3 pokemon --
INSERT INTO User (uid, Name, tradeCount, username, password) VALUES
(6, 'Erika', 1, 'flowerqueen', 'Bellsprout13*');

INSERT INTO MyPokemon (instanceID, pid, uid, nickname, favourite, onteam, level, showcase) VALUES
(11, 1, 6, 'Sprouter', 0, 1, 15, 0),
(12, 2, 6, 'Bloomy', 0, 0, 25, 0),
(13, 3, 6, 'VineBoss', 0, 1, 45, 1);

-- A fourth user with 3 pokemon, to facilitate trades testing --
INSERT INTO User (uid, Name, tradeCount, username, password) VALUES
(7, 'Felicity', 0, 'sugarAndSpice', 'Pa$$word15');

INSERT INTO MyPokemon (instanceID, pid, uid, nickname, favourite, onteam, level, showcase) VALUES
(14, 134, 7, 'Squirt', 0, 0, 9, 0),
(15, 135, 7, 'Jasper', 0, 0, 11, 0),
(16, 136, 7, 'Phillip', 0, 0, 2, 0);

INSERT INTO Evolutions (evolvesFrom, evolvesInto) 
VALUES
(1,2),
(2,3), 
(25,26), 
(133,134), 
(133,135), 
(133,136);

INSERT INTO listing(listingID, instanceID, sellerID)
VALUES
(1, 11, 6), -- 1-1 trade, no conflicts
(2, 12, 6), -- multiple replies
(3, 13, 6), -- reply G has been sent here and...
(4, 6, 4), -- this listing D has been sent as a reply elsewhere 
(5, 14, 7), -- reply F has also been listed
(6, 9, 5); -- this is reply F. G and D replies

INSERT INTO Reply(replyID, listingID, instanceID, respondantID)
VALUES
(1, 1, 1, 4), -- basic 1-1 trade
(2, 2, 2, 4), -- 2 offers for 1 listing with no conflicts
(3, 2, 15, 7),
(4, 3, 4, 4),  -- G to C
(5, 4, 10, 5), -- reply to D
(6, 5, 9, 5), -- F to E
(7, 6, 6, 4), -- D to F
(8, 6, 4, 4); -- G to F



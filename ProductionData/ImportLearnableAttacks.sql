-- create temporary tables to hold the data directly from the csv files
DROP TABLE IF EXISTS tempLearnableAttacks;
CREATE TABLE tempLearnableAttacks
(
	pokemon_id INT,
	version_group_id INT,
	move_id INT,
	pokemon_move_method_id INT,
	level CHAR(10),
	`order` CHAR(10),
	mastery CHAR(10)
);

DROP TABLE IF EXISTS tempMoveNames;
CREATE TABLE tempMoveNames
(
	move_id INT,
	local_language_id INT,
    name CHAR(50)
);

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/pokemon_moves.csv'
INTO TABLE tempLearnableAttacks
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/move_names.csv'
INTO TABLE tempMoveNames
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Remove unncecessary info from tempMoveNames (non-english move names, then the language id column)
DELETE FROM tempMoveNames
WHERE local_language_id != 9;

ALTER TABLE tempMoveNames
DROP COLUMN local_language_id;

-- Now, tempMoveNames links a move name to an attack id from the source file (which does not necessarily correspond to our own aids)

-- Remove unncecessary info from tempLearnableAttacks. We only care about the pokemon id and the move id
ALTER TABLE tempLearnableAttacks
DROP COLUMN version_group_id,
DROP COLUMN pokemon_move_method_id,
DROP COLUMN level,
DROP COLUMN `order`,
DROP COLUMN mastery;

-- Now tempLearnableAttacks just contains the pokemon id (which should match ours) and the move id (which should match tempMoveNames)

-- insert the data we want into the real LearnableAttacks table
TRUNCATE TABLE LearnableAttacks;
INSERT INTO LearnableAttacks
(
	SELECT DISTINCT
		tempLearnableAttacks.pokemon_id AS pID,
		attacks.aID
	FROM tempLearnableAttacks JOIN tempMoveNames ON tempLearnableAttacks.move_id = tempMoveNames.move_id
		JOIN attacks ON attacks.attack_name = tempMoveNames.name
);

-- delete the temporary tables
DROP TABLE tempLearnableAttacks;
DROP TABLE tempMoveNames;

-- display our results
SELECT
	pokedex.name,
	attacks.attack_name
FROM pokedex JOIN LearnableAttacks ON pokedex.pid = LearnableAttacks.pid
	JOIN attacks ON LearnableAttacks.aid = attacks.aid;



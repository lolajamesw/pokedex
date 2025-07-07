-- reset
TRUNCATE TABLE LearnableAttacks;
DROP TABLE IF EXISTS tempLearnableAttacks;

-- create a temporary table to hold the data directly from the CSV file
CREATE TABLE tempLearnableAttacks
(
	pokemonName CHAR(25),
    attackName CHAR(25)
);

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/PokemonLearnableMoveNames.csv'
INTO TABLE tempLearnableAttacks
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- use the temporary table to get our own primary keys for pokemon and attacks into the real LearnableAttacks table
INSERT INTO LearnableAttacks (pid, aid)
SELECT pid, aid
FROM pokedex, tempLearnableAttacks, attacks
WHERE pokedex.name = tempLearnableAttacks.pokemonName AND templearnableattacks.attackName = attacks.attack_name;

-- delete our temporary table
DROP TABLE tempLearnableAttacks;

-- display results
SELECT pokedex.name, GROUP_CONCAT(attack_name SEPARATOR ', ') AS attacks
FROM pokedex, learnableAttacks, attacks
WHERE pokedex.pID = learnableAttacks.pID AND learnableattacks.aID = attacks.aID
GROUP BY learnableattacks.pid;



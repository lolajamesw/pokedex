-- reset
TRUNCATE TABLE evolutions;
DROP TABLE IF EXISTS tempEvolutions;

-- create a temporary table to hold the exact data from the csv file
CREATE TABLE tempEvolutions (
	efrom CHAR(25),
    eto CHAR(25)
);

-- populate the temporary table with the data from the csv file
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/pokemon_evolutions.csv'
INTO TABLE tempEvolutions
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- get the data from the csv file into our desired format 
INSERT INTO evolutions (base, stage1, stage2)
WITH tripleEvo AS (
	SELECT e1.efrom AS baseName, e1.eto AS stage1Name, e2.eto AS stage2Name
    FROM tempEvolutions e1, tempEvolutions e2
    WHERE e1.eto = e2.efrom
)
SELECT p0.pid AS base, p1.pid AS stage1, p2.pid AS stage2
FROM tripleEvo, pokedex p0, pokedex p1, pokedex p2
WHERE p0.name = tripleEvo.baseName AND p1.name = tripleEvo.stage1Name AND p2.name = tripleEvo.stage2Name;

-- delete temporary table
DROP TABLE tempEvolutions;

-- display results
SELECT * FROM evolutions;
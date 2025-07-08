-- reset
TRUNCATE TABLE evolutions;
DROP TABLE IF EXISTS tempEvolutions;

-- create a temporary table to hold the exact data from the csv file
CREATE TABLE tempEvolutions (
	efrom VARCHAR(100),
    eto VARCHAR(100)
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
    FROM tempEvolutions e1 JOIN tempEvolutions e2
    ON e1.eto = e2.efrom
),
doubleEvo AS (
	SELECT efrom AS baseName, eto AS stage1Name, NULL AS stage2Name
    FROM tempEvolutions WHERE NOT EXISTS (SELECT * FROM tripleEvo WHERE efrom = tripleEvo.baseName OR efrom = tripleEvo.stage1Name)
)
SELECT DISTINCT
	p0.pid AS base, 
    p1.pid AS stage1, 
    CASE
		WHEN evos.stage2Name = p2.name THEN p2.pid
        ELSE NULL
	END AS stage2
FROM (SELECT * FROM tripleEvo UNION SELECT * FROM doubleEvo) evos, pokedex p0, pokedex p1, pokedex p2
WHERE p0.name = evos.baseName AND p1.name = evos.stage1Name AND (p2.name = evos.stage2Name OR evos.stage2Name IS NULL)
    AND p0.pid != 43
    AND p0.pid != 60
    AND p0.pid != 279; -- temporarily ommitting evolution information for these species because they follow an irregular evolutionary tree. Need to restructure to handle this

-- delete temporary table
DROP TABLE tempEvolutions;

-- display results
SELECT * FROM evolutions;
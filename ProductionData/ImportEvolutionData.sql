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
INSERT INTO evolutions (evolvesFrom, evolvesInto)
SELECT 
	p0.pid AS evolvesFrom, 
    p1.pid AS evolvesInto 
FROM tempEvolutions, pokedex p0, pokedex p1
WHERE p0.name = efrom AND p1.name = eto;

-- delete temporary table
DROP TABLE tempEvolutions;

-- display results
WITH tripleEvo AS (
    SELECT 
        e1.evolvesFrom AS base,
        e1.evolvesInto AS stage1,
        e2.evolvesInto AS stage2
    FROM evolutions e1, evolutions e2
    WHERE e1.evolvesInto = e2.evolvesFrom
),
doubleEvo AS (
    SELECT 
        evolvesFrom AS base,
        evolvesInto AS stage1,
        NULL AS stage2
    FROM evolutions
    WHERE NOT EXISTS (SELECT * FROM tripleEvo WHERE evolvesFrom = base AND evolvesInto = stage1)
)
SELECT * FROM (SELECT * FROM tripleEvo UNION SELECT * FROM doubleEvo) as evo;
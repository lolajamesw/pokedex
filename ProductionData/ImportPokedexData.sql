-- reset so we don't get duplicate entries
TRUNCATE TABLE Pokedex;
DROP TABLE IF EXISTS tempPokedex;

-- create a temporary table to hold the data directly from the csv file
CREATE TABLE tempPokedex (
	pID INT,
    name VARCHAR(40) NOT NULL,
    type1 VARCHAR(10) NOT NULL REFERENCES Types(type),
    type2 VARCHAR(10) REFERENCES Types(type),
    total INT,
    hp INT NOT NULL,
    atk INT NOT NULL,
    def INT NOT NULL,
    spAtk INT NOT NULL,
    spDef INT NOT NULL,
    speed INT NOT NULL,
    generation INT,
    legendary NVARCHAR(10) NOT NULL,
    CHECK (HP >=0 AND atk >= 0 AND def >= 0 AND spAtk >= 0 AND spDef >= 0 AND speed >= 0)
);

-- create a trigger to adjust the data from the csv to suit our pokedex schema
CREATE TRIGGER insertPokedex
AFTER INSERT ON tempPokedex
FOR EACH ROW
	INSERT INTO Pokedex (pID, name, type1, type2, hp, atk, def, spAtk, spDef, speed, legendary)
    VALUES(NEW.pID, NEW.name, NEW.type1, NEW.type2, NEW.hp, NEW.atk, NEW.def, NEW.spAtk, NEW.spDef, NEW.speed, 
		CASE
			WHEN NEW.legendary = 'True' THEN 1
            ELSE 0
        END);

-- load pokemon data from csv file
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/pokemon.csv'
INTO TABLE tempPokedex
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- delete the temporary table and trigger
DROP TRIGGER insertPokedex;
DROP TABLE tempPokedex;


-- -- make sure no pIDs are skipped
-- DROP TABLE IF EXISTS numbers;
-- DROP PROCEDURE IF EXISTS populateNumbers;
-- CREATE TABLE numbers (num INT PRIMARY KEY);
-- DELIMITER $$
-- CREATE PROCEDURE populateNumbers(min INT, max INT)
-- BEGIN
--     DECLARE i INT;
--     SET i = min;
--     numLoop: LOOP 
--         INSERT INTO numbers(num) VALUES (i);
--         IF i = max THEN
--             LEAVE numLoop;
--         END IF;
--         SET i = i + 1;
--     END LOOP numLoop;
-- END$$
-- DELIMITER ;

-- CALL populateNumbers(1, 721);
-- SELECT * FROM numbers WHERE num NOT IN (SELECT pid FROM pokedex);

-- DROP TABLE numbers;



SELECT * FROM Pokedex;

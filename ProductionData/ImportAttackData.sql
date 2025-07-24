TRUNCATE TABLE Attacks;

-- create temp table without aids
DROP TABLE IF EXISTS tempAttacks;
CREATE TABLE tempAttacks(
	attack_name VARCHAR(50) NOT NULL, 
	category VARCHAR(20), 
	type VARCHAR(10) NOT NULL REFERENCES Types(type), 
	power INT, 
	accuracy INT, 
	PP INT, 
	effect VARCHAR(100) NOT NULL,
    CHECK (power >=0 AND accuracy >= 0 AND PP >= 0)
);

-- set up a trigger to insert the data into the real attacks table
CREATE TRIGGER addAttack
AFTER INSERT ON tempAttacks
FOR EACH ROW
    INSERT INTO attacks(attack_name, type, category, power, accuracy, pp, effect, tm)
    VALUES(NEW.attack_name, NEW.type, NEW.category, NEW.power, NEW.accuracy, NEW.pp, NEW.effect, 0);
-- let the auto-increment take care of the aids

-- load moves from all 6 generations
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/gen1_moves.csv'
INTO TABLE tempAttacks
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'	
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/gen2_moves.csv'
INTO TABLE tempAttacks
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/gen3_moves.csv'
INTO TABLE tempAttacks
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/gen4_moves.csv'
INTO TABLE tempAttacks
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/gen5_moves.csv'
INTO TABLE tempAttacks
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/gen6_moves.csv'
INTO TABLE tempAttacks
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- delete the temporary table and trigger
DROP TABLE tempAttacks;
DROP TRIGGER IF EXISTS addAttack;

-- mark tms
DROP TABLE IF EXISTS tm_list;
CREATE TABLE tm_list (
    move_name CHAR(25)
);

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/tm_moves.csv'
INTO TABLE tm_list
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n';

UPDATE attacks
SET tm = 1
WHERE attack_name IN (SELECT move_name AS attack_name FROM tm_list);

DROP TABLE tm_list;


-- display results
SELECT * FROM attacks;




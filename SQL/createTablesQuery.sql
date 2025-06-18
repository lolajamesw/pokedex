DROP TABLE IF EXISTS Market;
DROP TABLE IF EXISTS Trades;
DROP TABLE IF EXISTS CurrentAttacks;
DROP TABLE IF EXISTS LearnableAttacks;
DROP TABLE IF EXISTS Attacks;
DROP TABLE IF EXISTS MyPokemon;
DROP TABLE IF EXISTS Evolutions;
DROP TABLE IF EXISTS Pokedex;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS TypeFX;
DROP TABLE IF EXISTS Types;

CREATE TABLE Types(type VARCHAR(10) NOT NULL PRIMARY KEY);

CREATE TABLE TypeFX(
	type1 VARCHAR(10) NOT NULL REFERENCES Types(type),
    type2 VARCHAR(10) NOT NULL REFERENCES Types(type),
    double_strength BIT NOT NULL,
    half_strength BIT NOT NULL,
    no_impact BIT NOT NULL,
    PRIMARY KEY(type1, type2),
    CHECK (half_strength+double_strength+no_impact=1)
);

CREATE TABLE User (
	uID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    tradeCount INT NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(20) UNIQUE NOT NULL
    CHECK (LENGTH(password)>7 AND password REGEXP '[0-9]' AND password REGEXP '[a-z]'
		 AND password REGEXP '[A-Z]' AND password REGEXP '[^a-zA-Z0-9]')
);

CREATE TABLE Pokedex (
	pID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    type1 VARCHAR(10) NOT NULL REFERENCES Types(type),
    type2 VARCHAR(10) REFERENCES Types(type),
    hp INT NOT NULL,
    atk INT NOT NULL,
    def INT NOT NULL,
    spAtk INT NOT NULL,
    spDef INT NOT NULL,
    speed INT NOT NULL,
    legendary BIT NOT NULL,
	description varchar(200),
    CHECK (HP >=0 AND atk >= 0 AND def >= 0 AND spAtk >= 0 AND spDef >= 0 AND speed >= 0)
);
    
CREATE TABLE Evolutions (
	pIDfrom INT NOT NULL REFERENCES Pokedex(pID),
    pIDinto INT NOT NULL REFERENCES Pokedex(pID),
    PRIMARY KEY(pIDfrom, pIDinto)
);
CREATE TABLE MyPokemon(
	pID INT NOT NULL REFERENCES Pokedex(pID),
    uID INT NOT NULL REFERENCES User(uID),
    instanceID INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(30),
    level INT,
    favourite BIT DEFAULT 0,
    onteam BIT DEFAULT 0,
    showcase BIT DEFAULT 0,
    dateAdded DATETIME DEFAULT '2000-01-01',
    CHECK (level>0)
);

CREATE TABLE Attacks(
	aID INT AUTO_INCREMENT PRIMARY KEY, 
	attack_name VARCHAR(50) NOT NULL, 
	type VARCHAR(10) NOT NULL REFERENCES Types(type), 
	category VARCHAR(20), 
	power INT, 
	accuracy INT, 
	PP INT, 
	effect VARCHAR(100) NOT NULL,
    CHECK (power >=0 AND accuracy >= 0 AND PP >= 0)
);

CREATE TABLE LearnableAttacks(
	pID INT NOT NULL REFERENCES Pokedex(pID),
    aID INT NOT NULL REFERENCES Attacks(aID),
    PRIMARY KEY (pID, aID)
);

CREATE TABLE CurrentAttacks(
    instanceID INT NOT NULL,
    aID INT NOT NULL REFERENCES Attacks(aID),
    PRIMARY KEY (instanceID, aID),
    FOREIGN KEY (instanceID) REFERENCES MyPokemon(instanceID)
);

DELIMITER //

CREATE TRIGGER limit_attacks
BEFORE INSERT ON CurrentAttacks
FOR EACH ROW
BEGIN
	DECLARE atkCount INT;
    SELECT COUNT(DISTINCT(pID, instanceID, uID)) INTO atkCount
    FROM CurrentAttacks
    
    IF atkCount >= 4 THEN 
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Pokemon cannot learn more than 4 moves';
    END IF
END
DELIMITER ;

CREATE TABLE Trades(
	trade_id INT AUTO_INCREMENT PRIMARY KEY,
	seller_pokemon_instance_id INT NOT NULL, 
	seller_id INT NOT NULL, 
	buyer_id INT, 
	buyer_pokemon_instance_id INT, 
	status VARCHAR(15) NOT NULL,
    FOREIGN KEY (seller_pokemon_instance_id) REFERENCES MyPokemon(instanceID),
    FOREIGN KEY (seller_id) REFERENCES User(uid),
    FOREIGN KEY (buyer_pokemon_instance_id) REFERENCES MyPokemon(instanceID),
    FOREIGN KEY (buyer_id) REFERENCES User(uid)
);

CREATE TABLE Market(
    offered_pokemon_instance_id INT PRIMARY KEY,
    offering_user_id INT NOT NULL,
    request_description VARCHAR(100),
    reply_pokemon_instance_id INT NOT NULL,
    reply_user_id INT NOT NULL,
	FOREIGN KEY (offered_pokemon_instance_id) REFERENCES MyPokemon(instanceID),
	FOREIGN KEY (reply_pokemon_instance_id) REFERENCES MyPokemon(instanceID)
);
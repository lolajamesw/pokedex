DROP TABLE IF EXISTS Trades;
DROP TABLE IF EXISTS Market;
DROP TABLE IF EXISTS Reply;
DROP TABLE IF EXISTS Listing;
DROP TABLE IF EXISTS LearnableAttacks;
DROP TABLE IF EXISTS CurrentAttacks;
DROP TABLE IF EXISTS Attacks;
DROP TABLE IF EXISTS MyPokemon;
DROP TABLE IF EXISTS Evolutions;
DROP TABLE IF EXISTS Pokedex;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS TypeFX;
DROP TABLE IF EXISTS Types;
DROP TRIGGER IF EXISTS limit_attacks;
DROP TRIGGER IF EXISTS max_6_onTeam;
DROP TRIGGER IF EXISTS max_6_showcase;
DROP PROCEDURE IF EXISTS doTrade;

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
	description varchar(300),
    CHECK (HP >=0 AND atk >= 0 AND def >= 0 AND spAtk >= 0 AND spDef >= 0 AND speed >= 0)
);
    
CREATE TABLE Evolutions (
	evolvesFrom INT REFERENCES Pokedex(pID),
    evolvesInto INT REFERENCES Pokedex(pID),
    PRIMARY KEY(evolvesFrom, evolvesInto)
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
    tm BIT,
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

CREATE TABLE Listing(
	listingID INT AUTO_INCREMENT PRIMARY KEY,
    instanceID INT NOT NULL REFERENCES MyPokemon(instanceID),
    sellerID INT NOT NULL REFERENCES User(uID),
    postedTime DATETIME DEFAULT '2000-01-01',
    description VARCHAR(100)
);

CREATE TABLE Reply(
	replyID INT AUTO_INCREMENT PRIMARY KEY,
    listingID INT NOT NULL REFERENCES Listing(listingID),
    instanceID INT NOT NULL REFERENCES MyPokemon(instanceID),
    respondantID INT NOT NULL REFERENCES User(uID),
    sentTime DATETIME DEFAULT '2000-01-01',
    message CHAR(100) NOT NULL
);

CREATE TABLE Trades(
	tradeID INT AUTO_INCREMENT PRIMARY KEY,
	listingID INT NOT NULL,
    replyID INT NOT NULL,
    `time` DATETIME DEFAULT '2000-01-01',
    FOREIGN KEY (listingID) REFERENCES Listing(listingID),
    FOREIGN KEY (replyID) REFERENCES Reply(replyID)
);

DELIMITER //

CREATE TRIGGER limit_attacks
BEFORE INSERT ON CurrentAttacks
FOR EACH ROW
BEGIN
	DECLARE atkCount INT;
    SELECT COUNT(DISTINCT(instanceID)) INTO atkCount
    FROM CurrentAttacks;
    
    IF atkCount >= 4 THEN 
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Pokemon cannot learn more than 4 moves';
    END IF;
END //

-- enforces that a user can have no more than 6 pokemon showcased at a time
CREATE TRIGGER max_6_showcase 
BEFORE UPDATE ON MyPokemon
FOR EACH ROW
BEGIN
	DECLARE numShowcased INT;
	IF OLD.showcase = 0 AND NEW.showcase = 1 THEN
		SELECT COUNT(instanceID) INTO numShowcased 
			FROM MyPokemon 
			WHERE uid = OLD.uid AND showcase = 1;

		IF numShowcased >= 6 THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'A user cannot showcase more than 6 pokemon at a time';
		END IF;
	END IF;
END //


-- enforces that a user can have no more than 6 pokemon on their team
CREATE TRIGGER max_6_onTeam 
BEFORE UPDATE ON MyPokemon
FOR EACH ROW
BEGIN
	DECLARE numTeam INT;
    IF OLD.onTeam = 0 AND NEW.onTeam = 1 THEN
		SELECT COUNT(instanceID) INTO numTeam 
			FROM MyPokemon 
			WHERE uid = OLD.uid AND onTeam = 1;
			
		IF numTeam >= 6 AND NEW.onTeam = 1 THEN
			SIGNAL SQLSTATE '45000'
			SET MESSAGE_TEXT = 'The maximum team size is 6.';
		END IF;
	END IF;
END //

-- stored procedure to trade pokemon. Allows client to call it in one request

DELIMITER //
CREATE PROCEDURE doTrade(tradeID INT)
BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
	END;
    
    START TRANSACTION;
		DROP TABLE IF EXISTS tradeGoingThrough;

		CREATE TEMPORARY TABLE tradeGoingThrough as (
		SELECT l.listingID, r.replyID, l.instanceID as forSalePokemon, l.sellerID AS seller, r.instanceID AS replyPokemon, r.respondantID as replyer
		FROM reply r, listing l
		WHERE r.listingID = l.listingID AND r.replyID = 11);

		-- actually swap ownership
		UPDATE mypokemon seller, mypokemon replyer, tradeGoingThrough
		SET seller.uid = tradeGoingThrough.replyer, replyer.uid = tradeGoingThrough.seller
		WHERE seller.instanceID = tradeGoingThrough.forSalePokemon AND replyer.instanceID = tradeGoingThrough.replyPokemon;

		-- increment each users trade count
		UPDATE user, tradeGoingThrough
		SET tradeCount = tradecount + 1
		WHERE uID = tradeGoingThrough.seller;

		UPDATE user, tradeGoingThrough
		SET tradeCount = tradecount + 1
		WHERE uID = tradeGoingThrough.replyer;

		-- add completed trade to trade table
		INSERT INTO trades (listingID, replyID)
		SELECT listingID, replyID FROM tradeGoingThrough;

		drop TABLE tradeGoingThrough;
    COMMIT;
END//
DELIMITER ;



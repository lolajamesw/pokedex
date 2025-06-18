DROP TABLE IF EXISTS `pokedex`.`Market`;
DROP TABLE IF EXISTS `pokedex`.`Trades`;
DROP TABLE IF EXISTS `pokedex`.`CurrentAttacks`;
DROP TABLE IF EXISTS `pokedex`.`LearnableAttacks`;
DROP TABLE IF EXISTS `pokedex`.`Attacks`;
DROP TABLE IF EXISTS `pokedex`.`MyPokemon`;
DROP TABLE IF EXISTS `pokedex`.`Evolutions`;
DROP TABLE IF EXISTS `pokedex`.`Pokedex`;
DROP TABLE IF EXISTS `pokedex`.`User`;
DROP TABLE IF EXISTS `pokedex`.`TypeFX`;
DROP TABLE IF EXISTS `pokedex`.`Types`;

CREATE TABLE pokedex.`Types`(`type` VARCHAR(10) NOT NULL PRIMARY KEY);

CREATE TABLE pokedex.TypeFX(
	type1 VARCHAR(10) NOT NULL REFERENCES pokedex.`Types`(`type`),
    type2 VARCHAR(10) NOT NULL REFERENCES pokedex.`Types`(`type`),
    double_strength BIT NOT NULL,
    half_strength BIT NOT NULL,
    no_impact BIT NOT NULL,
    PRIMARY KEY(type1, type2),
    CHECK (half_strength+double_strength+no_impact=1)
);

CREATE TABLE `pokedex`.`User` (
	`uID` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(40) NOT NULL,
    `tradeCount` INT NOT NULL,
    `username` VARCHAR(30) UNIQUE NOT NULL,
    `password` VARCHAR(20) UNIQUE NOT NULL
    CHECK (LENGTH(`password`)>7 AND `password` REGEXP '[0-9]' AND `password` REGEXP '[a-z]'
		 AND `password` REGEXP '[A-Z]' AND `password` REGEXP '[^a-zA-Z0-9]')
);

CREATE TABLE `pokedex`.`Pokedex` (
	`pID` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(40) NOT NULL,
    type1 VARCHAR(10) NOT NULL REFERENCES `pokedex`.`Types`(`type`),
    type2 VARCHAR(10) REFERENCES `pokedex`.`Types`(`type`),
    hp INT NOT NULL,
    atk INT NOT NULL,
    def INT NOT NULL,
    spAtk INT NOT NULL,
    spDef INT NOT NULL,
    speed INT NOT NULL,
    legendary BIT NOT NULL,
	`description` varchar(200),
    CHECK (HP >=0 AND atk >= 0 AND def >= 0 AND spAtk >= 0 AND spDef >= 0 AND speed >= 0)
);
    
CREATE TABLE `pokedex`.`Evolutions` (
	pIDfrom INT NOT NULL REFERENCES `pokedex`.`Pokedex`(pID),
    pIDinto INT NOT NULL REFERENCES `pokedex`.`Pokedex`(pID),
    PRIMARY KEY(pIDfrom, pIDinto)
);
CREATE TABLE pokedex.MyPokemon(
	pID INT NOT NULL REFERENCES `pokedex`.`Pokedex`(pID),
    uID INT NOT NULL REFERENCES `pokedex`.`User`(uID),
    instanceID INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(30),
    `level` INT,
    favourite BIT DEFAULT 0,
    onteam BIT DEFAULT 0,
    showcase BIT DEFAULT 0,
    dateAdded DATETIME DEFAULT '2000-01-01',
    CHECK (level>0)
);

CREATE TABLE pokedex.Attacks(
	aID INT AUTO_INCREMENT PRIMARY KEY, 
	attack_name VARCHAR(50) NOT NULL, 
	`type` VARCHAR(10) NOT NULL REFERENCES pokedex.`Types`(`type`), 
	category VARCHAR(20), 
	power INT, 
	accuracy INT, 
	PP INT, 
	effect VARCHAR(100) NOT NULL,
    CHECK (power >=0 AND accuracy >= 0 AND PP >= 0)
);

CREATE TABLE pokedex.LearnableAttacks(
	pID INT NOT NULL REFERENCES pokedex.Pokedex(pID),
    aID INT NOT NULL REFERENCES pokedex.Attacks(aID),
    PRIMARY KEY (pID, aID)
);

CREATE TABLE pokedex.CurrentAttacks(
    instanceID INT NOT NULL,
    aID INT NOT NULL REFERENCES pokedex.Attacks(aID),
    PRIMARY KEY (instanceID, aID),
    FOREIGN KEY (instanceID) REFERENCES pokedex.MyPokemon(instanceID)
);

DELIMITER //

CREATE TRIGGER limit_attacks
BEFORE INSERT ON pokedex.CurrentAttacks
FOR EACH ROW
BEGIN
	DECLARE atkCount INT;
    SELECT COUNT(DISTINCT(pID, instanceID, uID)) INTO atkCount
    FROM pokedex.CurrentAttacks
    
    IF atkCount >= 4 THEN 
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Pokemon cannot learn more than 4 moves';
    END IF
END
DELIMITER ;

CREATE TABLE pokedex.Trades(
	trade_id INT AUTO_INCREMENT PRIMARY KEY,
	seller_pokemon_instance_id INT NOT NULL, 
	seller_id INT NOT NULL, 
	buyer_id INT, 
	buyer_pokemon_instance_id INT, 
	`status` VARCHAR(15) NOT NULL,
    FOREIGN KEY (seller_pokemon_instance_id) REFERENCES pokedex.MyPokemon(instanceID),
    FOREIGN KEY (seller_id) REFERENCES pokedex.User(uid),
    FOREIGN KEY (buyer_pokemon_instance_id) REFERENCES pokedex.MyPokemon(instanceID),
    FOREIGN KEY (buyer_id) REFERENCES pokedex.User(uid)
);

CREATE TABLE pokedex.Market(
    offered_pokemon_instance_id INT PRIMARY KEY,
    offering_user_id INT NOT NULL,
    request_description VARCHAR(100),
    reply_pokemon_instance_id INT NOT NULL,
    reply_user_id INT NOT NULL,
	FOREIGN KEY (offered_pokemon_instance_id) REFERENCES pokedex.MyPokemon(instanceID),
	FOREIGN KEY (reply_pokemon_instance_id) REFERENCES pokedex.MyPokemon(instanceID)
);
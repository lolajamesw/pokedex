DROP TABLE `pokedexbackup`.`Market`;
DROP TABLE `pokedexbackup`.`Trades`;
DROP TABLE `pokedexbackup`.`CurrentAttacks`;
DROP TABLE `pokedexbackup`.`LearnableAttacks`;
DROP TABLE `pokedexbackup`.`Attacks`;
DROP TABLE `pokedexbackup`.`MyPokemon`;
DROP TABLE `pokedexbackup`.`Evolutions`;
DROP TABLE `pokedexbackup`.`Pokedex`;
DROP TABLE `pokedexbackup`.`User`;
DROP TABLE `pokedexbackup`.`TypeFX`;
DROP TABLE `pokedexbackup`.`Types`;

CREATE TABLE pokedexbackup.`Types`(`type` VARCHAR(10) NOT NULL PRIMARY KEY);

CREATE TABLE pokedexbackup.TypeFX(
	type1 VARCHAR(10) NOT NULL REFERENCES pokedexbackup.`Types`(`type`),
    type2 VARCHAR(10) NOT NULL REFERENCES pokedexbackup.`Types`(`type`),
    double_strength BIT NOT NULL,
    half_strength BIT NOT NULL,
    no_impact BIT NOT NULL,
    PRIMARY KEY(type1, type2),
    CHECK (half_strength+double_strength+no_impact=1)
);

CREATE TABLE `pokedexbackup`.`User` (
	`uID` INT NOT NULL PRIMARY KEY,
    `name` VARCHAR(40) NOT NULL,
    `tradeCount` INT NOT NULL,
    `username` VARCHAR(30) UNIQUE NOT NULL,
    `password` VARCHAR(20) UNIQUE NOT NULL
    CHECK (LENGTH(`password`)>7 AND `password` REGEXP '[0-9]' AND `password` REGEXP '[a-z]'
		 AND `password` REGEXP '[A-Z]' AND `password` REGEXP '[^a-zA-Z0-9]')
);

CREATE TABLE `pokedexbackup`.`Pokedex` (
	`pID` INT NOT NULL PRIMARY KEY,
    `name` VARCHAR(40) NOT NULL,
    type1 VARCHAR(10) NOT NULL REFERENCES `pokedexbackup`.`Types`(`type`),
    type2 VARCHAR(10) REFERENCES `pokedexbackup`.`Types`(`type`),
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
    
CREATE TABLE `pokedexbackup`.`Evolutions` (
	pIDfrom INT NOT NULL REFERENCES `pokedexbackup`.`Pokedex`(pID),
    pIDinto INT NOT NULL REFERENCES `pokedexbackup`.`Pokedex`(pID),
    PRIMARY KEY(pIDfrom, pIDinto)
);
CREATE TABLE pokedexbackup.MyPokemon(
	pID INT NOT NULL REFERENCES `pokedexbackup`.`Pokedex`(pID),
    uID INT NOT NULL REFERENCES `pokedexbackup`.`User`(uID),
    instanceID INT NOT NULL,
    nickname VARCHAR(30),
    `level` INT,
    favourite BIT,
    onteam BIT,
    showcase BIT,
    PRIMARY KEY(pID, instanceID, uID),
    CHECK (level>0)
);

CREATE TABLE pokedexbackup.Attacks(
	aID INT NOT NULL PRIMARY KEY, 
	attack_name VARCHAR(50) NOT NULL, 
	`type` VARCHAR(10) NOT NULL REFERENCES pokedexbackup.`Types`(`type`), 
	category VARCHAR(20), 
	power INT, 
	accuracy INT, 
	PP INT, 
	effect VARCHAR(100) NOT NULL,
    CHECK (power >=0 AND accuracy >= 0 AND PP >= 0)
);

CREATE TABLE pokedexbackup.LearnableAttacks(
	pID INT NOT NULL REFERENCES pokedexbackup.Pokedex(pID),
    aID INT NOT NULL REFERENCES pokedexbackup.Attacks(aID),
    PRIMARY KEY (pID, aID)
);

CREATE TABLE pokedexbackup.CurrentAttacks(
	pID INT NOT NULL,
    instanceID INT NOT NULL,
    uID INT NOT NULL,
    aID INT NOT NULL REFERENCES pokedexbackup.Attacks(aID),
    PRIMARY KEY (pID, instanceID, uID, aID),
    FOREIGN KEY (pID, instanceID, uID) REFERENCES pokedexbackup.MyPokemon(pID, instanceID, uID)
);

DELIMITER //

CREATE TRIGGER limit_attacks
BEFORE INSERT ON pokedexbackup.CurrentAttacks
FOR EACH ROW
BEGIN
	DECLARE atkCount INT;
    SELECT COUNT(DISTINCT(pID, instanceID, uID)) INTO atkCount
    FROM pokedexbackup.CurrentAttacks
    
    IF atkCount >= 4 THEN 
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Pokemon cannot learn more than 4 moves';
    END IF
END
DELIMITER ;

CREATE TABLE pokedexbackup.Trades(
	trade_id INT NOT NULL PRIMARY KEY,
	seller_pokemon_id INT NOT NULL, 
	seller_pokemon_instance_id INT NOT NULL, 
	seller_id INT NOT NULL, 
	buyer_id INT, 
	buyer_pokemon_id INT, 
	buyer_pokemon_instance_id INT, 
	`status` VARCHAR(15) NOT NULL,
    FOREIGN KEY (seller_pokemon_id, seller_pokemon_instance_id, seller_id) REFERENCES pokedexbackup.MyPokemon(pID, instanceID, uID)
);

CREATE TABLE pokedexbackup.Market(
	offered_pokemon_id INT NOT NULL,
    offered_pokemon_instance_id INT NOT NULL,
    offering_user_id INT NOT NULL,
    request_description VARCHAR(100),
    reply_pokemon_id INT NOT NULL,
    reply_pokemon_instance_id INT NOT NULL,
    reply_user_id INT NOT NULL,
	FOREIGN KEY (offered_pokemon_id, offered_pokemon_instance_id, offering_user_id) REFERENCES pokedexbackup.MyPokemon(pID, instanceID, uID),
	FOREIGN KEY (reply_pokemon_id, reply_pokemon_instance_id, reply_user_id) REFERENCES pokedexbackup.MyPokemon(pID, instanceID, uID)
);
DROP TABLE currentAttacks;
DROP TABLE mypokemon;
DROP TABLE user;

CREATE TABLE User (
	uID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    tradeCount INT NOT NULL,
    username VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(20) UNIQUE NOT NULL
    CHECK (LENGTH(password)>7 AND password REGEXP '[0-9]' AND password REGEXP '[a-z]'
		 AND password REGEXP '[A-Z]' AND password REGEXP '[^a-zA-Z0-9]')
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

CREATE TABLE CurrentAttacks(
    instanceID INT NOT NULL,
    aID INT NOT NULL REFERENCES Attacks(aID),
    PRIMARY KEY (instanceID, aID),
    FOREIGN KEY (instanceID) REFERENCES MyPokemon(instanceID)
);
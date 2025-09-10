CREATE DATABASE  IF NOT EXISTS `pokedex` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pokedex`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: pokedex
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attacks`
--

DROP TABLE IF EXISTS `attacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attacks` (
  `aID` int NOT NULL AUTO_INCREMENT,
  `attack_name` varchar(50) NOT NULL,
  `type` varchar(10) NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `power` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `PP` int DEFAULT NULL,
  `effect` varchar(100) NOT NULL,
  `tm` bit(1) DEFAULT NULL,
  PRIMARY KEY (`aID`),
  CONSTRAINT `attacks_chk_1` CHECK (((`power` >= 0) and (`accuracy` >= 0) and (`PP` >= 0)))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attacks`
--

LOCK TABLES `attacks` WRITE;
/*!40000 ALTER TABLE `attacks` DISABLE KEYS */;
INSERT INTO `attacks` VALUES (1,'Thunderbolt','Electric','Special',90,100,15,'May paralyze the target.',NULL),(2,'Vine Whip','Grass','Physical',45,100,25,'Hits the target with slender vines.',NULL),(3,'Solar Beam','Grass','Special',120,100,10,'Charges on first turn, attacks on second.',NULL),(4,'Psychic','Psychic','Special',90,100,10,'May lower Sp. Def of target.',NULL);
/*!40000 ALTER TABLE `attacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currentattacks`
--

DROP TABLE IF EXISTS `currentattacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currentattacks` (
  `instanceID` int NOT NULL,
  `aID` int NOT NULL,
  PRIMARY KEY (`instanceID`,`aID`),
  CONSTRAINT `currentattacks_ibfk_1` FOREIGN KEY (`instanceID`) REFERENCES `mypokemon` (`instanceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currentattacks`
--

LOCK TABLES `currentattacks` WRITE;
/*!40000 ALTER TABLE `currentattacks` DISABLE KEYS */;
INSERT INTO `currentattacks` VALUES (1,7),(1,24),(1,53);
/*!40000 ALTER TABLE `currentattacks` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `limit_attacks` BEFORE INSERT ON `currentattacks` FOR EACH ROW BEGIN
	DECLARE atkCount INT;
    SELECT COUNT(DISTINCT(instanceID)) INTO atkCount
    FROM CurrentAttacks;
    
    IF atkCount >= 4 THEN 
		SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Pokemon cannot learn more than 4 moves';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `evolutions`
--

DROP TABLE IF EXISTS `evolutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evolutions` (
  `evolvesFrom` int NOT NULL,
  `evolvesInto` int NOT NULL,
  PRIMARY KEY (`evolvesFrom`,`evolvesInto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evolutions`
--

LOCK TABLES `evolutions` WRITE;
/*!40000 ALTER TABLE `evolutions` DISABLE KEYS */;
INSERT INTO `evolutions` VALUES (1,2),(2,3),(25,26),(133,134),(133,135),(133,136);
/*!40000 ALTER TABLE `evolutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `favourite_colour` varchar(45) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
INSERT INTO `group_members` VALUES (1,'Mya','Kay','pink'),(2,'Jasmine','Yip','red'),(3,'Lola','James','purple'),(4,'Mahdee','Khandokar','black');
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learnableattacks`
--

DROP TABLE IF EXISTS `learnableattacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learnableattacks` (
  `pID` int NOT NULL,
  `aID` int NOT NULL,
  PRIMARY KEY (`pID`,`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learnableattacks`
--

LOCK TABLES `learnableattacks` WRITE;
/*!40000 ALTER TABLE `learnableattacks` DISABLE KEYS */;
INSERT INTO `learnableattacks` VALUES (1,2),(1,3),(3,2),(3,3),(25,1),(26,4);
/*!40000 ALTER TABLE `learnableattacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listing`
--

DROP TABLE IF EXISTS `listing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listing` (
  `listingID` int NOT NULL AUTO_INCREMENT,
  `instanceID` int NOT NULL,
  `sellerID` int NOT NULL,
  `postedTime` datetime DEFAULT '2000-01-01 00:00:00',
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`listingID`),
  KEY `listing_seller_index` (`sellerID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing`
--

LOCK TABLES `listing` WRITE;
/*!40000 ALTER TABLE `listing` DISABLE KEYS */;
INSERT INTO `listing` VALUES (1,11,6,'2000-01-01 00:00:00',NULL),(2,12,6,'2000-01-01 00:00:00',NULL),(3,13,6,'2000-01-01 00:00:00',NULL),(4,6,4,'2000-01-01 00:00:00',NULL),(5,14,7,'2000-01-01 00:00:00',NULL),(6,9,5,'2000-01-01 00:00:00',NULL);
/*!40000 ALTER TABLE `listing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mypokemon`
--

DROP TABLE IF EXISTS `mypokemon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mypokemon` (
  `pID` int NOT NULL,
  `uID` int NOT NULL,
  `instanceID` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(30) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `favourite` bit(1) DEFAULT b'0',
  `onteam` bit(1) DEFAULT b'0',
  `showcase` bit(1) DEFAULT b'0',
  `dateAdded` datetime DEFAULT '2000-01-01 00:00:00',
  PRIMARY KEY (`instanceID`),
  CONSTRAINT `mypokemon_chk_1` CHECK ((`level` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mypokemon`
--

LOCK TABLES `mypokemon` WRITE;
/*!40000 ALTER TABLE `mypokemon` DISABLE KEYS */;
INSERT INTO `mypokemon` VALUES (150,4,1,'CloneGod',70,_binary '\0',_binary '',_binary '','2000-01-01 00:00:00'),(3,4,2,'Bulky',42,_binary '',_binary '',_binary '','2000-01-01 00:00:00'),(25,4,3,'Zaps',35,_binary '\0',_binary '',_binary '\0','2000-01-01 00:00:00'),(26,4,4,'Zoomer',55,_binary '\0',_binary '',_binary '','2000-01-01 00:00:00'),(1,4,5,'Leafy',14,_binary '\0',_binary '',_binary '\0','2000-01-01 00:00:00'),(2,4,6,'Evolver',25,_binary '\0',_binary '',_binary '','2000-01-01 00:00:00'),(1,4,7,'Seedling',9,_binary '\0',_binary '\0',_binary '','2000-01-01 00:00:00'),(3,4,8,'Tanky',40,_binary '\0',_binary '\0',_binary '','2000-01-01 00:00:00'),(25,5,9,'Sparkles',18,_binary '',_binary '\0',_binary '\0','2000-01-01 00:00:00'),(2,5,10,'IvyBoy',25,_binary '\0',_binary '',_binary '\0','2000-01-01 00:00:00'),(1,6,11,'Sprouter',15,_binary '\0',_binary '',_binary '\0','2000-01-01 00:00:00'),(2,6,12,'Bloomy',25,_binary '\0',_binary '\0',_binary '\0','2000-01-01 00:00:00'),(3,6,13,'VineBoss',45,_binary '\0',_binary '',_binary '','2000-01-01 00:00:00'),(134,7,14,'Squirt',9,_binary '\0',_binary '\0',_binary '\0','2000-01-01 00:00:00'),(135,7,15,'Jasper',11,_binary '\0',_binary '\0',_binary '\0','2000-01-01 00:00:00'),(136,7,16,'Phillip',2,_binary '\0',_binary '\0',_binary '\0','2000-01-01 00:00:00'),(136,8,17,'Ember',10,_binary '',_binary '',_binary '\0','2000-01-01 00:00:00'),(150,8,18,'Cinders',8,_binary '\0',_binary '\0',_binary '','2000-01-01 00:00:00'),(133,8,19,'Ashpaw',13,_binary '\0',_binary '',_binary '\0','2000-01-01 00:00:00'),(1,9,20,'Sprouty',5,_binary '',_binary '\0',_binary '\0','2000-01-01 00:00:00'),(2,9,21,'Bloomie',9,_binary '\0',_binary '',_binary '','2000-01-01 00:00:00'),(3,9,22,'Vinetta',7,_binary '\0',_binary '\0',_binary '\0','2000-01-01 00:00:00');
/*!40000 ALTER TABLE `mypokemon` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `max_6_showcase` BEFORE UPDATE ON `mypokemon` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `max_6_onTeam` BEFORE UPDATE ON `mypokemon` FOR EACH ROW BEGIN
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
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `pokedex`
--

DROP TABLE IF EXISTS `pokedex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pokedex` (
  `pID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `type1` varchar(10) NOT NULL,
  `type2` varchar(10) DEFAULT NULL,
  `hp` int NOT NULL,
  `atk` int NOT NULL,
  `def` int NOT NULL,
  `spAtk` int NOT NULL,
  `spDef` int NOT NULL,
  `speed` int NOT NULL,
  `legendary` bit(1) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`pID`),
  CONSTRAINT `pokedex_chk_1` CHECK (((`HP` >= 0) and (`atk` >= 0) and (`def` >= 0) and (`spAtk` >= 0) and (`spDef` >= 0) and (`speed` >= 0)))
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pokedex`
--

LOCK TABLES `pokedex` WRITE;
/*!40000 ALTER TABLE `pokedex` DISABLE KEYS */;
INSERT INTO `pokedex` VALUES (1,'Bulbasaur','Grass','Poison',45,49,49,65,65,45,_binary '\0','A strange seed was planted on its back at birth.'),(2,'Ivysaur','Grass','Poison',60,62,63,80,80,60,_binary '\0','The bulb on its back grows by drawing energy.'),(3,'Venusaur','Grass','Poison',80,82,83,100,100,80,_binary '\0','The plant blooms when it is absorbing solar energy.'),(25,'Pikachu','Electric',NULL,35,55,40,50,50,90,_binary '\0','It keeps its tail raised to monitor surroundings.'),(26,'Raichu','Electric',NULL,60,90,55,90,80,110,_binary '\0','Its tail discharges electricity into the ground.'),(133,'Eevee','Normal',NULL,55,55,50,45,65,55,_binary '\0','Its ability to evolve into many forms allows it to adapt smoothly and perfectly to any environment.'),(134,'Vaporeon','Water',NULL,130,65,60,110,95,65,_binary '\0','It lives close to water. Its long tail is ridged with a fin, which is often mistaken for a mermaid’s.'),(135,'Jolteon','Electric',NULL,65,65,60,110,95,130,_binary '\0','It concentrates the weak electric charges emitted by its cells and launches wicked lightning bolts.'),(136,'Flareon','Fire',NULL,65,130,60,95,110,65,_binary '\0','Inhaled air is carried to its flame sac, heated, and exhaled as fire that reaches over 3,000 degrees Fahrenheit.'),(150,'Mewtwo','Psychic',NULL,106,110,90,154,90,130,_binary '','It was created by a scientist after years of horrific gene splicing.');
/*!40000 ALTER TABLE `pokedex` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reply`
--

DROP TABLE IF EXISTS `reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reply` (
  `replyID` int NOT NULL AUTO_INCREMENT,
  `listingID` int NOT NULL,
  `instanceID` int NOT NULL,
  `respondantID` int NOT NULL,
  `sentTime` datetime DEFAULT '2000-01-01 00:00:00',
  `message` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`replyID`),
  KEY `reply_listing_index` (`listingID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reply`
--

LOCK TABLES `reply` WRITE;
/*!40000 ALTER TABLE `reply` DISABLE KEYS */;
INSERT INTO `reply` VALUES (1,1,1,4,'2000-01-01 00:00:00',NULL),(2,2,2,4,'2000-01-01 00:00:00',NULL),(3,2,15,7,'2000-01-01 00:00:00',NULL),(4,3,4,4,'2000-01-01 00:00:00',NULL),(5,4,10,5,'2000-01-01 00:00:00',NULL),(6,5,9,5,'2000-01-01 00:00:00',NULL),(7,6,6,4,'2000-01-01 00:00:00',NULL),(8,6,4,4,'2000-01-01 00:00:00',NULL);
/*!40000 ALTER TABLE `reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tm_list`
--

DROP TABLE IF EXISTS `tm_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tm_list` (
  `move_name` char(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tm_list`
--

LOCK TABLES `tm_list` WRITE;
/*!40000 ALTER TABLE `tm_list` DISABLE KEYS */;
INSERT INTO `tm_list` VALUES ('Mega Punch'),('Razor Wind'),('Swords Dance'),('Whirlwind'),('Mega Kick'),('Toxic'),('Horn Drill'),('Body Slam'),('Take Down'),('Double-Edge'),('BubbleBeam'),('Water Gun'),('Ice Beam'),('Blizzard'),('Hyper Beam'),('Pay Day'),('Submission'),('Counter'),('Seismic Toss'),('Rage'),('Mega Drain'),('SolarBeam'),('Dragon Rage'),('Thunderbolt'),('Thunder'),('Earthquake'),('Fissure'),('Dig'),('Psychic'),('Teleport'),('Mimic'),('Double Team'),('Reflect'),('Bide'),('Metronome'),('Selfdestruct'),('Egg Bomb'),('Fire Blast'),('Swift'),('Skull Bash'),('Softboiled'),('Dream Eater'),('Sky Attack'),('Rest'),('Thunder Wave'),('Psywave'),('Explosion'),('Rock Slide'),('Tri Attack'),('Substitute'),('DynamicPunch'),('Headbutt'),('Curse'),('Rollout'),('Roar'),('Toxic'),('Zap Cannon'),('Rock Smash'),('Psych Up'),('Hidden Power'),('Sunny Day'),('Sweet Scent'),('Snore'),('Blizzard'),('Hyper Beam'),('Icy Wind'),('Protect'),('Rain Dance'),('Giga Drain'),('Endure'),('Frustration'),('SolarBeam'),('Iron Tail'),('DragonBreath'),('Thunder'),('Earthquake'),('Return'),('Dig'),('Psychic'),('Shadow Ball'),('Mud-Slap'),('Double Team'),('Ice Punch'),('Swagger'),('Sleep Talk'),('Sludge Bomb'),('Sandstorm'),('Fire Blast'),('Swift'),('Defense Curl'),('ThunderPunch'),('Dream Eater'),('Detect'),('Rest'),('Attract'),('Thief'),('Steel Wing'),('Fire Punch'),('Fury Cutter'),('Nightmare'),('Focus Punch'),('Dragon Claw'),('Water Pulse'),('Calm Mind'),('Roar'),('Toxic'),('Hail'),('Bulk Up'),('Bullet Seed'),('Hidden Power'),('Sunny Day'),('Taunt'),('Ice Beam'),('Blizzard'),('Hyper Beam'),('Light Screen'),('Protect'),('Rain Dance'),('Giga Drain'),('Safeguard'),('Frustration'),('SolarBeam'),('Iron Tail'),('Thunderbolt'),('Thunder'),('Earthquake'),('Return'),('Dig'),('Psychic'),('Shadow Ball'),('Brick Break'),('Double Team'),('Reflect'),('Shock Wave'),('Flamethrower'),('Sludge Bomb'),('Sandstorm'),('Fire Blast'),('Rock Tomb'),('Aerial Ace'),('Torment'),('Facade'),('Secret Power'),('Rest'),('Attract'),('Thief'),('Steel Wing'),('Skill Swap'),('Snatch'),('Overheat'),('Focus Punch'),('Dragon Claw'),('Water Pulse'),('Calm Mind'),('Roar'),('Toxic'),('Hail'),('Bulk Up'),('Bullet Seed'),('Hidden Power'),('Sunny Day'),('Taunt'),('Ice Beam'),('Blizzard'),('Hyper Beam'),('Light Screen'),('Protect'),('Rain Dance'),('Giga Drain'),('Safeguard'),('Frustration'),('SolarBeam'),('Iron Tail'),('Thunderbolt'),('Thunder'),('Earthquake'),('Return'),('Dig'),('Psychic'),('Shadow Ball'),('Brick Break'),('Double Team'),('Reflect'),('Shock Wave'),('Flamethrower'),('Sludge Bomb'),('Sandstorm'),('Fire Blast'),('Rock Tomb'),('Aerial Ace'),('Torment'),('Facade'),('Secret Power'),('Rest'),('Attract'),('Thief'),('Steel Wing'),('Skill Swap'),('Snatch'),('Overheat'),('Roost'),('Focus Blast'),('Energy Ball'),('False Swipe'),('Brine'),('Fling'),('Charge Beam'),('Endure'),('Dragon Pulse'),('Drain Punch'),('Will-O-Wisp'),('Silver Wind'),('Embargo'),('Explosion'),('Shadow Claw'),('Payback'),('Recycle'),('Giga Impact'),('Rock Polish'),('Flash'),('Stone Edge'),('Avalanche'),('Thunder Wave'),('Gyro Ball'),('Swords Dance'),('Stealth Rock'),('Psych Up'),('Captivate'),('Dark Pulse'),('Rock Slide'),('X-Scissor'),('Sleep Talk'),('Natural Gift'),('Poison Jab'),('Dream Eater'),('Grass Knot'),('Swagger'),('Pluck'),('U-turn'),('Substitute'),('Flash Cannon'),('Trick Room'),('Hone Claws'),('Dragon Claw'),('Psyshock'),('Calm Mind'),('Roar'),('Toxic'),('Hail'),('Bulk Up'),('Venoshock'),('Hidden Power'),('Sunny Day'),('Taunt'),('Ice Beam'),('Blizzard'),('Hyper Beam'),('Light Screen'),('Protect'),('Rain Dance'),('Telekinesis'),('Safeguard'),('Frustration'),('SolarBeam'),('Smack Down'),('Thunderbolt'),('Thunder'),('Earthquake'),('Return'),('Dig'),('Psychic'),('Shadow Ball'),('Brick Break'),('Double Team'),('Reflect'),('Sludge Wave'),('Flamethrower'),('Sludge Bomb'),('Sandstorm'),('Fire Blast'),('Rock Tomb'),('Aerial Ace'),('Torment'),('Facade'),('Flame Charge'),('Rest'),('Attract'),('Thief'),('Low Sweep'),('Round'),('Echoed Voice'),('Overheat'),('Ally Switch'),('Focus Blast'),('Energy Ball'),('False Swipe'),('Scald'),('Fling'),('Charge Beam'),('Sky Drop'),('Incinerate'),('Quash'),('Will-O-Wisp'),('Acrobatics'),('Embargo'),('Explosion'),('Shadow Claw'),('Payback'),('Retaliate'),('Giga Impact'),('Rock Polish'),('Flash'),('Stone Edge'),('Volt Switch'),('Thunder Wave'),('Gyro Ball'),('Swords Dance'),('Struggle Bug'),('Psych Up'),('Bulldoze'),('Frost Breath'),('Rock Slide'),('X-Scissor'),('Dragon Tail'),('Work Up'),('Poison Jab'),('Dream Eater'),('Grass Knot'),('Swagger'),('Pluck'),('U-turn'),('Substitute'),('Flash Cannon'),('Trick Room'),('Wild Charge'),('Rock Smash'),('Snarl'),('Hone Claws'),('Dragon Claw'),('Psyshock'),('Calm Mind'),('Roar'),('Toxic'),('Hail'),('Bulk Up'),('Venoshock'),('Hidden Power'),('Sunny Day'),('Taunt'),('Ice Beam'),('Blizzard'),('Hyper Beam'),('Light Screen'),('Protect'),('Rain Dance'),('Roost'),('Safeguard'),('Frustration'),('Solar Beam'),('Smack Down'),('Thunderbolt'),('Thunder'),('Earthquake'),('Return'),('Dig'),('Psychic'),('Shadow Ball'),('Brick Break'),('Double Team'),('Reflect'),('Sludge Wave'),('Flamethrower'),('Sludge Bomb'),('Sandstorm'),('Fire Blast'),('Rock Tomb'),('Aerial Ace'),('Torment'),('Facade'),('Flame Charge'),('Rest'),('Attract'),('Thief'),('Low Sweep'),('Round'),('Echoed Voice'),('Overheat'),('Steel Wing'),('Focus Blast'),('Energy Ball'),('False Swipe'),('Scald'),('Fling'),('Charge Beam'),('Sky Drop'),('Incinerate'),('Quash'),('Will-O-Wisp'),('Acrobatics'),('Embargo'),('Explosion'),('Shadow Claw'),('Payback'),('Retaliate'),('Giga Impact'),('Rock Polish'),('Flash'),('Stone Edge'),('Volt Switch'),('Thunder Wave'),('Gyro Ball'),('Swords Dance'),('Struggle Bug'),('Psych Up'),('Bulldoze'),('Frost Breath'),('Rock Slide'),('X-Scissor'),('Dragon Tail'),('Infestation'),('Poison Jab'),('Dream Eater'),('Grass Knot'),('Swagger'),('Sleep Talk'),('U-turn'),('Substitute'),('Flash Cannon'),('Trick Room'),('Wild Charge'),('Rock Smash'),('Secret Power'),('Snarl'),('Nature Power'),('Dark Pulse'),('Power-Up Punch'),('Dazzling Gleam'),('Confide'),('Work Up'),('Dragon Claw'),('Psyshock'),('Calm Mind'),('Roar'),('Toxic'),('Hail'),('Bulk Up'),('Venoshock'),('Hidden Power'),('Sunny Day'),('Taunt'),('Ice Beam'),('Blizzard'),('Hyper Beam'),('Light Screen'),('Protect'),('Rain Dance'),('Roost'),('Safeguard'),('Frustration'),('Solar Beam'),('Smack Down'),('Thunderbolt'),('Thunder'),('Earthquake'),('Return'),('Leech Life'),('Psychic'),('Shadow Ball'),('Brick Break'),('Double Team'),('Reflect'),('Sludge Wave'),('Flamethrower'),('Sludge Bomb'),('Sandstorm'),('Fire Blast'),('Rock Tomb'),('Aerial Ace'),('Torment'),('Facade'),('Flame Charge'),('Rest'),('Attract'),('Thief'),('Low Sweep'),('Round'),('Echoed Voice'),('Overheat'),('Steel Wing'),('Focus Blast'),('Energy Ball'),('False Swipe'),('Scald'),('Fling'),('Charge Beam'),('Sky Drop'),('Brutal Swing'),('Quash'),('Will-O-Wisp'),('Acrobatics'),('Embargo'),('Explosion'),('Shadow Claw'),('Payback'),('Smart Strike'),('Giga Impact'),('Rock Polish'),('Aurora Veil'),('Stone Edge'),('Volt Switch'),('Thunder Wave'),('Gyro Ball'),('Swords Dance'),('Fly'),('Psych Up'),('Bulldoze'),('Frost Breath'),('Rock Slide'),('X-Scissor'),('Dragon Tail'),('Infestation'),('Poison Jab'),('Dream Eater'),('Grass Knot'),('Swagger'),('Sleep Talk'),('U-turn'),('Substitute'),('Flash Cannon'),('Trick Room'),('Wild Charge'),('Surf'),('Snarl'),('Nature Power'),('Dark Pulse'),('Waterfall'),('Dazzling Gleam'),('Confide'),('Headbutt'),('Taunt'),('Helping Hand'),('Teleport'),('Rest'),('Light Screen'),('Protect'),('Substitute'),('Reflect'),('Dig'),('Will-O-Wisp'),('Facade'),('Brick Break'),('Fly'),('Seismic Toss'),('Thunder Wave'),('Dragon Tail'),('U-turn'),('Iron Tail'),('Dark Pulse'),('Foul Play'),('Rock Slide'),('Thunder Punch'),('X-Scissor'),('Waterfall'),('Poison Jab'),('Toxic'),('Tri Attack'),('Scald'),('Bulk Up'),('Fire Punch'),('Dazzling Gleam'),('Calm Mind'),('Dragon Pulse'),('Ice Punch'),('Thunderbolt'),('Flamethrower'),('Thunder'),('Outrage'),('Psychic'),('Earthquake'),('Self-Destruct'),('Shadow Ball'),('Play Rough'),('Solar Beam'),('Fire Blast'),('Surf'),('Hyper Beam'),('Superpower'),('Roost'),('Blizzard'),('Sludge Bomb'),('Mega Drain'),('Flash Cannon'),('Ice Beam'),('Stealth Rock'),('Pay Day'),('Drill Run'),('Dream Eater'),('Megahorn'),('');
/*!40000 ALTER TABLE `tm_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trades`
--

DROP TABLE IF EXISTS `trades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trades` (
  `tradeID` int NOT NULL AUTO_INCREMENT,
  `listingID` int NOT NULL,
  `replyID` int NOT NULL,
  `time` datetime DEFAULT '2000-01-01 00:00:00',
  PRIMARY KEY (`tradeID`),
  KEY `listingID` (`listingID`),
  KEY `replyID` (`replyID`),
  CONSTRAINT `trades_ibfk_1` FOREIGN KEY (`listingID`) REFERENCES `listing` (`listingID`),
  CONSTRAINT `trades_ibfk_2` FOREIGN KEY (`replyID`) REFERENCES `reply` (`replyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trades`
--

LOCK TABLES `trades` WRITE;
/*!40000 ALTER TABLE `trades` DISABLE KEYS */;
/*!40000 ALTER TABLE `trades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `typefx`
--

DROP TABLE IF EXISTS `typefx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `typefx` (
  `type1` varchar(10) NOT NULL,
  `type2` varchar(10) NOT NULL,
  `double_strength` bit(1) NOT NULL,
  `half_strength` bit(1) NOT NULL,
  `no_impact` bit(1) NOT NULL,
  PRIMARY KEY (`type1`,`type2`),
  CONSTRAINT `typefx_chk_1` CHECK ((((`half_strength` + `double_strength`) + `no_impact`) = 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `typefx`
--

LOCK TABLES `typefx` WRITE;
/*!40000 ALTER TABLE `typefx` DISABLE KEYS */;
/*!40000 ALTER TABLE `typefx` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `types`
--

DROP TABLE IF EXISTS `types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `types` (
  `type` varchar(10) NOT NULL,
  PRIMARY KEY (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `types`
--

LOCK TABLES `types` WRITE;
/*!40000 ALTER TABLE `types` DISABLE KEYS */;
/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `uID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `tradeCount` int NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  PRIMARY KEY (`uID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `password` (`password`),
  CONSTRAINT `user_chk_1` CHECK (((length(`password`) > 7) and regexp_like(`password`,_utf8mb4'[0-9]') and regexp_like(`password`,_utf8mb4'[a-z]') and regexp_like(`password`,_utf8mb4'[A-Z]') and regexp_like(`password`,_utf8mb4'[^a-zA-Z0-9]')))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (4,'Cynthia',5,'championcyn','Garchomp142*'),(5,'Gary Oak',2,'rivalgary','Eeveelutions21*'),(6,'Erika',1,'flowerqueen','Bellsprout13*'),(7,'Felicity',0,'sugarAndSpice','Pa$$word15'),(8,'Marco',0,'fireFang','M4rc0!Burns'),(9,'Sierra',0,'crystalLeaf','S!3rr@2025');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `users_pokedex`
--

DROP TABLE IF EXISTS `users_pokedex`;
/*!50001 DROP VIEW IF EXISTS `users_pokedex`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `users_pokedex` AS SELECT 
 1 AS `pid`,
 1 AS `Name`,
 1 AS `type1`,
 1 AS `type2`,
 1 AS `HP`,
 1 AS `Atk`,
 1 AS `Def`,
 1 AS `SpAtk`,
 1 AS `SpDef`,
 1 AS `Speed`,
 1 AS `caught_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'pokedex'
--

--
-- Dumping routines for database 'pokedex'
--
/*!50003 DROP PROCEDURE IF EXISTS `doTrade` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `doTrade`(tradeID INT)
BEGIN

	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    
    START TRANSACTION;
		DROP TABLE IF EXISTS tradeGoingThrough;

		CREATE TABLE tradeGoingThrough as (
		SELECT l.listingID, r.replyID, l.instanceID as forSalePokemon, l.sellerID AS seller, r.instanceID AS replyPokemon, r.respondantID as replyer
		FROM reply r, listing l
		WHERE r.listingID = l.listingID AND r.replyID = tradeID);
        
		-- delete conflicting active replies and listings
		DELETE FROM Reply
        WHERE instanceID IN (
			(SELECT forSalePokemon AS instanceID FROM tradeGoingThrough) 
            UNION 
            (SELECT replyPokemon AS instanceID FROM tradeGoingThrough)
		) AND replyID NOT IN (
			(SELECT replyID FROM tradeGoingThrough)
            UNION
            (SELECT replyID FROM trades)
		);
		DELETE FROM Listing
        WHERE instanceID IN (
			(SELECT forSalePokemon AS instanceID FROM tradeGoingThrough) 
            UNION 
            (SELECT replyPokemon AS instanceID FROM tradeGoingThrough)
		) AND listingID NOT IN (
			(SELECT listingID FROM tradeGoingThrough)
            UNION
            (SELECT listingID FROM trades)
		);

		-- actually swap ownership
		UPDATE mypokemon seller, mypokemon replyer, tradeGoingThrough
		SET seller.uid = tradeGoingThrough.replyer, replyer.uid = tradeGoingThrough.seller
		WHERE seller.instanceID = tradeGoingThrough.forSalePokemon AND replyer.instanceID = tradeGoingThrough.replyPokemon;
        
        -- reset pokemonInstance bit values
        UPDATE myPokemon 
        SET favourite=0, onteam=0, showcase=0, dateAdded=NOW()
        WHERE instanceID IN (SELECT forSalePokemon FROM tradeGoingThrough) OR instanceID IN (SELECT replyPokemon FROM tradeGoingThrough);

		-- increment each users trade count
		UPDATE user, tradeGoingThrough
		SET tradeCount = tradecount + 1
		WHERE uID = tradeGoingThrough.seller;

		UPDATE user, tradeGoingThrough
		SET tradeCount = tradecount + 1
		WHERE uID = tradeGoingThrough.replyer;

		-- add completed trade to trade table
		INSERT INTO trades (listingID, replyID, time)
		SELECT listingID, replyID, NOW() FROM tradeGoingThrough;

		DROP TABLE tradeGoingThrough;
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `populateNumbers` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `populateNumbers`(min INT, max INT)
BEGIN
    DECLARE i INT;
    SET i = min;
    numLoop: LOOP 
        INSERT INTO numbers(num) VALUES (i);
        IF i = max THEN
            LEAVE numLoop;
        END IF;
        SET i = i + 1;
    END LOOP numLoop;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tradeStatus` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tradeStatus`()
BEGIN

SELECT 
    tradeID,
    listingID,
    replyID
FROM trades;

SELECT
	listingID,
    nickname AS pokemon,
    user.name AS seller
FROM listing JOIN myPokemon ON listing.instanceID = myPokemon.instanceID JOIN user ON listing.sellerID = user.uid;

SELECT
	replyID,
    listingID,
    nickname AS pokemon,
    user.name AS respondant
FROM reply JOIN myPokemon ON reply.instanceID = myPokemon.instanceId JOIN user ON reply.respondantID = user.uid;

SELECT 
	user.name,
    nickname AS pokemon
FROM myPokemon JOIN user ON user.uid = myPokemon.uid
ORDER BY user.uid;


END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `users_pokedex`
--

/*!50001 DROP VIEW IF EXISTS `users_pokedex`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `users_pokedex` AS select `p`.`pID` AS `pid`,`p`.`name` AS `Name`,`p`.`type1` AS `type1`,`p`.`type2` AS `type2`,`p`.`hp` AS `HP`,`p`.`atk` AS `Atk`,`p`.`def` AS `Def`,`p`.`spAtk` AS `SpAtk`,`p`.`spDef` AS `SpDef`,`p`.`speed` AS `Speed`,count(`mp`.`instanceID`) AS `caught_count` from (`pokedex` `p` left join `mypokemon` `mp` on(((`p`.`pID` = `mp`.`pID`) and (`mp`.`uID` = 4)))) group by `p`.`pID`,`p`.`name`,`p`.`type1`,`p`.`type2`,`p`.`hp`,`p`.`atk`,`p`.`def`,`p`.`spAtk`,`p`.`spDef`,`p`.`speed` order by `p`.`pID` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-29 21:58:35
